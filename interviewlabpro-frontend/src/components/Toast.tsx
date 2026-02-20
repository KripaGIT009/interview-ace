import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  durationMs?: number;
}

export default function Toast({ message, type, onClose, durationMs = 4000 }: ToastProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timeoutId = window.setTimeout(() => onClose(), durationMs);
    return () => window.clearTimeout(timeoutId);
  }, [message, durationMs, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
          type === 'success'
            ? 'bg-green-600 text-white'
            : type === 'info'
              ? 'bg-slate-700 text-white'
              : 'bg-red-600 text-white'
        }`}
        role="alert"
      >
        {message}
      </div>
    </div>
  );
}
