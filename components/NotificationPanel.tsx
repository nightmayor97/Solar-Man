import React from 'react';
import type { Notification } from '../types';
import { TicketIcon, InterestIcon, DocumentIcon, BellIcon } from './Icons';

interface NotificationPanelProps {
    notifications: Notification[];
    onNotificationClick: (notification: Notification) => void;
    onMarkAllAsRead: () => void;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const getIconForType = (type: Notification['type']) => {
    switch (type) {
        case 'ticket': return <TicketIcon className="w-5 h-5 text-secondary" />;
        case 'eoi': return <InterestIcon className="w-5 h-5 text-primary" />;
        case 'document': return <DocumentIcon className="w-5 h-5 text-green-600" />;
        default: return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onNotificationClick, onMarkAllAsRead }) => {
    return (
        <div className="absolute top-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl border z-50">
            <div className="flex justify-between items-center p-3 border-b">
                <h3 className="font-semibold text-secondary-dark">Notifications</h3>
                <button onClick={onMarkAllAsRead} className="text-sm text-primary hover:underline">Mark all as read</button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() => onNotificationClick(n)}
                            className={`p-3 flex items-start gap-3 cursor-pointer hover:bg-gray-100 transition-colors ${!n.isRead ? 'bg-orange-50' : ''}`}
                        >
                            {!n.isRead && <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>}
                            <div className={`flex-shrink-0 ${n.isRead ? 'ml-2' : ''}`}>{getIconForType(n.type)}</div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700">{n.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        You have no new notifications.
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
