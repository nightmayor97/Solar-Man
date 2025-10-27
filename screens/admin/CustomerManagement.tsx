import React, { useState } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import type { User, Document } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, CloseIcon, DocumentIcon } from '../../components/Icons';

// A sub-component defined outside the main component to prevent re-renders
const UserFormModal: React.FC<{ user: User | null; onClose: () => void; onSave: (user: User) => void; }> = ({ user, onClose, onSave }) => {
    const isNew = user === null;
    const initialFormState = isNew ? {
        id: `customer${Date.now()}`,
        role: 'customer',
        fullName: '',
        email: '',
        nicNumber: '',
        contactNumber: '',
        address: '',
        installedBy: '',
        fileNumber: '',
        system: {
            capacity: 0,
            inverterDetails: '',
            inverterSerialNumber: '',
            commissioningDate: new Date().toISOString().split('T')[0],
        },
        documents: [],
    } : { ...user, system: {...user.system, commissioningDate: new Date(user.system.commissioningDate).toISOString().split('T')[0]} };
    
    const [formData, setFormData] = useState<any>(initialFormState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('system.')) {
            const systemField = name.split('.')[1];
            setFormData({ ...formData, system: { ...formData.system, [systemField]: value } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({...formData, system: {...formData.system, commissioningDate: new Date(formData.system.commissioningDate).toISOString()}});
        onClose();
    };

    const inputClasses = "w-full p-2 border rounded bg-secondary-dark text-white border-secondary placeholder-gray-300 focus:ring-primary focus:border-primary";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-secondary-dark">{isNew ? 'Add New Customer' : 'Edit Customer'}</h2>
                    <button onClick={onClose}><CloseIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-secondary mb-2 border-b pb-1">Client Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className={inputClasses} required />
                            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className={inputClasses} required />
                            <input name="nicNumber" value={formData.nicNumber} onChange={handleChange} placeholder="NIC Number" className={inputClasses} />
                            <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" className={inputClasses} />
                            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className={`${inputClasses} md:col-span-2`} rows={3} />
                            <input name="installedBy" value={formData.installedBy} onChange={handleChange} placeholder="Installed By" className={inputClasses} />
                            <input name="fileNumber" value={formData.fileNumber} onChange={handleChange} placeholder="File Number" className={inputClasses} />
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold text-secondary mb-2 border-b pb-1">System Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <input name="system.capacity" type="number" value={formData.system.capacity} onChange={handleChange} placeholder="Capacity (kW)" className={inputClasses} />
                            <input name="system.inverterDetails" value={formData.system.inverterDetails} onChange={handleChange} placeholder="Inverter Details" className={inputClasses} />
                            <input name="system.inverterSerialNumber" value={formData.system.inverterSerialNumber} onChange={handleChange} placeholder="Inverter S/N" className={inputClasses} />
                            <input name="system.commissioningDate" type="date" value={formData.system.commissioningDate} onChange={handleChange} placeholder="Commissioning Date" className={inputClasses} />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">{isNew ? 'Add Customer' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CustomerManagement: React.FC = () => {
    const { users, addUser, updateUser, deleteUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const customers = users.filter(u => u.role === 'customer');

    const openModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSave = (user: User) => {
        if (editingUser) {
            updateUser(user);
        } else {
            addUser(user);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-secondary-dark">Customer Management</h2>
                <button onClick={() => openModal(null)} className="flex items-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" /> Add Customer
                </button>
            </div>
            
            <Card>
                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {customers.map(user => (
                        <div key={user.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-secondary-dark">{user.fullName}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <p className="text-sm text-gray-500 mt-1">Contact: {user.contactNumber}</p>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <button onClick={() => openModal(user)} className="text-secondary hover:text-secondary-dark"><EditIcon className="w-5 h-5" /></button>
                                    <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-secondary-dark">{user.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.contactNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button onClick={() => openModal(user)} className="text-secondary hover:text-secondary-dark"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && <UserFormModal user={editingUser} onClose={closeModal} onSave={handleSave} />}
        </div>
    );
};

export default CustomerManagement;