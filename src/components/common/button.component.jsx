"use client";

const variants = {
  default:
    "bg-black text-white hover:bg-[#1b1b1b]",

  destructive:
    "bg-[#ba1a1a] text-white hover:bg-[#93000a]",

  outline:
    "border border-[#e5e7eb] bg-white text-black hover:border-black hover:bg-black hover:text-white",

  secondary:
    "bg-[#f0f3ff] text-black hover:bg-[#e7eefe]",

  ghost:
    "bg-transparent text-[#5c5f60] hover:bg-black hover:text-white",
};

const sizes = {
  default: "h-11 px-4",
  sm: "h-9 px-3",
  lg: "h-11 px-6",
  icon: "h-10 w-10 p-0",
};

const Button = ({
  children,
  type = "button",
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  loading = false,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-md text-sm font-medium",
        "transition-colors",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#003fa4]/20",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant] ?? variants.default,
        sizes[size] ?? sizes.default,
        className,
      ].join(" ")}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}

      {children}
    </button>
  );
};

export default Button;