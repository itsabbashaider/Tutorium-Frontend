"use client";

import QueryProvider from "./query.provider";
import ToastProvider from "./toast.provider";
import AuthProvider from "./auth.provider";

const Provider = ({ children }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
};

export default Provider;