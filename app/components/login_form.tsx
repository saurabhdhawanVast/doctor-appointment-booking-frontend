"use client";
import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import useLoginStore from "@/store/useLoginStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Define the Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type Inputs = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const login = useLoginStore((state) => state.login);
  const fetchUser = useLoginStore((state) => state.fetchUser);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    await login(data);

    await fetchUser();
    const user = useLoginStore.getState().user;
    const token = useLoginStore.getState().token;

    if (user?._doc?.role === "admin" && token) {
      router.push("/admin");
    } else if (user?._doc?.role === "patient" && token) {
      router.push("/patient");
    } else if (user?._doc?.role === "doctor" && token) {
      router.push("/doctor");
    }

    console.log(data);
  };

  return (
    <motion.div
      className="py-24"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
          }}
        />
        <motion.div
          className="w-full p-8 lg:w-1/2"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit(processForm)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                autoComplete="off"
                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                autoComplete="current-password"
                className="block w-full rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Login
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <span className="text-sm text-gray-500">
              Are you new?{" "}
              <Link
                href="/register"
                className="text-sm text-gray-700 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </span>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-700 font-semibold"
            >
              Forgot Password?
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginForm;
