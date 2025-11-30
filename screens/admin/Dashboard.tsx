import React, { useMemo } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import { ADMIN_ANALYTICS_DATA } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { UsersIcon, SystemIcon, TicketIcon, ChartIcon } from '../../components/Icons';

const AdminDashboard: React.FC = () => {
    const { users, tickets } = useAppContext();
    const totalCustomers = users.filter(u => u.role === 'customer').length;
    const totalInstalledUnits = totalCustomers; // Assuming 1 unit per customer
    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;

    const ticketStatusData = useMemo(() => {
        const statusCounts = tickets.reduce((acc, ticket) => {
            acc[ticket.status] = (acc[ticket.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return [
            { name: 'Open', value: statusCounts['Open'] || 0 },
            { name: 'In Progress', value: statusCounts['In Progress'] || 0 },
            { name: 'Closed', value: statusCounts['Closed'] || 0 },
        ];
    }, [tickets]);

    const COLORS = ['#22c55e', '#f59e0b', '#6b7280']; // Green, Amber, Gray


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
            <div className="mt-6">
                <Card title="Ticket Status Overview" icon={<ChartIcon className="w-6 h-6" />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div className="md:col-span-2 w-full h-80">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={ticketStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {ticketStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value} tickets`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="md:col-span-1 space-y-4">
                            <h3 className="text-lg font-semibold text-secondary-dark border-b pb-2">Status Summary</h3>
                            {ticketStatusData.map((item, index) => (
                                <div key={item.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index] }}></span>
                                        <span className="font-medium text-gray-700">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-lg text-secondary-dark">{item.value}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg border-t-2 border-gray-300 mt-4">
                                <span className="font-bold text-gray-800">Total Tickets</span>
                                <span className="font-bold text-xl text-secondary-dark">{tickets.length}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;