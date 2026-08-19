/* eslint-disable react-hooks/incompatible-library */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { USER_ROLES } from "../../constants";
import { signupSchema } from "../../schemas";
import { useAuth } from "../../hooks";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from "../common";

const RegisterForm = () => {
  const router = useRouter();

  const { signupMutation } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      city: "",
      phone_number: "",
      role: USER_ROLES.STUDENT,
      timezone: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    try {
      await signupMutation.mutateAsync(data);

      router.replace("/login");
    } catch (error) {
      console.error(
        "Signup Failed:",
        error?.response?.data ||
          error?.message ||
          error
      );
    }
  };

  const isPending =
    isSubmitting ||
    signupMutation.isPending;

  const submitError =
    signupMutation.error?.response?.data?.message ||
    signupMutation.error?.message ||
    null;

  const selectRole = (role) => {
    setValue("role", role, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <Card className="w-full max-w-xl border-[#dfe2e7] bg-white shadow-sm">
      <CardHeader className="px-6 pb-4 pt-7 sm:px-10 sm:pt-8">
        <Link
          href="/"
          className="group mb-7 inline-flex w-fit items-center gap-2 text-sm font-medium text-[#5c5f60] transition-colors hover:text-black"
        >
          <span
            aria-hidden="true"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            ←
          </span>

          <span>Home</span>
        </Link>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a8e95]">
            Get started
          </p>

          <CardTitle className="mt-2 text-2xl tracking-tight text-black sm:text-3xl">
            Create account
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-6 sm:px-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm leading-5 text-red-700">
                {submitError}
              </p>
            </div>
          )}

          {/* Account type */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-black">
              Account type
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  selectRole(USER_ROLES.STUDENT)
                }
                aria-pressed={
                  selectedRole ===
                  USER_ROLES.STUDENT
                }
                className={`min-h-24 rounded-xl border p-5 text-left transition ${
                  selectedRole ===
                  USER_ROLES.STUDENT
                    ? "border-[#3949ab] bg-[#f0f3ff] ring-2 ring-[#3949ab]/10"
                    : "border-[#dfe2e7] bg-white hover:border-[#bfc4cc]"
                }`}
              >
                <p className="text-base font-semibold text-black">
                  Student
                </p>

                <p className="mt-1.5 text-sm leading-5 text-[#626770]">
                  Find tutors and book lessons.
                </p>
              </button>

              <button
                type="button"
                onClick={() =>
                  selectRole(USER_ROLES.TUTOR)
                }
                aria-pressed={
                  selectedRole ===
                  USER_ROLES.TUTOR
                }
                className={`min-h-24 rounded-xl border p-5 text-left transition ${
                  selectedRole ===
                  USER_ROLES.TUTOR
                    ? "border-[#3949ab] bg-[#f0f3ff] ring-2 ring-[#3949ab]/10"
                    : "border-[#dfe2e7] bg-white hover:border-[#bfc4cc]"
                }`}
              >
                <p className="text-base font-semibold text-black">
                  Tutor
                </p>

                <p className="mt-1.5 text-sm leading-5 text-[#626770]">
                  Teach students and earn income.
                </p>
              </button>
            </div>

            {errors.role?.message && (
              <p className="text-xs text-red-600">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Form fields */}
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <Input
              label="Full name"
              placeholder="Your full name"
              autoComplete="name"
              error={errors.full_name?.message}
              {...register("full_name")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="City"
              placeholder="Your city"
              autoComplete="address-level2"
              error={errors.city?.message}
              {...register("city")}
            />

            <Input
              label="Phone number"
              placeholder="Your phone number"
              autoComplete="tel"
              error={errors.phone_number?.message}
              {...register("phone_number")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Timezone"
              placeholder="e.g. Asia/Karachi"
              helperText="Optional"
              error={errors.timezone?.message}
              {...register("timezone")}
            />
          </div>

          <Button
            type="submit"
            className="h-11 w-full bg-black"
            disabled={isPending}
          >
            {signupMutation.isPending
              ? "Creating account..."
              : "Create account"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t-0 px-6 pb-7 pt-5 sm:px-10">
        <p className="text-sm text-[#626770]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#003fa4] hover:underline"
          >
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
