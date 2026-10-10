"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/common";
import { useAuth } from "@/hooks/auth/use-auth.hook";
import { passwordSchema } from "@/schemas/common/common.schema";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifySecurityAnswerMutation, resetPasswordWithQAMutation } = useAuth();

  const [email, setEmail] = useState("");
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [securityAnswers, setSecurityAnswers] = useState(["", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("VERIFY_ANSWER"); 
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const qEmail = searchParams.get("email");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (qEmail) setEmail(qEmail);

    const q1 = searchParams.get("q1") || "What was the name of your first pet?";
    const q2 = searchParams.get("q2") || "In what city were you born?";
    setSecurityQuestions([q1, q2]);
  }, [searchParams]);

  useEffect(() => {
    if (successMessage && step === "NEW_PASSWORD" && !resetPasswordWithQAMutation.isSuccess) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, step, resetPasswordWithQAMutation.isSuccess]);

  const handleVerifyAnswers = async (e) => {
    e.preventDefault();
    setValidationError("");
    try {
      const response = await verifySecurityAnswerMutation.mutateAsync({
        email,
        security_answers: securityAnswers,
      });

      setResetToken(response.resetToken);
      setSuccessMessage("Security answers verified successfully!");
      setStep("NEW_PASSWORD");
      verifySecurityAnswerMutation.reset();
    } catch {
      // Error handled by mutation
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setValidationError("");
    setPasswordError("");

    const result = passwordSchema.safeParse(newPassword);
    if (!result.success) {
      setPasswordError(result.error.issues[0]?.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      await resetPasswordWithQAMutation.mutateAsync({
        resetToken,
        newPassword,
      });

      setSuccessMessage("Password successfully reset! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      // Error handled by mutation
    }
  };

  const activeError =
    validationError ||
    (step === "VERIFY_ANSWER"
      ? verifySecurityAnswerMutation.error?.response?.data?.message || verifySecurityAnswerMutation.error?.message
      : resetPasswordWithQAMutation.error?.response?.data?.message || resetPasswordWithQAMutation.error?.message);

  const isPending = verifySecurityAnswerMutation.isPending || resetPasswordWithQAMutation.isPending;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f8f9fa] px-4 overflow-hidden">
      <div className="w-full max-w-md">
        <Card className="border border-[#e5e7eb] bg-white shadow-sm">
          <CardHeader className="space-y-1.5 text-center pb-4 border-b border-[#e5e7eb]">
            <CardTitle className="text-xl font-semibold tracking-tight text-black">
              {step === "VERIFY_ANSWER" ? "Security Verification" : "Create New Password"}
            </CardTitle>
            <p className="text-sm text-[#626770]">
              {step === "VERIFY_ANSWER"
                ? "Answer your 2 security questions to proceed."
                : "Enter your secure new password below."}
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            {step === "VERIFY_ANSWER" ? (
              <form onSubmit={handleVerifyAnswers} className="space-y-4">
                {securityQuestions.map((q, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="rounded-lg border border-[#e5e7eb] bg-[#f8f9fa] p-3">
                      <p className="text-xs uppercase tracking-wide text-[#8a8e95]">Question {idx + 1}</p>
                      <p className="mt-1 text-sm font-medium text-black">{q}</p>
                    </div>

                    <Input
                      id={`answer_${idx}`}
                      type="text"
                      label={`Your Answer ${idx + 1}`}
                      value={securityAnswers[idx]}
                      onChange={(e) => {
                        const updated = [...securityAnswers];
                        updated[idx] = e.target.value;
                        setSecurityAnswers(updated);
                      }}
                      placeholder="Enter your answer"
                      required
                    />
                  </div>
                ))}

                {activeError && (
                  <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
                    <p className="text-sm text-[#93000a]">{activeError}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-lg border border-[#c6f6d5] bg-[#f0fff4] px-4 py-3">
                    <p className="text-sm text-[#22543d]">{successMessage}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Verifying..." : "Verify Answers"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Input
                    id="newPassword"
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    placeholder="••••••••"
                    required
                  />
                  {passwordError && <p className="mt-1 text-xs text-[#93000a]">{passwordError}</p>}
                </div>

                <Input
                  id="confirmPassword"
                  type="password"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                {activeError && (
                  <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
                    <p className="text-sm text-[#93000a]">{activeError}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-lg border border-[#c6f6d5] bg-[#f0fff4] px-4 py-3 flex items-center gap-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#22543d] border-t-transparent" />
                    <p className="text-sm font-medium text-[#22543d]">{successMessage}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Updating..." : "Reset Password"}
                </Button>
              </form>
            )}

            <div className="text-center pt-4 border-t border-[#e5e7eb] mt-4">
              <Link href="/login" className="text-sm font-medium text-black hover:underline">
                &larr; Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}