import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import type { Ticket } from '../../types';
import Modal from '../../components/Modal';

const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
        case 'Open': return 'bg-green-100 text-green-800';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800';
        case 'Closed': return 'bg-gray-100 text-gray-800';
    }
};

const TicketDetailsModal: React.FC<{ ticket: Ticket; onClose: () => void; }> = ({ ticket, onClose }) => {
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
        <Modal isOpen={true} onClose={onClose} title={`Ticket #${ticket.id.slice(-6)}`}>
            <div className="space-y-4">
                <div>
                    <h3 className="font-bold text-secondary-dark">{ticket.subject}</h3>
                    <p className="text-sm text-gray-500">
                        Customer: <span className="font-semibold">{ticket.customerName}</span>
                        {' | '}
                        Created: {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Complaint Type: <span className="font-semibold bg-gray-200 px-2 py-1 rounded">{ticket.complaintType}</span>
                    </p>
                </div>

                {ticket.photoUrls && ticket.photoUrls.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Attached Photos:</h4>
                        <div className="flex flex-wrap items-center gap-2">
                            {ticket.photoUrls.map((url, index) => (
                                <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                    <img src={url} alt={`Complaint attachment ${index + 1}`} className="rounded-lg h-24 w-24 object-contain border cursor-pointer hover:opacity-80 transition-opacity" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="border-t border-b border-gray-200 py-4 space-y-3 max-h-64 overflow-y-auto">
                    {ticket.messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.sender === 'admin' ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className="text-xs text-right opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <form onSubmit={handleReply}>
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            rows={3}
                            placeholder="Type your reply..."
                            className="w-full p-2 border rounded bg-secondary-dark text-white border-secondary placeholder-gray-300 focus:ring-primary focus:border-primary"
                        />
                        <button type="submit" className="mt-2 w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark">
                            Send Reply
                        </button>
                    </form>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ticket Status</label>
                        <select value={ticket.status} onChange={handleStatusChange} className="mt-1 w-full p-2 border rounded bg-white border-gray-300 focus:ring-primary focus:border-primary">
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Closed</option>
                        </select>
                    </div>
                </div>
            </div>
        </Modal>
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

    return (
        <div>
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-secondary-dark">Ticket Management</h2>
                <div className="flex items-center space-x-2 md:space-x-4">
                     <input
                        type="text"
                        placeholder="Search by subject or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 border rounded bg-white border-gray-300 focus:ring-primary focus:border-primary w-48"
                    />
                    <select onChange={(e) => setFilter(e.target.value as any)} value={filter} className="p-2 border rounded bg-white border-gray-300 focus:ring-primary focus:border-primary">
                        <option value="All">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            <Card>
                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {filteredTickets.map(ticket => (
                        <div key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className="bg-white p-4 rounded-lg shadow border border-gray-200 cursor-pointer">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-secondary-dark w-full">{ticket.subject}</h3>
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
                                        <div className="font-medium text-secondary-dark">{ticket.subject}</div>
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

            {selectedTicket && <TicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicketId(null)} />}
        </div>
    );
};

export default TicketManagement;