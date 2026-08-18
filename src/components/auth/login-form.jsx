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
} from "../../components/common";

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
            className="h-11 w-full bg-black"
            disabled={isPending}
          >
            {loginMutation.isPending
              ? "Signing in..."
              : "Sign in"}
          </Button>
        </form>
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
