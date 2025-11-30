import type { User, Tutorial, Ticket, ExpressionOfInterest, Notification } from '../types';
import { MOCK_USERS, MOCK_TUTORIALS, MOCK_TICKETS, MOCK_EXPRESSIONS_OF_INTEREST } from '../data/mockData';

// --- STORAGE KEYS ---
const USERS_KEY = 'SOLAR_MAN_USERS';
const TUTORIALS_KEY = 'SOLAR_MAN_TUTORIALS';
const TICKETS_KEY = 'SOLAR_MAN_TICKETS';
const EOI_KEY = 'SOLAR_MAN_EOI';
const NOTIFICATIONS_KEY = 'SOLAR_MAN_NOTIFICATIONS';

// A mock notification for initial load if none exist.
const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'noti1', userId: 'customer1', message: "Welcome to your new portal!", type: 'general', isRead: true, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'noti2', userId: 'customer1', message: "Your warranty document has been uploaded.", type: 'document', relatedId: 'doc2', isRead: false, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'noti3', userId: 'admin1', message: "John Doe created a new ticket.", type: 'ticket', relatedId: 'ticket1', isRead: true, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'noti4', userId: 'admin1', message: "A new Expression of Interest was submitted.", type: 'eoi', relatedId: 'eoi1', isRead: false, createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
];


// --- GENERIC HELPERS ---
function loadData<T>(key: string, fallbackData: T): T {
    try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            return JSON.parse(storedData);
        }
    } catch (error) {
        console.error(`Error parsing data from localStorage for key "${key}":`, error);
    }
    // If no stored data or parsing fails, return fallback and save it for next time
    saveData(key, fallbackData);
    return fallbackData;
}

function saveData<T>(key: string, data: T): void {
    try {
        const stringifiedData = JSON.stringify(data);
        localStorage.setItem(key, stringifiedData);
    } catch (error) {
        console.error(`Error saving data to localStorage for key "${key}":`, error);
    }
}

// --- EXPORTED FUNCTIONS ---

// Users
export const loadUsers = (): User[] => loadData(USERS_KEY, MOCK_USERS);
export const saveUsers = (users: User[]): void => saveData(USERS_KEY, users);

// Tutorials
export const loadTutorials = (): Tutorial[] => loadData(TUTORIALS_KEY, MOCK_TUTORIALS);
export const saveTutorials = (tutorials: Tutorial[]): void => saveData(TUTORIALS_KEY, tutorials);

// Tickets
export const loadTickets = (): Ticket[] => loadData(TICKETS_KEY, MOCK_TICKETS);
export const saveTickets = (tickets: Ticket[]): void => saveData(TICKETS_KEY, tickets);

// Expressions of Interest
export const loadExpressionsOfInterest = (): ExpressionOfInterest[] => loadData(EOI_KEY, MOCK_EXPRESSIONS_OF_INTEREST);
export const saveExpressionsOfInterest = (eois: ExpressionOfInterest[]): void => saveData(EOI_KEY, eois);

// Notifications
export const loadNotifications = (): Notification[] => loadData(NOTIFICATIONS_KEY, MOCK_NOTIFICATIONS);
export const saveNotifications = (notifications: Notification[]): void => saveData(NOTIFICATIONS_KEY, notifications);
