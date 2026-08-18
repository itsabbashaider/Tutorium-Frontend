"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 4000;

const createToast = (type, message, duration) => ({
  id: crypto.randomUUID(),
  type,
  message,
  duration,
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const show = useCallback(
    (type, message, options = {}) => {
      if (!message) return;

      const duration =
        options.duration ?? DEFAULT_DURATION;

      const toast = createToast(
        type,
        message,
        duration
      );

      setToasts((current) => [...current, toast]);

      if (duration > 0) {
        setTimeout(() => {
          remove(toast.id);
        }, duration);
      }

      return toast.id;
    },
    [remove]
  );

  const success = useCallback(
    (message, options) =>
      show("success", message, options),
    [show]
  );

  const error = useCallback(
    (message, options) =>
      show("error", message, options),
    [show]
  );

  const info = useCallback(
    (message, options) =>
      show("info", message, options),
    [show]
  );

  const warning = useCallback(
    (message, options) =>
      show("warning", message, options),
    [show]
  );

  const clear = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      show,
      success,
      error,
      info,
      warning,
      remove,
      clear,
    }),
    [
      toasts,
      show,
      success,
      error,
      info,
      warning,
      remove,
      clear,
    ]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <ToastContainer
        toasts={toasts}
        onRemove={remove}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider."
    );
  }

  return context;
};

const ToastContainer = ({
  toasts,
  onRemove,
}) => {
  return (
    <div className="fixed right-4 top-4 z-9999 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const styles = {
    success: {
      border: "border-green-200",
      background: "bg-green-50",
      title: "Success",
      titleColor: "text-green-800",
      messageColor: "text-green-700",
    },

    error: {
      border: "border-red-200",
      background: "bg-red-50",
      title: "Error",
      titleColor: "text-red-800",
      messageColor: "text-red-700",
    },

    warning: {
      border: "border-yellow-200",
      background: "bg-yellow-50",
      title: "Warning",
      titleColor: "text-yellow-800",
      messageColor: "text-yellow-700",
    },

    info: {
      border: "border-blue-200",
      background: "bg-blue-50",
      title: "Info",
      titleColor: "text-blue-800",
      messageColor: "text-blue-700",
    },
  };

  const style =
    styles[toast.type] ?? styles.info;

  return (
    <div
      role="alert"
      className={`rounded-xl border p-4 shadow-lg ${style.border} ${style.background}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className={`text-sm font-semibold ${style.titleColor}`}
          >
            {style.title}
          </p>

          <p
            className={`mt-1 text-sm ${style.messageColor}`}
          >
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(toast.id)}
          className={`shrink-0 text-lg leading-none ${style.titleColor}`}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};
