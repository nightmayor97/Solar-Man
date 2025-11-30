import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import type { Ticket } from '../../types';
import { CalendarIcon, ArrowLeftIcon, UserIcon, BotIcon, SendIcon } from '../../components/Icons';

const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
        case 'Open': return 'bg-green-100 text-green-800';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800';
        case 'Closed': return 'bg-gray-100 text-gray-800';
    }
};

const isSchedulingTicket = (subject: string) => /schedule|maintenance/i.test(subject);

const TicketDetailsView: React.FC<{ ticket: Ticket; onBack: () => void; }> = ({ ticket, onBack }) => {
    const { addTicketMessage, updateTicketStatus } = useAppContext();
    const [reply, setReply] = useState('');

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;
        addTicketMessage(ticket.id, { text: reply, sender: 'admin' });
        setReply('');
    };
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateTicketStatus(ticket.id, e.target.value as Ticket['status']);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-secondary-dark">
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to Tickets
                </button>
            </div>
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversation Panel */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md flex flex-col min-h-[60vh]">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-secondary-dark">{ticket.subject}</h2>
                    </div>
                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {ticket.messages.map(msg => (
                            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'admin' ? 'bg-secondary-light' : 'bg-gray-300'}`}>
                                    {msg.sender === 'admin' ? <BotIcon className="w-6 h-6 text-white" /> : <UserIcon className="w-6 h-6 text-gray-600" />}
                                </div>
                                <div className={`p-3 rounded-lg max-w-lg ${msg.sender === 'admin' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className="text-xs text-right opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Reply Form */}
                    {ticket.status !== 'Closed' && (
                        <div className="p-4 bg-gray-50 border-t">
                            <form onSubmit={handleReply} className="relative">
                                <textarea
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    rows={2}
                                    placeholder="Type your reply..."
                                    className="w-full pl-4 pr-16 py-2 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400" disabled={!reply.trim()}>
                                    <SendIcon className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Details Panel */}
                <div className="lg:col-span-1">
                    <Card title="Ticket Details">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ticket Status</label>
                                <select value={ticket.status} onChange={handleStatusChange} className="mt-1 w-full p-2 border rounded bg-white border-gray-300 focus:ring-primary focus:border-primary">
                                    <option>Open</option>
                                    <option>In Progress</option>
                                    <option>Closed</option>
                                </select>
                            </div>
                            <div className="space-y-3 text-sm pt-4 border-t">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Customer</span>
                                    <span className="text-gray-700 font-semibold">{ticket.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Ticket ID</span>
                                    <span className="font-mono text-gray-700">#{ticket.id.slice(-6)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Complaint Type</span>
                                    <span className="text-gray-700 font-semibold">{ticket.complaintType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Created</span>
                                    <span className="text-gray-700">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {ticket.photoUrls && ticket.photoUrls.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {ticket.photoUrls.map((url, index) => (
                                            <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                                <img src={url} alt={`Attachment ${index + 1}`} className="rounded-md object-cover w-full h-20 border hover:opacity-80" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};


const TicketManagement: React.FC = () => {
    const { tickets } = useAppContext();
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'All' | Ticket['status']>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTickets = useMemo(() => {
        let ticketsToFilter = tickets;

        // Filter by status
        if (filter !== 'All') {
            ticketsToFilter = ticketsToFilter.filter(t => t.status === filter);
        }

        // Filter by search query
        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase();
            ticketsToFilter = ticketsToFilter.filter(ticket =>
                ticket.subject.toLowerCase().includes(lowercasedQuery) ||
                ticket.customerName.toLowerCase().includes(lowercasedQuery)
            );
        }

        return ticketsToFilter;
    }, [tickets, filter, searchQuery]);
    
    const selectedTicket = selectedTicketId ? tickets.find(t => t.id === selectedTicketId) : null;

    if (selectedTicket) {
        return <TicketDetailsView ticket={selectedTicket} onBack={() => setSelectedTicketId(null)} />;
    }

    return (
        <div>
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-secondary-dark">Ticket Management</h2>
                <div className="flex items-end space-x-2 md:space-x-4">
                    <div>
                        <label htmlFor="ticket-search" className="block text-sm font-medium text-gray-700">Search</label>
                        <input
                            id="ticket-search"
                            type="text"
                            placeholder="By subject or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="mt-1 p-2 border rounded bg-white border-gray-300 focus:ring-primary focus:border-primary w-48"
                        />
                    </div>
                     <div>
                        <label htmlFor="ticket-filter" className="block text-sm font-medium text-gray-700">Status</label>
                        <select id="ticket-filter" onChange={(e) => setFilter(e.target.value as any)} value={filter} className="mt-1 block p-2 border rounded bg-white border-gray-300 focus:ring-primary focus:border-primary">
                            <option value="All">All Statuses</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            <Card>
                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {filteredTickets.map(ticket => (
                        <div key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className="bg-white p-4 rounded-lg shadow border border-gray-200 cursor-pointer">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-secondary-dark w-full flex items-center gap-2">
                                        {isSchedulingTicket(ticket.subject) && <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                                        {ticket.subject}
                                    </h3>
                                    <p className="text-sm text-gray-700 font-medium">{ticket.customerName}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)} whitespace-nowrap`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-2">ID: #{ticket.id.slice(-6)}</div>
                            <div className="text-sm text-gray-500 mt-1">
                                Last Update: {new Date(ticket.messages[ticket.messages.length - 1].timestamp).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTickets.map(ticket => (
                                <tr key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className="cursor-pointer hover:bg-gray-50">
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-800">{ticket.customerName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-secondary-dark flex items-center gap-2">
                                            {isSchedulingTicket(ticket.subject) && <CalendarIcon className="w-4 h-4 text-gray-500" />}
                                            {ticket.subject}
                                        </div>
                                        <div className="text-sm text-gray-500">ID: #{ticket.id.slice(-6)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ticket.messages[ticket.messages.length-1].timestamp).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredTickets.length === 0 && <div className="text-center p-8 text-gray-500">No tickets match the current filter.</div>}
                </div>
            </Card>
        </div>
    );
};

export default TicketManagement;