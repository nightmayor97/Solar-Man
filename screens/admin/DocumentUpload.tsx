import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import type { User, Document } from '../../types';
import { DocumentIcon } from '../../components/Icons';

const DocumentUpload: React.FC = () => {
    const { users, addDocumentToUser, addDocumentToAllCustomers } = useAppContext();
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadToAll, setUploadToAll] = useState<boolean>(false);

    const customers = useMemo(() => users.filter(u => u.role === 'customer'), [users]);
    
    const selectedCustomer = useMemo(() => {
        return users.find(u => u.id === selectedCustomerId);
    }, [users, selectedCustomerId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCustomerId(e.target.value);
        if (uploadToAll) {
            setUploadToAll(false);
        }
    };

    const handleUploadToAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadToAll(e.target.checked);
        if (e.target.checked) {
            setSelectedCustomerId('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }
        if (!uploadToAll && !selectedCustomerId) {
            alert('Please select a customer or check "Upload to all customers".');
            return;
        }

        setIsUploading(true);

        try {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileUrl = event.target?.result as string;
                if (!fileUrl) {
                    setIsUploading(false);
                    alert('Error reading file.');
                    return;
                }

                if (uploadToAll) {
                    addDocumentToAllCustomers({
                        name: selectedFile.name,
                        url: fileUrl,
                    });
                } else {
                    const newDoc: Document = {
                        id: `doc${Date.now()}`,
                        name: selectedFile.name,
                        url: fileUrl,
                        uploadedAt: new Date().toISOString(),
                    };
                    addDocumentToUser(selectedCustomerId, newDoc);
                }
                
                // Reset state
                setSelectedFile(null);
                const fileInput = document.getElementById('file-input') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
                setUploadToAll(false); 

                setIsUploading(false);
            };
            reader.onerror = () => {
                setIsUploading(false);
                alert('Error reading file.');
            };
            reader.readAsDataURL(selectedFile);
        } catch (error) {
            console.error("Upload error:", error);
            setIsUploading(false);
            alert('An error occurred during upload.');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-secondary-dark">Document Uploader</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Upload New Document">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="customer-select" className="block text-sm font-medium text-gray-700">1. Select Target</label>
                            <select
                                id="customer-select"
                                value={selectedCustomerId}
                                onChange={handleCustomerSelect}
                                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md ${uploadToAll ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''}`}
                                disabled={uploadToAll}
                            >
                                <option value="" disabled>-- Choose a single customer --</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.fullName} ({customer.fileNumber})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="text-center my-2">
                            <span className="text-sm font-semibold text-gray-500">OR</span>
                        </div>

                        <div>
                            <label className="flex items-center space-x-2 p-3 rounded-md bg-gray-50 border hover:bg-gray-100 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={uploadToAll} 
                                    onChange={handleUploadToAllChange}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <span className="text-sm font-medium text-gray-700">Upload document for ALL customers</span>
                            </label>
                        </div>
                        
                        <div className="border-t pt-4">
                            <label htmlFor="file-input" className="block text-sm font-medium text-gray-700">2. Choose PDF File</label>
                             <input 
                                id="file-input"
                                type="file" 
                                accept=".pdf" 
                                onChange={handleFileChange} 
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark hover:file:bg-orange-200 disabled:opacity-50"
                                disabled={!uploadToAll && !selectedCustomerId}
                            />
                        </div>
                        <button 
                            onClick={handleUpload} 
                            disabled={!(uploadToAll || selectedCustomerId) || !selectedFile || isUploading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isUploading ? 'Uploading...' : '3. Upload Document'}
                        </button>
                    </div>
                </Card>
                <Card title="Existing Documents">
                    {!selectedCustomer ? (
                        <div className="text-center py-10 text-gray-500">
                            <p>Select a customer to view their documents.</p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="font-semibold text-secondary-dark mb-2">{selectedCustomer.fullName}</h3>
                            {selectedCustomer.documents.length > 0 ? (
                                <ul className="divide-y divide-gray-200">
                                    {selectedCustomer.documents.map(doc => (
                                        <li key={doc.id} className="py-3 flex items-center">
                                            <DocumentIcon className="w-5 h-5 text-gray-500 mr-3" />
                                            <div>
                                                <span className="text-gray-800 block text-sm">{doc.name}</span>
                                                <span className="text-xs text-gray-500">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No documents found for this customer.</p>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default DocumentUpload;
