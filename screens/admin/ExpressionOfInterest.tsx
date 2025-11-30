import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import type { ExpressionOfInterest, User } from '../../types';
import Modal from '../../components/Modal';
import { CheckCircleIcon, MailIcon, KeyIcon, BanIcon } from '../../components/Icons';

const ApprovalForm: React.FC<{
    eoi: ExpressionOfInterest;
    onClose: () => void;
    onApprove: (newUser: Omit<User, 'id' | 'role' | 'documents'>) => void;
}> = ({ eoi, onClose, onApprove }) => {
    const initialFormState = {
        fullName: eoi.name,
        email: eoi.email,
        contactNumber: eoi.phone,
        password: '',
        nicNumber: '',
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
        onApprove({
             ...formData,
            system: {
                ...formData.system,
                commissioningDate: new Date(formData.system.commissioningDate).toISOString()
            }
        });
    };

    const inputClasses = "mt-1 w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-primary focus:border-primary";
    const labelClasses = "block text-sm font-medium text-gray-700";

    return (
        <Card title="Approve & Create Customer">
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-secondary mb-2 border-b pb-1">Client Details (from enquiry)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                            <label htmlFor="eoi-fullName" className={labelClasses}>Full Name</label>
                            <input id="eoi-fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="eoi-email" className={labelClasses}>Email</label>
                            <input id="eoi-email" name="email" type="email" value={formData.email} onChange={handleChange} className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="eoi-contact" className={labelClasses}>Contact Number</label>
                            <input id="eoi-contact" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={inputClasses} />
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-secondary mb-2 border-b pb-1">Set Password & Complete Profile</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                            <label htmlFor="password" className={labelClasses}>Set Temporary Password</label>
                            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className={inputClasses} required />
                        </div>
                        <div>
                            <label htmlFor="eoi-nic" className={labelClasses}>NIC Number</label>
                            <input id="eoi-nic" name="nicNumber" value={formData.nicNumber} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="eoi-address" className={labelClasses}>Address</label>
                            <textarea id="eoi-address" name="address" value={formData.address} onChange={handleChange} className={inputClasses} rows={2} />
                        </div>
                        <div>
                            <label htmlFor="eoi-installedBy" className={labelClasses}>Installed By</label>
                            <input id="eoi-installedBy" name="installedBy" value={formData.installedBy} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="eoi-fileNumber" className={labelClasses}>File Number</label>
                            <input id="eoi-fileNumber" name="fileNumber" value={formData.fileNumber} onChange={handleChange} className={inputClasses} />
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-secondary mb-2 border-b pb-1">System Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                             <label htmlFor="eoi-capacity" className={labelClasses}>Capacity (kW)</label>
                            <input id="eoi-capacity" name="system.capacity" type="number" step="0.1" value={formData.system.capacity} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="eoi-inverter" className={labelClasses}>Inverter Details</label>
                            <input id="eoi-inverter" name="system.inverterDetails" value={formData.system.inverterDetails} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="eoi-inverter-sn" className={labelClasses}>Inverter S/N</label>
                            <input id="eoi-inverter-sn" name="system.inverterSerialNumber" value={formData.system.inverterSerialNumber} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="eoi-commissioning" className={labelClasses}>Commissioning Date</label>
                            <input id="eoi-commissioning" name="system.commissioningDate" type="date" value={formData.system.commissioningDate} onChange={handleChange} className={inputClasses} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Approve & Create Account</button>
                </div>
            </form>
        </Card>
    );
};

const ConfirmationModal: React.FC<{
    details: { email: string; password?: string };
    onClose: () => void;
}> = ({ details, onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Account Created Successfully!">
            <div className="text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">The customer account has been created. A simulated email with the following login credentials has been sent.</p>
                <div className="space-y-3 text-left bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center">
                        <MailIcon className="w-5 h-5 mr-3 text-gray-500"/>
                        <div>
                            <span className="text-sm font-semibold text-gray-700">Username / Email</span>
                            <p className="font-mono text-secondary-dark">{details.email}</p>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <KeyIcon className="w-5 h-5 mr-3 text-gray-500"/>
                        <div>
                            <span className="text-sm font-semibold text-gray-700">Temporary Password</span>
                            <p className="font-mono text-secondary-dark">{details.password}</p>
                        </div>
                    </div>
                </div>
                 <button onClick={onClose} className="mt-6 w-full px-4 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-secondary-dark">
                    Close
                </button>
            </div>
        </Modal>
    );
};


const ExpressionOfInterest: React.FC = () => {
    const { expressionsOfInterest, addUser, updateEoiStatus, addToast } = useAppContext();
    const [approvingEoi, setApprovingEoi] = useState<ExpressionOfInterest | null>(null);
    const [rejectingEoi, setRejectingEoi] = useState<ExpressionOfInterest | null>(null);
    const [approvedUserDetails, setApprovedUserDetails] = useState<{ email: string; password?: string } | null>(null);

    const pendingExpressions = useMemo(() =>
        expressionsOfInterest.filter(item => item.status === 'pending'),
        [expressionsOfInterest]
    );

    const handleApprove = (newUserData: Omit<User, 'id' | 'role' | 'documents'>) => {
        addUser(newUserData);
        if (approvingEoi) {
            updateEoiStatus(approvingEoi.id, 'approved');
        }
        setApprovingEoi(null);
        setApprovedUserDetails({ email: newUserData.email, password: newUserData.password });
        addToast(`Customer account for ${newUserData.fullName} created.`, 'general');
    };

    const handleRejectConfirm = () => {
        if (rejectingEoi) {
            updateEoiStatus(rejectingEoi.id, 'rejected');
            addToast(`Enquiry from ${rejectingEoi.name} rejected.`, 'general');
            setRejectingEoi(null);
        }
    };

    if (approvingEoi) {
        return <ApprovalForm eoi={approvingEoi} onClose={() => setApprovingEoi(null)} onApprove={handleApprove} />;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-secondary-dark">Expression of Interest - Pending</h2>
            
            <Card>
                {/* Mobile View: Cards */}
                <div className="md:hidden space-y-4">
                    {pendingExpressions.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <h3 className="font-bold text-secondary-dark">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.email}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.phone}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                Submitted: {new Date(item.submittedAt).toLocaleString()}
                            </p>
                            <div className="mt-3 flex space-x-2">
                                <button onClick={() => setApprovingEoi(item)} className="flex-1 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
                                    Approve
                                </button>
                                <button onClick={() => setRejectingEoi(item)} className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors">
                                    Reject
                                </button>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email & Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pendingExpressions.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-secondary-dark">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{item.email}</div>
                                        <div className="text-sm text-gray-500">{item.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.submittedAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                        <button onClick={() => setApprovingEoi(item)} className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-600 transition-colors">
                                            Approve
                                        </button>
                                        <button onClick={() => setRejectingEoi(item)} className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600 transition-colors">
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {pendingExpressions.length === 0 && <div className="text-center p-8 text-gray-500">There are no new expressions of interest to approve.</div>}
            </Card>

            {approvedUserDetails && <ConfirmationModal details={approvedUserDetails} onClose={() => setApprovedUserDetails(null)} />}
            {rejectingEoi && (
                <Modal isOpen={true} onClose={() => setRejectingEoi(null)} title="Confirm Rejection">
                    <div className="text-center">
                        <BanIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <p className="text-gray-600">
                            Are you sure you want to reject the enquiry from <span className="font-bold">{rejectingEoi.name}</span>?
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-center space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setRejectingEoi(null)}
                                className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleRejectConfirm}
                                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ExpressionOfInterest;