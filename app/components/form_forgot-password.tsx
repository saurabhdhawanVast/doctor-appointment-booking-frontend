"use client";
import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";

// Define the Zod schema for the forgot password form
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type Inputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      // Send POST request to the API endpoint
      const response = await fetch(
        "http://localhost:3000/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send reset email");
      }

      // Notify the user that the request has been sent
      alert(
        "If an account with that email exists, a password reset link will be sent to it."
      );
    } catch (error) {
      console.error(error);
      alert(
        "An error occurred while sending the password reset link. Please try again later."
      );
    }
  };

  return (
    <div className="py-24">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-md">
        <div className="w-full p-8">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit(processForm)}>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              >
                Send Reset Link
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-700 font-bold"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
