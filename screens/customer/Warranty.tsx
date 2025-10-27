
import React from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import { MOCK_WARRANTY_ITEMS } from '../../data/mockData';
import { WarrantyIcon } from '../../components/Icons';
import type { WarrantyItem } from '../../types';

const WarrantyProgressBar: React.FC<{ item: WarrantyItem; commissioningDate: string }> = ({ item, commissioningDate }) => {
    const startDate = new Date(commissioningDate);
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + item.totalDurationYears);
    const now = new Date();

    const totalDurationMs = endDate.getTime() - startDate.getTime();
    const elapsedDurationMs = now.getTime() - startDate.getTime();
    
    let progress = (elapsedDurationMs / totalDurationMs) * 100;
    progress = Math.max(0, Math.min(progress, 100));

    const totalMonths = item.totalDurationYears * 12;
    const elapsedMonths = Math.floor(elapsedDurationMs / (1000 * 60 * 60 * 24 * 30.44));
    const remainingMonths = Math.max(0, totalMonths - elapsedMonths);

    return (
        <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-secondary-dark">{item.name}</h4>
                <span className="text-sm font-medium text-primary">{item.totalDurationYears} Years</span>
            </div>
            {item.description && <p className="text-xs text-gray-500 mb-2">{item.description}</p>}
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-accent h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <span>Remaining: <span className="font-semibold">{remainingMonths}</span> months</span>
                <span>Elapsed: <span className="font-semibold">{elapsedMonths}</span> months</span>
            </div>
        </div>
    );
};

const Warranty: React.FC = () => {
    const { currentUser } = useAppContext();

    if (!currentUser) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-secondary-dark">Warranty Information</h2>
            <Card title="Warranty Status" icon={<WarrantyIcon className="w-6 h-6"/>}>
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Your warranty period starts from the commissioning date: <span className="font-semibold">{new Date(currentUser.system.commissioningDate).toLocaleDateString()}</span>.
                        Below is a breakdown of your warranty coverage.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MOCK_WARRANTY_ITEMS.map(item => (
                            <WarrantyProgressBar 
                                key={item.name} 
                                item={item} 
                                commissioningDate={currentUser.system.commissioningDate} 
                            />
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Warranty;
