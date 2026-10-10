"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, ConfirmModal } from "@/components/common";
import { useAuth } from "@/hooks";
import { passwordSchema } from "@/schemas/common/common.schema";
import { Eye, EyeOff } from "lucide-react";

export const ChangePasswordSection = () => {
  const { changePasswordMutation } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Independent visibility state for each input field
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPasswordError("");

    // 1. Validate new password strength against Zod schema rules
    const result = passwordSchema.safeParse(passwordForm.new_password);
    if (!result.success) {
      setPasswordError(result.error.issues[0]?.message);
      return;
    }

    // 2. Check confirmation match
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    // 3. Check different from current
    if (passwordForm.current_password === passwordForm.new_password) {
      setError("New password must be different from current password.");
      return;
    }

    // Trigger confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmChangePassword = async () => {
    try {
      await changePasswordMutation.mutateAsync({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        confirm_password: passwordForm.confirm_password,
      });

      setSuccess("Password changed successfully!");
      setShowConfirmModal(false);
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setTimeout(() => {
        setSuccess("");
        setIsExpanded(false);
      }, 1500);
    } catch (err) {
      setShowConfirmModal(false);
      setError(
        err?.response?.data?.message || err?.message || "Failed to change password."
      );
    }
  };

  return (
    <Card className="border border-[#e5e7eb] bg-white shadow-sm">
      <CardHeader className="border-b border-[#e5e7eb] pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-black">Password</CardTitle>
            <p className="text-sm text-[#626770]">
              Manage your account password and security preferences.
            </p>
          </div>

          {!isExpanded && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="shrink-0"
            >
              Change password
            </Button>
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-6 transition-all duration-200">
          <form onSubmit={handleFormSubmit} className="space-y-4 max-w-xl">
            {/* Current Password Field */}
            <div className="relative">
              <Input
                id="current_password"
                label="Current Password"
                type={showPasswords.current ? "text" : "password"}
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                placeholder="••••••••"
                required
              />
              {passwordForm.current_password.length > 0 && (
                <button
                  type="button"
                  onClick={() => toggleVisibility("current")}
                  className="absolute right-3 top-9 text-gray-500 hover:text-black focus:outline-none"
                  tabIndex={-1}
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>

            {/* New Password Field */}
            <div className="relative">
              <Input
                id="new_password"
                label="New Password"
                type={showPasswords.new ? "text" : "password"}
                value={passwordForm.new_password}
                onChange={(e) => {
                  setPasswordForm({ ...passwordForm, new_password: e.target.value });
                  if (passwordError) setPasswordError("");
                }}
                placeholder="••••••••"
                required
              />
              {passwordForm.new_password.length > 0 && (
                <button
                  type="button"
                  onClick={() => toggleVisibility("new")}
                  className="absolute right-3 top-9 text-gray-500 hover:text-black focus:outline-none"
                  tabIndex={-1}
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
              {passwordError && <p className="mt-1 text-xs text-[#93000a]">{passwordError}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <Input
                id="confirm_password"
                label="Confirm New Password"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                placeholder="••••••••"
                required
              />
              {passwordForm.confirm_password.length > 0 && (
                <button
                  type="button"
                  onClick={() => toggleVisibility("confirm")}
                  className="absolute right-3 top-9 text-gray-500 hover:text-black focus:outline-none"
                  tabIndex={-1}
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
                <p className="text-sm text-[#93000a]">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-[#c6f6d5] bg-[#f0fff4] px-4 py-3">
                <p className="text-sm text-[#22543d]">{success}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsExpanded(false);
                  setError("");
                  setPasswordError("");
                  setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
                }}
                disabled={changePasswordMutation?.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={changePasswordMutation?.isPending}>
                Update password
              </Button>
            </div>
          </form>
        </CardContent>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmChangePassword}
        title="Are you sure you want to change your password?"
        message="You will need to use your new password the next time you log in."
        confirmText="Update"
        variant="primary"
        isLoading={changePasswordMutation?.isPending}
      />
    </Card>
  );
};