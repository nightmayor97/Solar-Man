import React, { useEffect } from 'react';
import type { Toast } from '../types';
import { CheckCircleIcon, CloseIcon, DocumentIcon, InterestIcon, TicketIcon } from './Icons';

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ICONS: { [key in Toast['type']]: React.ReactNode } = {
  general: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  ticket: <TicketIcon className="w-6 h-6 text-blue-500" />,
  eoi: <InterestIcon className="w-6 h-6 text-yellow-500" />,
  document: <DocumentIcon className="w-6 h-6 text-purple-500" />,
};

const ToastComponent: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onDismiss]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 flex items-start animate-fade-in-right w-full max-w-sm">
      <div className="flex-shrink-0">{ICONS[toast.type]}</div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">Notification</p>
        <p className="mt-1 text-sm text-gray-600">{toast.message}</p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={() => onDismiss(toast.id)}
          className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <span className="sr-only">Close</span>
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      <style>{`
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ToastComponent;
