import type { User, Tutorial, Ticket, TicketMessage, Document, ExpressionOfInterest, Notification } from '../types';
import { 
    loadUsers, saveUsers, 
    loadTutorials, saveTutorials, 
    loadTickets, saveTickets, 
    loadExpressionsOfInterest, saveExpressionsOfInterest,
    loadNotifications, saveNotifications
} from './storageService';

// CONFIGURATION
// Set this to 'true' when you have the Node.js/SQL backend running at API_URL
const USE_REAL_API = false; 
const API_URL = 'http://localhost:3000/api';

const SIMULATED_DELAY = 100; // ms for mock

// --- Generic async helper for Mock Data ---
const performAsync = <T>(action: () => T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(action());
        }, SIMULATED_DELAY);
    });
};

// Helper to handle API errors
const handleApiError = (error: any) => {
    console.error("API Call Failed:", error);
    throw error;
};

// --- Users API ---
export const getUsers = async (): Promise<User[]> => {
    if (USE_REAL_API) {
        try {
            const res = await fetch(`${API_URL}/users`);
            if (!res.ok) throw new Error('Failed to fetch users');
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }
    return performAsync(loadUsers);
};

export const updateUser = async (updatedUser: User): Promise<User> => {
    if (USE_REAL_API) {
        try {
            const res = await fetch(`${API_URL}/users/${updatedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            });
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }
    return performAsync(() => {
        const users = loadUsers();
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        saveUsers(updatedUsers);
        return updatedUser;
    });
};

export const addUser = async (newUserData: Omit<User, 'id' | 'role' | 'documents'>): Promise<User> => {
    const newUser: User = {
        ...newUserData,
        id: `customer${Date.now()}`,
        role: 'customer',
        documents: [],
    };

    if (USE_REAL_API) {
        try {
            const res = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }

    return performAsync(() => {
        const users = loadUsers();
        const updatedUsers = [...users, newUser];
        saveUsers(updatedUsers);
        return newUser;
    });
};

export const deleteUser = async (userId: string): Promise<void> => {
    if (USE_REAL_API) {
        try {
            await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' });
            return;
        } catch (e) { return handleApiError(e); }
    }
    return performAsync(() => {
        const users = loadUsers();
        const updatedUsers = users.filter(u => u.id !== userId);
        saveUsers(updatedUsers);
    });
};

// --- Tutorials API ---
export const getTutorials = async (): Promise<Tutorial[]> => {
    if (USE_REAL_API) {
        try {
            const res = await fetch(`${API_URL}/tutorials`);
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }
    return performAsync(loadTutorials);
};

export const updateTutorials = async (tutorials: Tutorial[]): Promise<void> => {
    if (USE_REAL_API) {
        // Implementation for bulk update would go here, often POSTing the whole list
        // or individual PUT/POSTs.
        return; 
    }
    return performAsync(() => saveTutorials(tutorials));
};

// --- Tickets API ---
export const getTickets = async (): Promise<Ticket[]> => {
    if (USE_REAL_API) {
        try {
            const res = await fetch(`${API_URL}/tickets`);
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }
    return performAsync(loadTickets);
};

export const addTicket = async (newTicketData: { subject: string; message: string; customerId: string; complaintType: string; photoUrls?: string[]; }): Promise<Ticket> => {
    if (USE_REAL_API) {
        // Need to fetch user details first to get name, or handle on backend
        // For simplicity, passing ID and letting backend handle or assuming data is passed
        const users = await getUsers(); // Or assume we have current user context
        const customer = users.find(u => u.id === newTicketData.customerId);
        
        const payload = {
            id: `ticket${Date.now()}`,
            ...newTicketData,
            customerName: customer?.fullName || 'Unknown'
        };

        try {
            const res = await fetch(`${API_URL}/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }

    return performAsync(() => {
        const users = loadUsers();
        const tickets = loadTickets();
        const customer = users.find(u => u.id === newTicketData.customerId);
        if (!customer) throw new Error("Customer not found");

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
        saveTickets([newTicket, ...tickets]);
        return newTicket;
    });
};

export const addTicketMessage = async (ticketId: string, message: { text: string; sender: 'customer' | 'admin' }): Promise<Ticket> => {
    if (USE_REAL_API) {
        try {
            const res = await fetch(`${API_URL}/tickets/${ticketId}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }

    return performAsync(() => {
        const tickets = loadTickets();
        let updatedTicket: Ticket | undefined;
        const updatedTickets = tickets.map(ticket => {
            if (ticket.id === ticketId) {
                const newMessage: TicketMessage = {
                    id: `msg${Date.now()}`,
                    sender: message.sender,
                    text: message.text,
                    timestamp: new Date().toISOString()
                };
                updatedTicket = { ...ticket, messages: [...ticket.messages, newMessage] };
                return updatedTicket;
            }
            return ticket;
        });
        if (!updatedTicket) throw new Error("Ticket not found");
        saveTickets(updatedTickets);
        return updatedTicket;
    });
};

export const updateTicketStatus = async (ticketId: string, status: Ticket['status']): Promise<Ticket> => {
    if (USE_REAL_API) {
        try {
            const res = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }

    return performAsync(() => {
        const tickets = loadTickets();
        let updatedTicket: Ticket | undefined;
        const updatedTickets = tickets.map(ticket => {
            if (ticket.id === ticketId) {
                updatedTicket = { ...ticket, status };
                return updatedTicket;
            }
            return ticket;
        });
        if (!updatedTicket) throw new Error("Ticket not found");
        saveTickets(updatedTickets);
        return updatedTicket;
    });
};

// --- Documents API ---
export const addDocumentToUser = async (userId: string, documentData: Omit<Document, 'id' | 'uploadedAt'>): Promise<{ updatedUser: User; newDocument: Document; }> => {
    if (USE_REAL_API) {
         // Backend fetch would go here
         throw new Error("Real API implementation pending for Documents");
    }

    return performAsync(() => {
        const users = loadUsers();
        let updatedUser: User | undefined;
        const newDocument: Document = {
            ...documentData,
            id: `doc${Date.now()}`,
            uploadedAt: new Date().toISOString(),
        };
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                updatedUser = {
                    ...user,
                    documents: [...user.documents, newDocument]
                };
                return updatedUser;
            }
            return user;
        });
        if (!updatedUser) throw new Error("User not found");
        saveUsers(updatedUsers);
        return { updatedUser, newDocument };
    });
};

export const addDocumentToAllCustomers = async (documentData: { name: string; url: string }): Promise<User[]> => {
    if (USE_REAL_API) {
        // Backend fetch would go here
        throw new Error("Real API implementation pending for Documents");
   }

    return performAsync(() => {
        const users = loadUsers();
        const uploadedAt = new Date().toISOString();
        const updatedUsers = users.map(user => {
            if (user.role === 'customer') {
                const newDoc: Document = {
                    id: `doc_${Date.now()}_${user.id}`,
                    name: documentData.name,
                    url: documentData.url,
                    uploadedAt: uploadedAt,
                };
                return {
                    ...user,
                    documents: [...user.documents, newDoc]
                };
            }
            return user;
        });
        saveUsers(updatedUsers);
        return updatedUsers;
    });
};

// --- Expressions of Interest API ---
export const getExpressionsOfInterest = async (): Promise<ExpressionOfInterest[]> => {
    if (USE_REAL_API) {
        try {
            const res = await fetch(`${API_URL}/eoi`);
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }
    return performAsync(loadExpressionsOfInterest);
};

export const addExpressionOfInterest = async (name: string, email: string, phone: string): Promise<{ newExpression: ExpressionOfInterest, admins: User[] }> => {
    const newExpression: ExpressionOfInterest = {
        id: `eoi${Date.now()}`,
        name,
        email,
        phone,
        submittedAt: new Date().toISOString(),
        status: 'pending',
    };

    if (USE_REAL_API) {
         try {
            const res = await fetch(`${API_URL}/eoi`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(newExpression)
            });
            const data = await res.json();
            // Fetch admins to return as expected by app logic (though backend usually handles notifications)
            const users = await getUsers();
            const admins = users.filter(u => u.role === 'admin');
            return { newExpression: data, admins };
        } catch (e) { return handleApiError(e); }
    }

    return performAsync(() => {
        const eois = loadExpressionsOfInterest();
        const users = loadUsers();
        saveExpressionsOfInterest([newExpression, ...eois]);
        const admins = users.filter(u => u.role === 'admin');
        return { newExpression, admins };
    });
};

export const updateEoiStatus = async (eoiId: string, status: ExpressionOfInterest['status']): Promise<ExpressionOfInterest> => {
    if (USE_REAL_API) {
        try {
            const res = await fetch(`${API_URL}/eoi/${eoiId}/status`, {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ status })
            });
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }

    return performAsync(() => {
        const eois = loadExpressionsOfInterest();
        let updatedEoi: ExpressionOfInterest | undefined;
        const updatedEois = eois.map(eoi => {
            if (eoi.id === eoiId) {
                updatedEoi = { ...eoi, status };
                return updatedEoi;
            }
            return eoi;
        });
        if (!updatedEoi) throw new Error("EOI not found");
        saveExpressionsOfInterest(updatedEois);
        return updatedEoi;
    });
};

// --- Notifications API ---
export const getNotifications = async (): Promise<Notification[]> => {
    if (USE_REAL_API) {
         try {
            const res = await fetch(`${API_URL}/notifications`);
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }
    return performAsync(loadNotifications);
};

export const addNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<Notification> => {
     if (USE_REAL_API) {
         try {
            const res = await fetch(`${API_URL}/notifications`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(notificationData)
            });
            return await res.json();
        } catch (e) { return handleApiError(e); }
    }

    return performAsync(() => {
        const notifications = loadNotifications();
        const newNotification: Notification = {
            ...notificationData,
            id: `noti${Date.now()}`,
            createdAt: new Date().toISOString(),
            isRead: false,
        };
        saveNotifications([newNotification, ...notifications]);
        return newNotification;
    });
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification[]> => {
    if (USE_REAL_API) {
         try {
            await fetch(`${API_URL}/notifications/${notificationId}/read`, { method: 'PUT' });
            // re-fetch to ensure sync
            return await getNotifications();
        } catch (e) { return handleApiError(e); }
    }

    return performAsync(() => {
        const notifications = loadNotifications();
        const updatedNotifications = notifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n);
        saveNotifications(updatedNotifications);
        return updatedNotifications;
    });
};

export const markAllNotificationsAsRead = async (userId: string): Promise<Notification[]> => {
    if (USE_REAL_API) {
         try {
            await fetch(`${API_URL}/notifications/read-all`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            return await getNotifications();
        } catch (e) { return handleApiError(e); }
    }

    return performAsync(() => {
        const notifications = loadNotifications();
        const updatedNotifications = notifications.map(n => n.userId === userId ? { ...n, isRead: true } : n);
        saveNotifications(updatedNotifications);
        return updatedNotifications;
    });
};
