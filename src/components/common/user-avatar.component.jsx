"use client";

import Image from "next/image";

export default function UserAvatar({
  avatarUrl,
  name = "User",
  fallbackChar = "U",
  size = "md",
  className = "",
}) {
  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:5000";

  const displaySrc = (() => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith("http")) return avatarUrl;
    return `${backendBaseUrl}${avatarUrl}`;
  })();

  const initial =
    name?.charAt(0)?.toUpperCase() ||
    fallbackChar?.charAt(0)?.toUpperCase() ||
    "U";

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-20 w-20 text-xl",
  };

  const dimensionMap = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 80,
  };

  const pixelSize = dimensionMap[size] || 40;
  const dimensionClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f0f3ff] font-semibold text-[#3949ab] shadow-sm ${dimensionClass} ${className}`}
    >
      {displaySrc ? (
        <Image
          src={displaySrc}
          alt={name}
          width={pixelSize}
          height={pixelSize}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}