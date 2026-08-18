const Label = ({
  children,
  htmlFor,
  required = false,
  className = "",
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={[
        "text-sm font-medium leading-5 text-[#151c27]",
        className,
      ].join(" ")}
    >
      {children}

      {required && (
        <span
          aria-hidden="true"
          className="ml-1 text-[#ba1a1a]"
        >
          *
        </span>
      )}
    </label>
  );
};

export default Label;