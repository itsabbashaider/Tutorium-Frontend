import cn from "@/utils/common/cn.util";

const Card = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-[#e5e7eb] bg-white text-[#151c27]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <h3
      className={cn(
        "text-xl font-semibold leading-7 tracking-tight text-[#151c27]",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <p
      className={cn(
        "text-sm leading-5 text-[#6b7280]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={cn(
        "p-6 pt-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center p-6 pt-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

export default Card;