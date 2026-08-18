"use client";

import { ToastProvider } from "../context";

const ToastProviderWrapper = ({ children }) => {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
};

export default ToastProviderWrapper;
