"use client";
import React, { useState } from "react";
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
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
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
      setAlert({
        type: "success",
        message:
          "If an account with that email exists, a password reset link will be sent to it.",
      });
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        message:
          "An error occurred while sending the password reset link. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      {/* Navbar */}
      <nav className="navbar bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-xl font-bold">DABS</h1>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            Forgot Password
          </h2>

          {alert && (
            <div
              role="alert"
              className={`flex items-center p-4 mb-6 rounded-md ${
                alert.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              } border border-transparent ${
                alert.type === "success" ? "border-green-300" : "border-red-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current mr-3"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                {alert.type === "success" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4.5M12 16h.01M4.93 4.93a10 10 0 1114.14 14.14M4.93 4.93L19.07 19.07"
                  />
                )}
              </svg>
              <span>{alert.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(processForm)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-lg font-medium mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                autoComplete="off"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 p-2.5 text-gray-900 sm:text-base"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
              >
                Send Reset Link
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
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
