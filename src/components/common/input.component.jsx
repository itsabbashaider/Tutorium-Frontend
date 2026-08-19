"use client";

const Input = ({
  label,
  error,
  helperText,
  className = "",
  id,
  type = "text",
  disabled = false,
  required = false,
  ...props
}) => {
  const messageId = id
    ? `${id}-message`
    : undefined;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium leading-5 text-[#151c27]"
        >
          {label}

          {required && (
            <span className="ml-1 text-[#ba1a1a]">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={id}
        type={type}
        disabled={disabled}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error || helperText
            ? messageId
            : undefined
        }
        className={[
          "h-11 w-full rounded-md border",
          "bg-[#f9fafb] px-3 text-sm text-[#151c27]",
          "placeholder:text-[#9aa0a8]",
          "outline-none transition-colors",
          "focus:bg-white focus:ring-2",
          error
            ? "border-[#ba1a1a] focus:border-[#ba1a1a] focus:ring-[#ffdad6]"
            : "border-[#e5e7eb] focus:border-[#7e7576] focus:ring-[#e5e7eb]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        ].join(" ")}
        {...props}
      />

      {(error || helperText) && (
        <p
          id={messageId}
          className={
            error
              ? "text-xs leading-4 text-[#ba1a1a]"
              : "text-xs leading-4 text-[#6b7280]"
          }
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;