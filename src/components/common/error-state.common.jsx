const ErrorState = ({
  title = "Something went wrong",
  description = "We couldn't load this information.",
  action,
  className = "",
}) => {
  return (
    <div
      role="alert"
      className={[
        "flex min-h-48 flex-col items-center justify-center",
        "rounded-lg border border-[#ffdad6]",
        "bg-[#fff8f7] p-8 text-center",
        className,
      ].join(" ")}
    >
      <h3 className="text-base font-semibold text-[#93000a]">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#ba1a1a]">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
};

export default ErrorState;