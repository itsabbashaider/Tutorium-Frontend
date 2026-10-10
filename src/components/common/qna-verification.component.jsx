"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, ConfirmModal } from "@/components/common";
import { useAuth } from "@/hooks/auth/use-auth.hook";
import { SECURITY_QUESTION_OPTIONS } from "@/constants/common/security-questions.constant";

export const SecurityQASection = ({ user }) => {
  const { setupSecurityQAMutation } = useAuth();

  const [isExpanded, setIsExpanded] = useState(false);
  const [pairs, setPairs] = useState([
    { question: SECURITY_QUESTION_OPTIONS[0].value, answer: "" },
    { question: SECURITY_QUESTION_OPTIONS[1].value, answer: "" },
  ]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (user?.security_question_1 && user?.security_question_2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPairs([
        { question: user.security_question_1, answer: "" },
        { question: user.security_question_2, answer: "" },
      ]);
    }
  }, [user]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (pairs[0].question === pairs[1].question) {
      setError("Please select two different security questions.");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmUpdateQA = async () => {
    try {
      await setupSecurityQAMutation.mutateAsync({
        security_questions: pairs.map((p) => ({
          question: p.question,
          answer: p.answer,
        })),
      });

      setSuccess("Security backup answers updated successfully!");
      setShowConfirmModal(false);
      
      setTimeout(() => {
        setSuccess("");
        setIsExpanded(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      setShowConfirmModal(false);
      setError(
        err?.response?.data?.message || err?.message || "Failed to update security answers."
      );
    }
  };

  return (
    <Card className="border border-[#e5e7eb] bg-white shadow-sm">
      <CardHeader className="border-b border-[#e5e7eb] pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-black">Security Backup (Q&A)</CardTitle>
            <p className="text-sm text-[#626770]">
              Select 2 unique recovery questions and provide your custom answers.
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
              Update Security Q&A
            </Button>
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-6 transition-all duration-200">
          <form onSubmit={handleFormSubmit} className="space-y-6 max-w-xl">
            {pairs.map((pair, idx) => (
              <div key={idx} className="space-y-3 rounded-lg border border-[#e5e7eb] bg-[#f8f9fa] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8e95]">
                  Security Question {idx + 1}
                </p>

                <Select
                  id={`question_${idx}`}
                  value={pair.question}
                  onChange={(e) => {
                    const updated = [...pairs];
                    updated[idx].question = e.target.value;
                    setPairs(updated);
                  }}
                  options={SECURITY_QUESTION_OPTIONS}
                />

                <Input
                  id={`answer_${idx}`}
                  type="text"
                  label={`Your Answer ${idx + 1}`}
                  value={pair.answer}
                  onChange={(e) => {
                    const updated = [...pairs];
                    updated[idx].answer = e.target.value;
                    setPairs(updated);
                  }}
                  placeholder="Type your answer"
                  required
                />
              </div>
            ))}

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
                }}
                disabled={setupSecurityQAMutation?.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={setupSecurityQAMutation?.isPending}>
                Save security answers
              </Button>
            </div>
          </form>
        </CardContent>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmUpdateQA}
        title="Are you sure you want to update your security questions?"
        message="These questions will be required if you ever need to recover your account."
        confirmText="Update"
        variant="primary"
        isLoading={setupSecurityQAMutation?.isPending}
      />
    </Card>
  );
};