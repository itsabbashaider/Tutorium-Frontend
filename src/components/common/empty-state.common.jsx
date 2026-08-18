const EmptyState = ({
  title = "Nothing found",
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={[
        "flex min-h-48 flex-col items-center justify-center",
        "rounded-lg border border-dashed border-[#dfe2e7]",
        "bg-[#fafbfc] p-8 text-center",
        className,
      ].join(" ")}
    >
      <h3 className="text-base font-semibold text-[#151c27]">
        {title}
      </h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-[#6b7280]">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;