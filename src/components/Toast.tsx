import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastIcon: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const ToastColors: Record<ToastType, string> = {
  success: 'bg-green-500/10 border-green-500/20 text-green-500',
  error: 'bg-red-500/10 border-red-500/20 text-red-500',
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
};

const ToastItem: React.FC<{
  toast: Toast;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = ToastIcon[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm min-w-[300px] max-w-md',
        'transform transition-all duration-300 ease-out',
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100',
        ToastColors[toast.type]
      )}
      role="alert"
    >
      <Icon className="w-5 h-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed top-4 right-4 z-[200] flex flex-col gap-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
