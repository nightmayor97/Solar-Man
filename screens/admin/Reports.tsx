import React, { useMemo } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartIcon } from '../../components/Icons';

const Reports: React.FC = () => {
    const { tickets } = useAppContext();

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
            <h2 className="text-3xl font-bold mb-6 text-secondary-dark">Reports</h2>
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
    );
};

export default Reports;
