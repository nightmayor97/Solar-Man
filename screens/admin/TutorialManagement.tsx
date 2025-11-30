import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import { useAppContext } from '../../App';
import type { Tutorial } from '../../types';
import { PlusIcon, EditIcon, TrashIcon } from '../../components/Icons';

const TutorialManagement: React.FC = () => {
    const { tutorials, updateTutorials } = useAppContext();
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const sortedTutorials = useMemo(() => {
        return [...tutorials].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }, [tutorials, sortOrder]);

    const getEmbedUrl = (inputUrl: string) => {
        try {
            const urlObj = new URL(inputUrl);
            if (urlObj.hostname.includes('youtube.com')) {
                const videoId = urlObj.searchParams.get('v');
                if (videoId) return `https://www.youtube.com/embed/${videoId}`;
            } else if (urlObj.hostname.includes('youtu.be')) {
                const videoId = urlObj.pathname.slice(1);
                if (videoId) return `https://www.youtube.com/embed/${videoId}`;
            }
        } catch (e) {
            // Ignore invalid URLs
        }
        return inputUrl; // Fallback for already embeddable URLs or errors
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !url) return;
        
        const embedUrl = getEmbedUrl(url);

        if (editingId) {
            updateTutorials(tutorials.map(t => t.id === editingId ? { ...t, title, youtubeUrl: embedUrl } : t));
        } else {
            const newTutorial: Tutorial = { 
                id: `tut${Date.now()}`, 
                title, 
                youtubeUrl: embedUrl,
                createdAt: new Date().toISOString()
            };
            updateTutorials([...tutorials, newTutorial]);
        }
        resetForm();
    };
    
    const handleEdit = (tutorial: Tutorial) => {
        setEditingId(tutorial.id);
        setTitle(tutorial.title);
        setUrl(tutorial.youtubeUrl);
    };

    const handleDelete = (id: string) => {
        updateTutorials(tutorials.filter(t => t.id !== id));
    };
    
    const resetForm = () => {
        setTitle('');
        setUrl('');
        setEditingId(null);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-secondary-dark">Tutorial Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title={editingId ? 'Edit Tutorial' : 'Add New Tutorial'}>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-primary focus:border-primary" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
                                <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-primary focus:border-primary" placeholder="https://www.youtube.com/watch?v=..." required />
                            </div>
                            <div className="flex space-x-2">
                                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                                    {editingId ? 'Update' : 'Add'} Tutorial
                                </button>
                                {editingId && <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>}
                            </div>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex justify-between items-center mb-4 border-b pb-4">
                            <h3 className="text-xl font-semibold text-secondary-dark">Current Tutorials</h3>
                            <button 
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                            >
                                Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                            </button>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {sortedTutorials.map(tutorial => (
                                <li key={tutorial.id} className="py-3 flex items-center justify-between">
                                    <div>
                                        <span className="block font-medium text-gray-800">{tutorial.title}</span>
                                        <span className="block text-xs text-gray-500">
                                            Added: {new Date(tutorial.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="space-x-2">
                                        <button onClick={() => handleEdit(tutorial)} className="text-secondary hover:text-secondary-dark"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete(tutorial.id)} className="text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TutorialManagement;