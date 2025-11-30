
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppContext } from '../../App';
import { DashboardIcon, UsersIcon, TutorialIcon, ChatIcon, LogoutIcon, MenuIcon, TicketIcon, DocumentIcon, InterestIcon, BellIcon, ChartIcon, BotIcon } from '../../components/Icons';
import AdminDashboard from './Dashboard';
import CustomerManagement from './CustomerManagement';
import TutorialManagement from './TutorialManagement';
import AiSolutionChat from '../../components/AiSolutionChat';
import TicketManagement from './TicketManagement';
import DocumentUpload from './DocumentUpload';
import ExpressionOfInterest from './ExpressionOfInterest';
import Reports from './Reports';
import GeminiPage from './GeminiPage';
import NotificationPanel from '../../components/NotificationPanel';
import type { Notification } from '../../types';

type AdminView = 'dashboard' | 'customers' | 'tickets' | 'documents' | 'tutorials' | 'ai-chat' | 'interest' | 'reports' | 'gemini';

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <li
        className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
            active ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
        onClick={onClick}
    >
        {icon}
        <span className="ml-3">{label}</span>
    </li>
);

const AdminLayout: React.FC = () => {
    const { currentUser, logout, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationPanelOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userNotifications = useMemo(() => {
        if (!currentUser) return [];
        return notifications.filter(n => n.userId === currentUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [notifications, currentUser]);

    const unreadCount = useMemo(() => {
        return userNotifications.filter(n => !n.isRead).length;
    }, [userNotifications]);
    
    const handleNotificationClick = (notification: Notification) => {
        markNotificationAsRead(notification.id);
        if (notification.type === 'ticket') {
            setActiveView('tickets');
        } else if (notification.type === 'eoi') {
            setActiveView('interest');
        }
        setIsNotificationPanelOpen(false);
    };

    const handleMarkAllRead = () => {
        if (currentUser) {
            markAllNotificationsAsRead(currentUser.id);
        }
    };


    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <AdminDashboard />;
            case 'customers': return <CustomerManagement />;
            case 'tickets': return <TicketManagement />;
            case 'documents': return <DocumentUpload />;
            case 'tutorials': return <TutorialManagement />;
            case 'ai-chat': return <AiSolutionChat />;
            case 'interest': return <ExpressionOfInterest />;
            case 'reports': return <Reports />;
            case 'gemini': return <GeminiPage />;
            default: return <AdminDashboard />;
        }
    };

    const navItems = [
        { id: 'dashboard', icon: <DashboardIcon className="w-5 h-5" />, label: 'Dashboard' },
        { id: 'customers', icon: <UsersIcon className="w-5 h-5" />, label: 'Customer Management' },
        { id: 'interest', icon: <InterestIcon className="w-5 h-5" />, label: 'Expression of Interest' },
        { id: 'tickets', icon: <TicketIcon className="w-5 h-5" />, label: 'Ticket Management' },
        { id: 'reports', icon: <ChartIcon className="w-5 h-5" />, label: 'Reports' },
        { id: 'documents', icon: <DocumentIcon className="w-5 h-5" />, label: 'Document Upload' },
        { id: 'tutorials', icon: <TutorialIcon className="w-5 h-5" />, label: 'Tutorial Management' },
        { id: 'gemini', icon: <BotIcon className="w-5 h-5" />, label: 'Gemini Tools' },
        { id: 'ai-chat', icon: <ChatIcon className="w-5 h-5" />, label: 'AI Chat Assistant' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
             {/* Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                ></div>
            )}

            <aside className={`w-64 bg-gray-800 text-white flex flex-col fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
                 <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-white whitespace-nowrap">Solar Man Admin</h1>
                </div>
                <nav className="flex-1 px-2 py-4">
                    <ul>
                        {navItems.map(item => (
                             <NavItem 
                                key={item.id}
                                icon={item.icon} 
                                label={item.label} 
                                active={activeView === item.id} 
                                onClick={() => {
                                    setActiveView(item.id as AdminView);
                                    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
                                }}
                            />
                        ))}
                    </ul>
                </nav>
                 <div className="px-2 py-4 border-t border-gray-700">
                    <NavItem icon={<LogoutIcon className="w-5 h-5" />} label="Logout" active={false} onClick={logout} />
                </div>
            </aside>
            <div className="flex-1 flex flex-col w-full">
                <header className="bg-white shadow-md p-4 flex justify-between items-center h-16 sticky top-0 z-20">
                    <div className="flex items-center">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 focus:outline-none md:hidden mr-4" aria-label="Open sidebar">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-secondary-dark">Admin Portal</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <span className="text-gray-600">Welcome, </span>
                            <span className="text-gray-800 font-semibold">{currentUser?.fullName}</span>
                        </div>
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationPanelOpen(prev => !prev)}
                                className="relative text-gray-500 hover:text-secondary-dark"
                                aria-label="Toggle notifications"
                            >
                                <BellIcon className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            {isNotificationPanelOpen && (
                                <NotificationPanel
                                    notifications={userNotifications}
                                    onNotificationClick={handleNotificationClick}
                                    onMarkAllAsRead={handleMarkAllRead}
                                />
                            )}
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto relative">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
