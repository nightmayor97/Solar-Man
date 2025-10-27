import React from 'react';
import { useAppContext } from '../App';
import ToastComponent from './Toast';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppContext();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[100]">
      {toasts.map(toast => (
        <ToastComponent key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
