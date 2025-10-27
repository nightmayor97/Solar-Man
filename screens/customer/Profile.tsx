
import React from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import { UserIcon, SystemIcon } from '../../components/Icons';

const DetailItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="py-2 grid grid-cols-3 gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="text-sm text-gray-900 col-span-2">{value}</dd>
    </div>
);

const Profile: React.FC = () => {
    const { currentUser } = useAppContext();

    if (!currentUser) return <div>Loading...</div>;
    
    const { system } = currentUser;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-secondary-dark">Profile & System Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Client Details" icon={<UserIcon className="w-6 h-6" />}>
                    <dl className="divide-y divide-gray-200">
                        <DetailItem label="Full Name" value={currentUser.fullName} />
                        <DetailItem label="NIC Number" value={currentUser.nicNumber} />
                        <DetailItem label="Contact Number" value={currentUser.contactNumber} />
                        <DetailItem label="Email Address" value={currentUser.email} />
                        <DetailItem label="Address" value={currentUser.address} />
                        <DetailItem label="Installed By" value={currentUser.installedBy} />
                        <DetailItem label="File Number" value={currentUser.fileNumber} />
                    </dl>
                </Card>
                
                <Card title="System Details" icon={<SystemIcon className="w-6 h-6" />}>
                     <dl className="divide-y divide-gray-200">
                        <DetailItem label="System Capacity" value={`${system.capacity} kW`} />
                        <DetailItem label="Inverter Details" value={system.inverterDetails} />
                        <DetailItem label="Inverter Serial Number" value={system.inverterSerialNumber} />
                        <DetailItem label="Commissioning Date" value={new Date(system.commissioningDate).toLocaleDateString()} />
                    </dl>
                     <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Panel Attachments</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">(Admin function)</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;