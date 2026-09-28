"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { useUpdateAvatar } from "@/hooks/common/use-user.hook"; 

export default function ProfilePictureUpload({
  currentAvatarUrl,
  fullName = "User",
  onSuccess,
}) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const { mutate: uploadAvatar, isPending } = useUpdateAvatar({
    onSuccess: (response) => {
      setErrorMessage(null);
      onSuccess?.(response?.data?.data?.avatar_url || response?.data?.avatar_url);
    },
    onError: (error) => {
      setPreviewUrl(null); // revert preview on error
      setErrorMessage(
        error?.response?.data?.message || "Failed to upload photo. Please try again."
      );
    },
  });

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:5000";

  // Priority: newly selected preview > absolute backend URL > relative URL > null
  const displaySrc = (() => {
    if (previewUrl) return previewUrl;
    if (!currentAvatarUrl) return null;
    if (currentAvatarUrl.startsWith("http")) return currentAvatarUrl;
    return `${backendBaseUrl}${currentAvatarUrl}`;
  })();

  const userInitial = fullName?.charAt(0)?.toUpperCase() || "U";

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset previous feedback
    setErrorMessage(null);

    // Validate size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("File size must be 2MB or less.");
      return;
    }

    // Validate MIME type
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validMimeTypes.includes(file.type)) {
      setErrorMessage("Only JPG, PNG, and WebP images are supported.");
      return;
    }

    // Set immediate client-side preview and trigger upload
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    uploadAvatar(file);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-5">
        {/* Avatar Circle */}
        <div
          onClick={() => !isPending && fileInputRef.current?.click()}
          className="group relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-indigo-50 shadow-sm transition-all hover:border-indigo-500"
          role="button"
          tabIndex={0}
          aria-label="Upload profile picture"
        >
          {displaySrc ? (
            <Image
              src={displaySrc}
              alt={fullName}
              fill
              sizes="96px"
              className="object-cover"
              priority
            />
          ) : (
            <span className="text-2xl font-bold text-indigo-600">
              {userInitial}
            </span>
          )}

          {/* Hover / Loading Overlay */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white transition-opacity ${
              isPending
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {isPending ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              <>
                <Camera className="h-5 w-5" />
                <span className="mt-1 text-[10px] font-medium tracking-wide">
                  Change
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action text & Upload Button */}
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Camera className="h-3.5 w-3.5 text-slate-500" />
            {isPending ? "Uploading..." : "Upload your pfp"}
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isPending}
        />
      </div>

      {errorMessage && (
        <p className="text-xs font-medium text-rose-600">{errorMessage}</p>
      )}
    </div>
  );
}