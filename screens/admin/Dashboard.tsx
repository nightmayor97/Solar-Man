import React from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import { ADMIN_ANALYTICS_DATA } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { UsersIcon, SystemIcon, TicketIcon } from '../../components/Icons';

const AdminDashboard: React.FC = () => {
    const { users, tickets } = useAppContext();
    const totalCustomers = users.filter(u => u.role === 'customer').length;
    const totalInstalledUnits = totalCustomers; // Assuming 1 unit per customer
    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;


    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-secondary-dark">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-primary-light text-primary-dark mr-4">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Customers</p>
                            <p className="text-2xl font-bold">{totalCustomers}</p>
                        </div>
                    </div>
                </Card>
                 <Card>
                    <div className="flex items-center">
                         <div className="p-3 rounded-full bg-secondary-light text-secondary-dark mr-4">
                            <SystemIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Installed Units</p>
                            <p className="text-2xl font-bold">{totalInstalledUnits}</p>
                        </div>
                    </div>
                </Card>
                 <Card>
                    <div className="flex items-center">
                         <div className="p-3 rounded-full bg-green-200 text-green-800 mr-4">
                            <TicketIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Open Tickets</p>
                            <p className="text-2xl font-bold">{openTickets}</p>
                        </div>
                    </div>
                </Card>
                 <Card>
                    <div className="flex items-center">
                         <div className="p-3 rounded-full bg-yellow-200 text-yellow-800 mr-4">
                            <TicketIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">In Progress</p>
                            <p className="text-2xl font-bold">{inProgressTickets}</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Customer Registration Summary" icon={<UsersIcon className="w-6 h-6" />}>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ADMIN_ANALYTICS_DATA.customerRegistration}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="customers" fill="#F97316" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
                 <Card title="Installed Units Summary" icon={<SystemIcon className="w-6 h-6" />}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={ADMIN_ANALYTICS_DATA.installedUnits}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="units" stroke="#1E3A8A" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;