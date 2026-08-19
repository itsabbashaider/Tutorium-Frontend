const variants = {
  default:
    "bg-black text-white",

  secondary:
    "bg-[#f0f3ff] text-[#4c4546]",

  success:
    "bg-[#f0fdf4] text-[#166534]",

  warning:
    "bg-[#fffbeb] text-[#a16207]",

  danger:
    "bg-[#ffdad6] text-[#93000a]",

  info:
    "bg-[#e7eefe] text-[#003fa4]",
};

const Badge = ({
  children,
  variant = "default",
  className = "",
}) => {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md",
        "px-2.5 py-1 text-xs font-semibold",
        variants[variant] ?? variants.default,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
};

export default Badge;