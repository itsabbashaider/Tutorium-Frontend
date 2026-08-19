"use client";

import { useEffect } from "react";

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className = "",
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={
          title ? "modal-title" : undefined
        }
        className={[
          "w-full max-w-lg rounded-lg",
          "border border-[#e5e7eb] bg-white",
          "shadow-[0_20px_50px_rgba(21,28,39,0.12)]",
          className,
        ].join(" ")}
      >
        {(title || description) && (
          <div className="border-b border-[#e5e7eb] p-6">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-[#151c27]"
              >
                {title}
              </h2>
            )}

            {description && (
              <p className="mt-1.5 text-sm leading-5 text-[#6b7280]">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="p-6">
          {children}
        </div>

        {footer && (
          <div className="border-t border-[#e5e7eb] p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;