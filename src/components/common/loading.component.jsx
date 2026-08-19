import Spinner from "./spinner.component";

const Loading = ({
  message = "Loading...",
  className = "",
}) => {
  return (
    <div
      className={[
        "flex min-h-40 flex-col items-center justify-center gap-3",
        className,
      ].join(" ")}
    >
      <Spinner />

      <span className="text-sm text-[#6b7280]">
        {message}
      </span>
    </div>
  );
};

export default Loading;