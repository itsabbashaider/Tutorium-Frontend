// components/OnboardingRoleModal.jsx

"use client";

import { useState } from "react";
import { updateUserRole } from "@/services/auth/role-selection.service";

export default function OnboardingRoleModal({ isOpen, onComplete }) {
  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateUserRole(selectedRole);
      onComplete(); // Trigger parent action to close modal and refresh
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Tutorium! 🎉</h2>
        <p className="text-sm text-gray-600 mb-6">How will you be using the platform?</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200 text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedRole("STUDENT")}
              className={`rounded-xl border p-4 text-center transition-all ${
                selectedRole === "STUDENT"
                  ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm ring-2 ring-indigo-600/20"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="font-semibold">Student</div>
              <div className="text-xs text-gray-500 mt-1">I want to learn & find tutors</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("TUTOR")}
              className={`rounded-xl border p-4 text-center transition-all ${
                selectedRole === "TUTOR"
                  ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm ring-2 ring-indigo-600/20"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="font-semibold">Tutor</div>
              <div className="text-xs text-gray-500 mt-1">I want to teach & earn</div>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 mt-6 shadow-md shadow-indigo-600/20"
          >
            {loading ? "Setting up your account..." : "Continue to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}