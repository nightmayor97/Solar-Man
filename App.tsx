import React, { useState, useCallback, useMemo, createContext, useContext } from 'react';
import type { User, Tutorial, Ticket, TicketMessage, Document, ExpressionOfInterest, Notification, Toast } from './types';
import { MOCK_USERS, MOCK_TUTORIALS, MOCK_TICKETS, MOCK_EXPRESSIONS_OF_INTEREST } from './data/mockData';
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
    login: (role: AuthRole, userId?: string) => void;
    logout: () => void;
    updateUser: (updatedUser: User) => void;
    addUser: (newUser: User) => void;
    deleteUser: (userId: string) => void;
    updateTutorials: (tutorials: Tutorial[]) => void;
    addTicket: (newTicketData: { subject: string; message: string; customerId: string; complaintType: string; photoUrls?: string[]; }) => void;
    addTicketMessage: (ticketId: string, message: { text: string; sender: 'customer' | 'admin' }) => void;
    updateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
    addDocumentToUser: (userId: string, document: Document) => void;
    addDocumentToAllCustomers: (documentData: { name: string; url: string }) => void;
    addExpressionOfInterest: (name: string, email: string, phone: string) => void;
    updateEoiStatus: (eoiId: string, status: ExpressionOfInterest['status']) => void;
    markNotificationAsRead: (notificationId: string) => void;
    markAllNotificationsAsRead: (userId: string) => void;
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
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [tutorials, setTutorials] = useState<Tutorial[]>(MOCK_TUTORIALS);
    const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
    const [expressionsOfInterest, setExpressionsOfInterest] = useState<ExpressionOfInterest[]>(MOCK_EXPRESSIONS_OF_INTEREST);
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 'noti1', userId: 'customer1', message: "Welcome to your new portal!", type: 'general', isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'noti2', userId: 'customer1', message: "Your warranty document has been uploaded.", type: 'document', relatedId: 'doc2', isRead: false, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'noti3', userId: 'admin1', message: "John Doe created a new ticket.", type: 'ticket', relatedId: 'ticket1', isRead: true, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { id: 'noti4', userId: 'admin1', message: "A new Expression of Interest was submitted.", type: 'eoi', relatedId: 'eoi1', isRead: false, createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    ]);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: Toast['type']) => {
        const id = `toast-${Date.now()}`;
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
        const newNotification: Notification = {
            ...notificationData,
            id: `noti${Date.now()}`,
            createdAt: new Date().toISOString(),
            isRead: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markNotificationAsRead = useCallback((notificationId: string) => {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    }, []);

    const markAllNotificationsAsRead = useCallback((userId: string) => {
        setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, isRead: true } : n));
    }, []);

    const login = useCallback((role: AuthRole, userId: string = 'customer1') => {
        if (role === 'customer') {
            const user = users.find(u => u.id === userId && u.role === 'customer');
            setCurrentUser(user || users.find(u => u.role === 'customer')!);
        } else if (role === 'admin') {
            const user = users.find(u => u.role === 'admin');
            setCurrentUser(user!);
        }
    }, [users]);

    const logout = useCallback(() => {
        setCurrentUser(null);
    }, []);

    const updateUser = (updatedUser: User) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    };

    const addUser = (newUser: User) => {
        setUsers([...users, newUser]);
    };

    const deleteUser = (userId: string) => {
        setUsers(users.filter(u => u.id !== userId));
    };
    
    const updateTutorials = (newTutorials: Tutorial[]) => {
        setTutorials(newTutorials);
    };

    const addTicket = (newTicketData: { subject: string; message: string; customerId: string; complaintType: string; photoUrls?: string[]; }) => {
        const customer = users.find(u => u.id === newTicketData.customerId);
        if (!customer) return;

        const now = new Date().toISOString();
        const newTicket: Ticket = {
            id: `ticket${Date.now()}`,
            customerId: newTicketData.customerId,
            customerName: customer.fullName,
            subject: newTicketData.subject,
            status: 'Open',
            createdAt: now,
            messages: [{
                id: `msg${Date.now()}`,
                sender: 'customer',
                text: newTicketData.message,
                timestamp: now,
            }],
            complaintType: newTicketData.complaintType,
            photoUrls: newTicketData.photoUrls || [],
        };
        setTickets([newTicket, ...tickets]);
        addToast('Your ticket has been submitted successfully!', 'ticket');

        // Notify all admins
        const admins = users.filter(u => u.role === 'admin');
        admins.forEach(admin => {
            addNotification({
                userId: admin.id,
                message: `New ticket from ${customer.fullName}: "${newTicket.subject}"`,
                type: 'ticket',
                relatedId: newTicket.id
            });
        });
    };

    const addTicketMessage = (ticketId: string, message: { text: string; sender: 'customer' | 'admin' }) => {
        let ticketCustomerId = '';
        let ticketSubject = '';

        setTickets(tickets.map(ticket => {
            if (ticket.id === ticketId) {
                ticketCustomerId = ticket.customerId;
                ticketSubject = ticket.subject;
                const newMessage: TicketMessage = {
                    id: `msg${Date.now()}`,
                    sender: message.sender,
                    text: message.text,
                    timestamp: new Date().toISOString()
                };
                return { ...ticket, messages: [...ticket.messages, newMessage] };
            }
            return ticket;
        }));
        
        addToast('Your message has been sent.', 'ticket');

        // Send notification
        if (message.sender === 'admin') {
            addNotification({
                userId: ticketCustomerId,
                message: `An admin replied to your ticket: "${ticketSubject}"`,
                type: 'ticket',
                relatedId: ticketId
            });
        } else {
            const customer = users.find(u => u.id === ticketCustomerId);
            const admins = users.filter(u => u.role === 'admin');
            admins.forEach(admin => {
                addNotification({
                    userId: admin.id,
                    message: `${customer?.fullName || 'A customer'} replied to ticket: "${ticketSubject}"`,
                    type: 'ticket',
                    relatedId: ticketId
                });
            });
        }
    };

    const updateTicketStatus = (ticketId: string, status: Ticket['status']) => {
        let ticketCustomerId = '';
        let ticketSubject = '';
        setTickets(tickets.map(ticket => {
            if (ticket.id === ticketId) {
                ticketCustomerId = ticket.customerId;
                ticketSubject = ticket.subject;
                return { ...ticket, status };
            }
            return ticket;
        }));

        addToast(`Ticket status updated to ${status}.`, 'ticket');

        addNotification({
            userId: ticketCustomerId,
            message: `The status of your ticket "${ticketSubject}" was updated to ${status}.`,
            type: 'ticket',
            relatedId: ticketId
        });
    };
    
    const addDocumentToUser = (userId: string, document: Document) => {
        let userFullName = '';
        setUsers(prevUsers => 
            prevUsers.map(user => {
                if (user.id === userId) {
                    userFullName = user.fullName;
                    return {
                        ...user,
                        documents: [...user.documents, document]
                    };
                }
                return user;
            })
        );
        addToast(`Document "${document.name}" added for ${userFullName}.`, 'document');
        addNotification({
            userId: userId,
            message: `A new document "${document.name}" was added to your profile.`,
            type: 'document',
            relatedId: document.id
        });
    };

    const addDocumentToAllCustomers = useCallback((documentData: { name: string; url: string }) => {
        const uploadedAt = new Date().toISOString();

        const updatedUsers = users.map(user => {
            if (user.role === 'customer') {
                const newDoc: Document = {
                    id: `doc_${Date.now()}_${user.id}`,
                    name: documentData.name,
                    url: documentData.url,
                    uploadedAt: uploadedAt,
                };
                addNotification({
                    userId: user.id,
                    message: `A new document "${newDoc.name}" was added to your profile.`,
                    type: 'document',
                    relatedId: newDoc.id
                });
                return {
                    ...user,
                    documents: [...user.documents, newDoc]
                };
            }
            return user;
        });
        setUsers(updatedUsers);
        addToast(`"${documentData.name}" was sent to all customers.`, 'document');
    }, [users, addNotification, addToast]);

    const addExpressionOfInterest = (name: string, email: string, phone: string) => {
        const newExpression: ExpressionOfInterest = {
            id: `eoi${Date.now()}`,
            name,
            email,
            phone,
            submittedAt: new Date().toISOString(),
            status: 'pending',
        };
        setExpressionsOfInterest([newExpression, ...expressionsOfInterest]);
        addToast('Your enquiry has been submitted successfully!', 'eoi');

        const admins = users.filter(u => u.role === 'admin');
        admins.forEach(admin => {
            addNotification({
                userId: admin.id,
                message: `New access enquiry from ${name}.`,
                type: 'eoi',
                relatedId: newExpression.id
            });
        });
    };
    
    const updateEoiStatus = useCallback((eoiId: string, status: ExpressionOfInterest['status']) => {
        setExpressionsOfInterest(prevExpressions =>
            prevExpressions.map(eoi =>
                eoi.id === eoiId ? { ...eoi, status } : eoi
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