import React, { useEffect } from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-3xl',
    };

    return (
        <div 
            className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" 
            aria-labelledby="modal-title" 
            role="dialog" 
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className={`bg-white rounded-lg shadow-xl p-6 w-full ${sizeClasses[size]} relative max-h-[95vh] overflow-y-auto`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 id="modal-title" className="text-2xl font-bold text-secondary-dark">{title}</h2>
                    <button onClick={onClose} aria-label="Close modal">
                        <CloseIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
                    </button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;