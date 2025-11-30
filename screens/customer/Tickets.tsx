import React, { useState } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import type { Ticket } from '../../types';
import { PlusIcon, TrashIcon, ArrowLeftIcon, UserIcon, BotIcon, SendIcon } from '../../components/Icons';

const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
        case 'Open': return 'bg-green-100 text-green-800';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800';
        case 'Closed': return 'bg-gray-100 text-gray-800';
    }
};

const TicketDetailsView: React.FC<{ ticket: Ticket; onBack: () => void; }> = ({ ticket, onBack }) => {
    const { tickets, addTicketMessage } = useAppContext();
    const [reply, setReply] = useState('');

    const currentTicket = tickets.find(t => t.id === ticket.id) || ticket;

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;
        addTicketMessage(ticket.id, { text: reply, sender: 'customer' });
        setReply('');
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
                        <h2 className="text-xl font-bold text-secondary-dark">{currentTicket.subject}</h2>
                    </div>
                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {currentTicket.messages.map(msg => (
                            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'customer' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'customer' ? 'bg-gray-300' : 'bg-secondary-light'}`}>
                                    {msg.sender === 'customer' ? <UserIcon className="w-6 h-6 text-gray-600" /> : <BotIcon className="w-6 h-6 text-white" />}
                                </div>
                                <div className={`p-3 rounded-lg max-w-lg ${msg.sender === 'customer' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className="text-xs text-right opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Reply Form */}
                    {currentTicket.status !== 'Closed' && (
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
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Status</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentTicket.status)}`}>
                                    {currentTicket.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Ticket ID</span>
                                <span className="font-mono text-gray-700">#{currentTicket.id.slice(-6)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Complaint Type</span>
                                <span className="text-gray-700 font-semibold">{currentTicket.complaintType}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Created</span>
                                <span className="text-gray-700">{new Date(currentTicket.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {currentTicket.photoUrls && currentTicket.photoUrls.length > 0 && (
                             <div className="mt-4 pt-4 border-t">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {currentTicket.photoUrls.map((url, index) => (
                                        <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                            <img src={url} alt={`Attachment ${index + 1}`} className="rounded-md object-cover w-full h-20 border hover:opacity-80" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

const CreateTicketForm: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
    const { addTicket, currentUser } = useAppContext();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [complaintType, setComplaintType] = useState('');
    const [photoUrls, setPhotoUrls] = useState<(string | null)[]>([null, null]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const newPhotoUrls = [...photoUrls];
                newPhotoUrls[index] = event.target?.result as string;
                setPhotoUrls(newPhotoUrls);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = (index: number) => {
        const newPhotoUrls = [...photoUrls];
        newPhotoUrls[index] = null;
        setPhotoUrls(newPhotoUrls);

        const fileInput = document.getElementById(`file-upload-${index}`) as HTMLInputElement;
        if(fileInput) fileInput.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim() || !complaintType.trim() || !currentUser) {
            alert("Please fill out all required fields.");
            return;
        }
        const uploadedUrls = photoUrls.filter((url): url is string => url !== null);
        addTicket({
            subject,
            message,
            customerId: currentUser.id,
            complaintType,
            photoUrls: uploadedUrls.length > 0 ? uploadedUrls : undefined
        });
        onClose();
    };
    
    const inputClasses = "mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-primary focus:border-primary";
    const readOnlyInputClasses = "mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed";

    return (
        <Card title="Create New Support Ticket">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                        <input type="text" value={currentUser?.fullName} className={readOnlyInputClasses} readOnly />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input type="text" value={currentUser?.contactNumber} className={readOnlyInputClasses} readOnly />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Type of Complaint</label>
                    <select value={complaintType} onChange={e => setComplaintType(e.target.value)} className={inputClasses} required>
                        <option value="" disabled>Please select a category</option>
                        <option>System Not Working</option>
                        <option>Billing Inquiry</option>
                        <option>Low Production</option>
                        <option>Physical Damage</option>
                        <option>General Question</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className={inputClasses} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} className={inputClasses} placeholder="Please describe your issue in detail..." required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Photos (Optional, up to 2)</label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {photoUrls.map((url, index) => (
                            <div key={index}>
                                {url ? (
                                    <div className="relative group">
                                        <img src={url} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover rounded-md border" />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                            <button type="button" onClick={() => removePhoto(index)} className="p-2 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Remove photo ${index+1}`}>
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor={`file-upload-${index}`} className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center">
                                            <PlusIcon className="w-6 h-6 text-gray-500" />
                                            <p className="text-sm text-gray-500">Photo {index + 1}</p>
                                        </div>
                                        <input id={`file-upload-${index}`} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, index)} />
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end items-center gap-2 pt-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark">
                        Submit Ticket
                    </button>
                </div>
            </form>
        </Card>
    );
};

const Tickets: React.FC = () => {
    const { currentUser, tickets } = useAppContext();
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const userTickets = currentUser ? tickets.filter(t => t.customerId === currentUser.id) : [];
    
    const selectedTicket = selectedTicketId ? tickets.find(t => t.id === selectedTicketId) : null;

    if (isCreating) {
        return <CreateTicketForm onClose={() => setIsCreating(false)} />;
    }

    if (selectedTicket) {
        return <TicketDetailsView ticket={selectedTicket} onBack={() => setSelectedTicketId(null)} />;
    }

    return (
        <div>
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-3xl font-bold text-secondary-dark text-center sm:text-left">Support Tickets</h2>
                <button onClick={() => setIsCreating(true)} className="flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors w-full sm:w-auto">
                    <PlusIcon className="w-5 h-5 mr-2" /> Create Ticket
                </button>
            </div>

            <Card>
                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {userTickets.map(ticket => (
                        <div key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className="bg-white p-4 rounded-lg shadow border border-gray-200 cursor-pointer">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-secondary-dark w-4/5">{ticket.subject}</h3>
                                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {userTickets.map(ticket => (
                                <tr key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className="cursor-pointer hover:bg-gray-50">
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
                </div>
                {userTickets.length === 0 && <div className="text-center p-8 text-gray-500">You have not created any tickets yet.</div>}
            </Card>
        </div>
    );
};

export default Tickets;