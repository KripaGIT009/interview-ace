import { createContext, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Toast, { ToastType } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

interface ToastState {
  message: string;
  type: ToastType;
  durationMs?: number;
}

interface ConfirmState {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  resolve: (value: boolean) => void;
}

interface ToastContextValue {
  toast: ToastState | null;
  showToast: (message: string, type: ToastType, durationMs?: number) => void;
  clearToast: () => void;
  showConfirm: (options: Omit<ConfirmState, 'resolve'>) => Promise<boolean>;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const showToast = useCallback((message: string, type: ToastType, durationMs?: number) => {
    setToast({ message, type, durationMs });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const showConfirm = useCallback((options: Omit<ConfirmState, 'resolve'>) => {
    return new Promise<boolean>((resolve) => {
      setConfirm({ ...options, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirm) {
      confirm.resolve(true);
      setConfirm(null);
    }
  }, [confirm]);

  const handleCancel = useCallback(() => {
    if (confirm) {
      confirm.resolve(false);
      setConfirm(null);
    }
  }, [confirm]);

  const value = useMemo(
    () => ({ toast, showToast, clearToast, showConfirm }),
    [toast, showToast, clearToast, showConfirm]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
          durationMs={toast.durationMs}
        />
      )}
      {confirm && (
        <ConfirmModal
          isOpen
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          cancelLabel={confirm.cancelLabel}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </ToastContext.Provider>
  );
}
