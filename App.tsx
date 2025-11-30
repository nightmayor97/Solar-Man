import React, { useState, useCallback, useMemo, createContext, useContext, useEffect } from 'react';
import type { User, Tutorial, Ticket, TicketMessage, Document, ExpressionOfInterest, Notification, Toast } from './types';
import * as api from './services/apiService';
import LoginScreen from './screens/LoginScreen';
import CustomerLayout from './screens/customer/CustomerLayout';
import AdminLayout from './screens/admin/AdminLayout';
import ToastContainer from './components/ToastContainer';

type AuthRole = 'customer' | 'admin' | null;

interface AppContextType {
    currentUser: User | null;
    users: User[];
    tutorials: Tutorial[];
    tickets: Ticket[];
    expressionsOfInterest: ExpressionOfInterest[];
    notifications: Notification[];
    toasts: Toast[];
    addToast: (message: string, type: Toast['type']) => void;
    removeToast: (id: string) => void;
    login: (role: AuthRole, credentials?: { email?: string; password?: string }) => void;
    logout: () => void;
    updateUser: (updatedUser: User) => Promise<void>;
    addUser: (newUser: Omit<User, 'id' | 'role' | 'documents'>) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    updateTutorials: (tutorials: Tutorial[]) => Promise<void>;
    addTicket: (newTicketData: { subject: string; message: string; customerId: string; complaintType: string; photoUrls?: string[]; }) => Promise<void>;
    addTicketMessage: (ticketId: string, message: { text: string; sender: 'customer' | 'admin' }) => Promise<void>;
    updateTicketStatus: (ticketId: string, status: Ticket['status']) => Promise<void>;
    addDocumentToUser: (userId: string, document: Omit<Document, 'id' | 'uploadedAt'>) => Promise<void>;
    addDocumentToAllCustomers: (documentData: { name: string; url: string }) => Promise<void>;
    addExpressionOfInterest: (name: string, email: string, phone: string) => Promise<void>;
    updateEoiStatus: (eoiId: string, status: ExpressionOfInterest['status']) => Promise<void>;
    markNotificationAsRead: (notificationId: string) => Promise<void>;
    markAllNotificationsAsRead: (userId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [expressionsOfInterest, setExpressionsOfInterest] = useState<ExpressionOfInterest[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [toasts, setToasts] = useState<Toast[]>([]);
    
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [
                    fetchedUsers, 
                    fetchedTutorials, 
                    fetchedTickets, 
                    fetchedEois,
                    fetchedNotifications
                ] = await Promise.all([
                    api.getUsers(),
                    api.getTutorials(),
                    api.getTickets(),
                    api.getExpressionsOfInterest(),
                    api.getNotifications()
                ]);
                setUsers(fetchedUsers);
                setTutorials(fetchedTutorials);
                setTickets(fetchedTickets);
                setExpressionsOfInterest(fetchedEois);
                setNotifications(fetchedNotifications);
            } catch (error) {
                console.error("Failed to fetch initial data", error);
                addToast("Could not load app data. Please refresh.", 'general');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const addToast = useCallback((message: string, type: Toast['type']) => {
        const id = `toast-${Date.now()}`;
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addNotification = useCallback(async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
        const newNotification = await api.addNotification(notificationData);
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markNotificationAsRead = useCallback(async (notificationId: string) => {
        const updatedNotifications = await api.markNotificationAsRead(notificationId);
        setNotifications(updatedNotifications);
    }, []);

    const markAllNotificationsAsRead = useCallback(async (userId: string) => {
        const updatedNotifications = await api.markAllNotificationsAsRead(userId);
        setNotifications(updatedNotifications);
    }, []);

    const login = useCallback(async (role: AuthRole, credentials?: { email?: string; password?: string }) => {
        const allUsers = await api.getUsers();
        if (role === 'customer') {
            if (!credentials || !credentials.email || !credentials.password) {
                addToast('Please provide email and password.', 'general');
                return;
            }
            const user = allUsers.find(u => u.role === 'customer' && u.email.toLowerCase() === credentials.email?.toLowerCase() && u.password === credentials.password);
            if (user) {
                setCurrentUser(user);
            } else {
                addToast('Invalid email or password.', 'general');
            }
        } else if (role === 'admin') {
            const user = allUsers.find(u => u.role === 'admin');
            setCurrentUser(user!);
        }
    }, [addToast]);

    const logout = useCallback(() => {
        setCurrentUser(null);
    }, []);

    const updateUser = async (updatedUser: User) => {
        const returnedUser = await api.updateUser(updatedUser);
        setUsers(users.map(u => u.id === returnedUser.id ? returnedUser : u));
        if (currentUser?.id === returnedUser.id) {
            setCurrentUser(returnedUser);
        }
    };

    const addUser = async (newUserData: Omit<User, 'id' | 'role' | 'documents'>) => {
        const newUser = await api.addUser(newUserData);
        setUsers(prev => [...prev, newUser]);
    };

    const deleteUser = async (userId: string) => {
        await api.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
    };
    
    const updateTutorials = async (newTutorials: Tutorial[]) => {
        await api.updateTutorials(newTutorials);
        setTutorials(newTutorials);
    };

    const addTicket = async (newTicketData: { subject: string; message: string; customerId: string; complaintType: string; photoUrls?: string[]; }) => {
        const customer = users.find(u => u.id === newTicketData.customerId);
        if (!customer) return;

        const newTicket = await api.addTicket(newTicketData);
        setTickets(prevTickets => [newTicket, ...prevTickets]);
        addToast('Your ticket has been submitted successfully!', 'ticket');

        const admins = users.filter(u => u.role === 'admin');
        for (const admin of admins) {
            await addNotification({
                userId: admin.id,
                message: `New ticket from ${customer.fullName}: "${newTicket.subject}"`,
                type: 'ticket',
                relatedId: newTicket.id
            });
        }
    };

    const addTicketMessage = async (ticketId: string, message: { text: string; sender: 'customer' | 'admin' }) => {
        const updatedTicket = await api.addTicketMessage(ticketId, message);
        setTickets(prevTickets => prevTickets.map(ticket => ticket.id === ticketId ? updatedTicket : ticket));
        addToast('Your message has been sent.', 'ticket');

        if (message.sender === 'admin') {
            await addNotification({
                userId: updatedTicket.customerId,
                message: `An admin replied to your ticket: "${updatedTicket.subject}"`,
                type: 'ticket',
                relatedId: ticketId
            });
        } else {
            const customer = users.find(u => u.id === updatedTicket.customerId);
            const admins = users.filter(u => u.role === 'admin');
            for (const admin of admins) {
                await addNotification({
                    userId: admin.id,
                    message: `${customer?.fullName || 'A customer'} replied to ticket: "${updatedTicket.subject}"`,
                    type: 'ticket',
                    relatedId: ticketId
                });
            }
        }
    };

    const updateTicketStatus = async (ticketId: string, status: Ticket['status']) => {
        const updatedTicket = await api.updateTicketStatus(ticketId, status);
        setTickets(prevTickets => prevTickets.map(ticket => ticket.id === ticketId ? updatedTicket : ticket));

        addToast(`Ticket status updated to ${status}.`, 'ticket');

        await addNotification({
            userId: updatedTicket.customerId,
            message: `The status of your ticket "${updatedTicket.subject}" was updated to ${status}.`,
            type: 'ticket',
            relatedId: ticketId
        });
    };
    
    const addDocumentToUser = async (userId: string, document: Omit<Document, 'id' | 'uploadedAt'>) => {
        const { updatedUser, newDocument } = await api.addDocumentToUser(userId, document);
        
        setUsers(prevUsers => prevUsers.map(user => user.id === userId ? updatedUser : user));
        
        addToast(`Document "${document.name}" added for ${updatedUser.fullName}.`, 'document');
        await addNotification({
            userId: userId,
            message: `A new document "${document.name}" was added to your profile.`,
            type: 'document',
            relatedId: newDocument.id
        });
    };

    const addDocumentToAllCustomers = useCallback(async (documentData: { name: string; url: string }) => {
        const updatedUsers = await api.addDocumentToAllCustomers(documentData);
        setUsers(updatedUsers);

        for (const user of updatedUsers) {
            if (user.role === 'customer') {
                const newDoc = user.documents[user.documents.length - 1];
                 if (newDoc && newDoc.name === documentData.name) {
                    await addNotification({
                        userId: user.id,
                        message: `A new document "${newDoc.name}" was added to your profile.`,
                        type: 'document',
                        relatedId: newDoc.id,
                    });
                }
            }
        }
        addToast(`"${documentData.name}" was sent to all customers.`, 'document');
    }, [addNotification, addToast]);

    const addExpressionOfInterest = async (name: string, email: string, phone: string) => {
        const { newExpression, admins } = await api.addExpressionOfInterest(name, email, phone);
        setExpressionsOfInterest(prevEois => [newExpression, ...prevEois]);
        addToast('Your enquiry has been submitted successfully!', 'eoi');

        for (const admin of admins) {
            await addNotification({
                userId: admin.id,
                message: `New access enquiry from ${name}.`,
                type: 'eoi',
                relatedId: newExpression.id
            });
        }
    };
    
    const updateEoiStatus = useCallback(async (eoiId: string, status: ExpressionOfInterest['status']) => {
        const updatedEoi = await api.updateEoiStatus(eoiId, status);
        setExpressionsOfInterest(prevExpressions =>
            prevExpressions.map(eoi =>
                eoi.id === eoiId ? updatedEoi : eoi
            )
        );
    }, []);


    const contextValue = useMemo(() => ({
        currentUser,
        users,
        tutorials,
        tickets,
        expressionsOfInterest,
        notifications,
        toasts,
        addToast,
        removeToast,
        login,
        logout,
        updateUser,
        addUser,
        deleteUser,
        updateTutorials,
        addTicket,
        addTicketMessage,
        updateTicketStatus,
        addDocumentToUser,
        addDocumentToAllCustomers,
        addExpressionOfInterest,
        updateEoiStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
    }), [currentUser, users, tutorials, tickets, expressionsOfInterest, notifications, toasts, login, logout, addDocumentToAllCustomers, updateEoiStatus, markNotificationAsRead, markAllNotificationsAsRead, addToast, removeToast]);

    const renderContent = () => {
        if (isLoading) {
             return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-xl font-semibold text-secondary-dark">Loading Portal...</div>
                </div>
            );
        }
        if (!currentUser) {
            return <LoginScreen onLogin={login} />;
        }
        if (currentUser.role === 'customer') {
            return <CustomerLayout />;
        }
        if (currentUser.role === 'admin') {
            return <AdminLayout />;
        }
        return null;
    };

    return (
        <AppContext.Provider value={contextValue}>
            <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
                <ToastContainer />
                {renderContent()}
            </div>
        </AppContext.Provider>
    );
};

export default App;
