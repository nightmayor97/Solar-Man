import React from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import { UserIcon, SystemIcon, TicketIcon, PlusIcon } from '../../components/Icons';
import type { CustomerView } from './CustomerLayout';

interface DashboardProps {
    setActiveView: (view: CustomerView) => void;
}

const getStatusColor = (status: 'Open' | 'In Progress' | 'Closed') => {
    switch (status) {
        case 'Open': return 'bg-green-100 text-green-800';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800';
        case 'Closed': return 'bg-gray-100 text-gray-800';
    }
};

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    const { currentUser, tickets } = useAppContext();

    if (!currentUser) return <div>Loading...</div>;
    
    const userTickets = tickets.filter(t => t.customerId === currentUser.id);
    const openTicketsCount = userTickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
    
    const recentActiveTicket = userTickets
        .filter(t => t.status !== 'Closed')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];


    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-secondary-dark">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Welcome" icon={<UserIcon className="w-6 h-6"/>}>
                    <p className="text-gray-700">Hello, <span className="font-semibold">{currentUser.fullName}</span>!</p>
                    <p className="text-gray-600 mt-2">Here's a summary of your solar system.</p>
                </Card>

                <Card title="System Capacity" icon={<SystemIcon className="w-6 h-6"/>}>
                    <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-primary">{currentUser.system.capacity}</span>
                        <span className="ml-2 text-xl text-gray-600">kW</span>
                    </div>
                </Card>
                
                <Card title="Open Tickets" icon={<TicketIcon className="w-6 h-6"/>}>
                    <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-secondary-dark">{openTicketsCount}</span>
                    </div>
                     <p className="text-gray-600 mt-2">You have {openTicketsCount} active support ticket(s).</p>
                </Card>

            </div>
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card title="User Details" icon={<UserIcon className="w-6 h-6"/>}>
                     <div className="space-y-2 text-gray-600">
                        <p><span className="font-semibold text-gray-800">Contact Number:</span> {currentUser.contactNumber}</p>
                        <p><span className="font-semibold text-gray-800">Email:</span> {currentUser.email}</p>
                        <p><span className="font-semibold text-gray-800">File Number:</span> {currentUser.fileNumber}</p>
                    </div>
                </Card>

                 <Card title="Operations & Maintenance">
                    <div className="p-4 bg-gray-50 rounded-lg flex flex-col justify-between h-full">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">Recent Active Ticket</h4>
                            {recentActiveTicket ? (
                                <div>
                                    <p className="font-semibold text-secondary-dark">{recentActiveTicket.subject}</p>
                                    <p className="text-sm text-gray-600">
                                        Status: <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(recentActiveTicket.status)}`}>{recentActiveTicket.status}</span>
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-600">No active support tickets.</p>
                            )}
                        </div>
                         <button 
                            onClick={() => setActiveView('tickets')} 
                            className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" /> Create New Ticket
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;