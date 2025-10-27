import React, { useState } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import { DocumentIcon } from '../../components/Icons';
import Modal from '../../components/Modal';

const Documents: React.FC = () => {
    const { currentUser } = useAppContext();
    const [viewingDocUrl, setViewingDocUrl] = useState<string | null>(null);

    if (!currentUser) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-secondary-dark">Documents</h2>
            <Card title="Your Documents" icon={<DocumentIcon className="w-6 h-6" />}>
                <p className="text-gray-600 mb-4">
                    Here you can find all your important documents, such as signed agreements and warranty forms.
                </p>
                {currentUser.documents.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {currentUser.documents.map(doc => (
                            <li key={doc.id} className="py-3 flex items-center justify-between">
                                <div className="flex items-center">
                                    <DocumentIcon className="w-5 h-5 text-gray-500 mr-3" />
                                    <div>
                                        <span className="text-gray-800 block">{doc.name}</span>
                                        <span className="text-xs text-gray-500">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button 
                                        onClick={() => setViewingDocUrl(doc.url)}
                                        className="px-4 py-1 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-colors"
                                    >
                                        View PDF
                                    </button>
                                    <a 
                                        href={doc.url}
                                        download={doc.name}
                                        className="px-4 py-1 bg-secondary text-white text-sm font-semibold rounded-full hover:bg-secondary-dark transition-colors"
                                    >
                                        Download
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No documents have been uploaded yet.</p>
                    </div>
                )}
            </Card>

            {viewingDocUrl && (
                <Modal 
                    isOpen={true} 
                    onClose={() => setViewingDocUrl(null)} 
                    title="Document Viewer"
                    size="xl"
                >
                    <div className="w-full h-[75vh]">
                        <iframe 
                            src={viewingDocUrl} 
                            title="PDF Viewer" 
                            width="100%" 
                            height="100%"
                            className="border-none"
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Documents;