"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/common";
import { useAuth } from "@/hooks/auth/use-auth.hook";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { getSecurityQuestionMutation } = useAuth();

  const [email, setEmail] = useState("");

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      const response = await getSecurityQuestionMutation.mutateAsync({ email });
      const questions = response?.security_questions || [];
      const q1 = questions[0]?.question || "What was the name of your first pet?";
      const q2 = questions[1]?.question || "In what city were you born?";

      router.push(`/reset-password?email=${encodeURIComponent(email)}&q1=${encodeURIComponent(q1)}&q2=${encodeURIComponent(q2)}`);
    } catch {
      // Error handled by mutation state
    }
  };

  const errorMessage =
    getSecurityQuestionMutation.error?.response?.data?.message ||
    getSecurityQuestionMutation.error?.message ||
    null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f8f9fa] px-4 overflow-hidden">
      <div className="w-full max-w-md">
        <Card className="border border-[#e5e7eb] bg-white shadow-sm">
          <CardHeader className="space-y-1.5 pb-6 text-center border-b border-[#e5e7eb]">
            <CardTitle className="text-2xl font-semibold tracking-tight text-black">
              Reset Your Password
            </CardTitle>
            <p className="text-sm text-[#626770]">
              Enter your account email address to answer your security recovery questions.
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleNext} className="space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />

              {errorMessage && (
                <div className="rounded-lg border border-[#ffdad6] bg-[#fff8f7] px-4 py-3">
                  <p className="text-sm text-[#93000a]">{errorMessage}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={getSecurityQuestionMutation.isPending}
              >
                {getSecurityQuestionMutation.isPending ? "Checking account..." : "Continue"}
              </Button>

              <div className="text-center pt-3 border-t border-[#e5e7eb] mt-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#33373d] hover:text-black transition-colors"
                >
                  &larr; Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}