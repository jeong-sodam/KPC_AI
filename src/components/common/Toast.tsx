import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warning';
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({
  toast,
  onRemove
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-[#111111] text-white rounded-lg shadow-lg border border-neutral-800 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-[#E60012] shrink-0" />
        <span className="leading-snug">{toast.text}</span>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-neutral-400 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-between gap-3 px-4 py-3 bg-[#111111] text-white rounded-lg shadow-xl border border-neutral-800 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-md">
      <div className="flex items-center gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-[#E60012] shrink-0" />
        <span className="leading-snug">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-neutral-400 hover:text-white transition-colors ml-2"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
