
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import type { User } from '../../types';
import { PlusIcon, EditIcon, TrashIcon, BanIcon } from '../../components/Icons';
import Modal from '../../components/Modal';

const UserForm: React.FC<{
    user: User | null;
    onClose: () => void;
    onSave: (user: User | Omit<User, 'id' | 'role' | 'documents'>) => void;
}> = ({ user, onClose, onSave }) => {
    const isNew = user === null;
    
    const [formData, setFormData] = useState<any>(() => {
        if (isNew) {
            return {
                fullName: '',
                email: '',
                password: '',
                nicNumber: '',
                contactNumber: '',
                address: '',
                installedBy: 'Archnix Solar Tech',
                fileNumber: '',
                system: {
                    capacity: 0,
                    inverterDetails: '',
                    inverterSerialNumber: '',
                    commissioningDate: new Date().toISOString().split('T')[0],
                },
            };
        } else {
             return { 
                ...user, 
                password: '', 
                system: {
                    ...user.system, 
                    commissioningDate: new Date(user.system.commissioningDate).toISOString().split('T')[0]
                } 
            };
        }
    });

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
        const dataToSave = {
            ...formData,
            system: {
                ...formData.system,
                commissioningDate: new Date(formData.system.commissioningDate).toISOString()
            }
        };
        
        if (isNew) {
            onSave(dataToSave);
        } else {
            onSave({ ...user, ...dataToSave });
        }
    };

    const inputClasses = "mt-1 w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-primary focus:border-primary";
    const labelClasses = "block text-sm font-medium text-gray-700";

    return (
        <Card title={isNew ? 'Add New Customer' : `Edit Customer: ${user?.fullName}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-secondary mb-2 border-b pb-1">Client Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <label htmlFor="fullName" className={labelClasses}>Full Name</label>
                            <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} required />
                        </div>
                         <div>
                            <label htmlFor="email" className={labelClasses}>Email</label>
                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="password" className={labelClasses}>Password</label>
                            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className={inputClasses} required={isNew} placeholder={isNew ? 'Required' : 'Enter new password to change'}/>
                        </div>
                        <div>
                            <label htmlFor="nicNumber" className={labelClasses}>NIC Number</label>
                            <input id="nicNumber" name="nicNumber" value={formData.nicNumber} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="contactNumber" className={labelClasses}>Contact Number</label>
                            <input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="address" className={labelClasses}>Address</label>
                            <textarea id="address" name="address" value={formData.address} onChange={handleChange} className={inputClasses} rows={3} />
                        </div>
                         <div>
                            <label htmlFor="installedBy" className={labelClasses}>Installed By</label>
                            <input id="installedBy" name="installedBy" value={formData.installedBy} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="fileNumber" className={labelClasses}>File Number</label>
                            <input id="fileNumber" name="fileNumber" value={formData.fileNumber} onChange={handleChange} className={inputClasses} />
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-lg font-semibold text-secondary mb-2 border-b pb-1">System Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <label htmlFor="capacity" className={labelClasses}>Capacity (kW)</label>
                            <input id="capacity" name="system.capacity" type="number" step="0.1" value={formData.system.capacity} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="inverterDetails" className={labelClasses}>Inverter Details</label>
                            <input id="inverterDetails" name="system.inverterDetails" value={formData.system.inverterDetails} onChange={handleChange} className={inputClasses} />
                        </div>
                         <div>
                            <label htmlFor="inverterSerialNumber" className={labelClasses}>Inverter S/N</label>
                            <input id="inverterSerialNumber" name="system.inverterSerialNumber" value={formData.system.inverterSerialNumber} onChange={handleChange} className={inputClasses} />
                        </div>
                         <div>
                            <label htmlFor="commissioningDate" className={labelClasses}>Commissioning Date</label>
                            <input id="commissioningDate" name="system.commissioningDate" type="date" value={formData.system.commissioningDate} onChange={handleChange} className={inputClasses} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded">{isNew ? 'Add Customer' : 'Save Changes'}</button>
                </div>
            </form>
        </Card>
    );
};

const CustomerManagement: React.FC = () => {
    const { users, addUser, updateUser, deleteUser, addToast } = useAppContext();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const customers = users.filter(u => u.role === 'customer');

    const showForm = (user: User | null = null) => {
        setEditingUser(user);
        setIsFormVisible(true);
    };

    const hideForm = () => {
        setIsFormVisible(false);
        setEditingUser(null);
    };

    const handleSave = (userData: User | Omit<User, 'id' | 'role' | 'documents'>) => {
        if (editingUser) {
            updateUser(userData as User);
        } else {
            addUser(userData as Omit<User, 'id' | 'role' | 'documents'>);
        }
        hideForm();
    };
    
    const deletingUser = deletingUserId ? customers.find(c => c.id === deletingUserId) : null;

    const handleConfirmDelete = () => {
        if (deletingUser) {
            deleteUser(deletingUser.id);
            addToast(`Customer "${deletingUser.fullName}" has been deleted.`, 'general');
            setDeletingUserId(null);
        }
    };

    const renderCustomerList = () => (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-secondary-dark">Customer Management</h2>
                <button onClick={() => showForm(null)} className="flex items-center px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" /> Add Customer
                </button>
            </div>
            
            <Card className="overflow-hidden">
                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {customers.map(user => (
                        <div key={user.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-blue-600">{user.fullName}</h3>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    <p className="text-sm text-gray-500 mt-1">Contact: {user.contactNumber}</p>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    <button onClick={() => showForm(user)} className="text-secondary hover:text-secondary-dark"><EditIcon className="w-5 h-5" /></button>
                                    <button onClick={() => setDeletingUserId(user.id)} className="text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5" /></button>
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
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{user.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.contactNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => showForm(user)} className="text-secondary hover:text-secondary-dark transition-colors" title="Edit">
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => setDeletingUserId(user.id)} className="text-red-500 hover:text-red-700 transition-colors" title="Delete">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );

    return (
        <div>
           {isFormVisible ? (
                <UserForm user={editingUser} onClose={hideForm} onSave={handleSave} />
           ) : (
                renderCustomerList()
           )}

            {deletingUser && (
                <Modal isOpen={true} onClose={() => setDeletingUserId(null)} title="Confirm Customer Deletion">
                    <div className="text-center">
                        <BanIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <p className="text-lg text-gray-700 mb-2">
                            Are you sure you want to delete <span className="font-bold text-secondary-dark">{deletingUser.fullName}</span>?
                        </p>
                        <p className="text-sm text-gray-500">
                            This will permanently remove all associated data, including tickets and documents. This action cannot be undone.
                        </p>
                        <div className="flex justify-center space-x-4 mt-8">
                            <button
                                type="button"
                                onClick={() => setDeletingUserId(null)}
                                className="px-8 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className="px-8 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default CustomerManagement;
