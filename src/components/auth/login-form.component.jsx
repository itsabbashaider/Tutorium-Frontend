"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../schemas";
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

const LoginForm = () => {
  const { loginMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      console.error(
        "Login Failed:",
        error?.response?.data ||
          error?.message ||
          error
      );
    }
  };

  const isPending =
    isSubmitting ||
    loginMutation.isPending;

  const submitError =
    loginMutation.error?.response?.data?.message ||
    loginMutation.error?.message ||
    null;

  // Handler to trigger Google OAuth login redirect
  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <Card className="w-full max-w-md border-[#dfe2e7] bg-white shadow-sm">
      <CardHeader className="px-6 pb-4 pt-7 sm:px-7 sm:pt-8">
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
            Welcome back
          </p>

          <CardTitle className="mt-2 text-2xl tracking-tight text-black sm:text-3xl">
            Sign in
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-6 sm:px-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm leading-5 text-red-700">
                {submitError}
              </p>
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="space-y-2">
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#003fa4] transition-colors hover:text-[#002f7a] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="h-11 w-full bg-black hover:bg-gray-800"
            disabled={isPending}
          >
            {loginMutation.isPending
              ? "Signing in..."
              : "Sign in"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-between">
          <span className="w-1/4 border-b border-[#dfe2e7]"></span>
          <span className="text-xs uppercase tracking-wider text-[#8a8e95]">Or continue with</span>
          <span className="w-1/4 border-b border-[#dfe2e7]"></span>
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          onClick={handleGoogleLogin}
          variant="outline"
          className="flex h-11 w-full items-center justify-center gap-3 border-[#dfe2e7] bg-white text-black hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.18v3.15C3.17 21.32 7.23 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.18C.43 8.08 0 9.79 0 12s.43 3.92 1.18 5.42l4.1-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.18 6.58l4.1 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
          </svg>
          Google
        </Button>
      </CardContent>

      <CardFooter className="justify-center border-t-0 px-6 pb-7 pt-5 sm:px-7">
        <p className="text-sm text-[#626770]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#003fa4] transition-colors hover:text-[#002f7a] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;