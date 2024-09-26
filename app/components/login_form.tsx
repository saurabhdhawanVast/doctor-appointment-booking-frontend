"use client";
import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import useLoginStore from "@/store/useLoginStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "react-toastify";
import Loading from "../loading";

// Define the Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type Inputs = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const login = useLoginStore((state) => state.login);
  const fetchUser = useLoginStore((state) => state.fetchUser);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
  });

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
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
    } catch (error) {
      toast.error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      //className="relative bg-black w-[calc(100vw-2rem)] h-[calc(100vh-7rem-4rem)] mx-auto mt-28 mb-4 flex justify-center items-center overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 flex-wrap"
      className="relative mx-auto mt-28 ml-8 mr-8 h-[calc(100vh-7rem-4rem)] flex justify-center items-center overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 flex-wrap"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="loader">
            <Loading />
          </div>{" "}
        </div>
      )}

      {/* Image */}
      <div className="absolute top-24 left-[70%] transform -translate-x-1/2 w-[10%] h-[30%] sm:w-[10%] sm:h-[35%] md:w-[10%] md:h-[50%] lg:w-[15%] lg:h-[75%] xl:w-[21%] xl:h-[90%] z-20 hidden md:block transition-transform duration-300">
        <Image
          src="/images/portrait-3d-male-doctor.png"
          alt="3D Male Doctor"
          layout="fill"
          objectFit="contain"
        />
      </div>

      <motion.div
        // className="relative rounded-2xl w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] h-[90%] max-w-[calc(100% - 2rem)] max-h-[calc(100vh - 2rem)] bg-white flex flex-col justify-center items-center mx-auto p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12"
        className="h-fit  sm:w-[90%] md:w-[50%] lg:w-[40%] xl:w-[25%] p-4 bg-white ml-2 mr-2 rounded-xl  "
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-3xl font-semibold text-gray-700 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit(processForm)} className="space-y-4 w-full">
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
              <p className="mt-1 text-xs text-red-500">
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
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full  bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200 relative"
          >
            Login
          </button>
        </form>
        {/* </div> */}

        <div className="mt-4 flex flex-col items-center w-full max-w-[400px]">
          <div className="flex items-center justify-between w-full">
            <span className="border-b w-1/5 md:w-1/5"></span>
            <span className="text-sm text-gray-500 text-center">
              Are you new?{" "}
              <Link
                href="/register"
                className="font-semibold  hover:text-gray-700"
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
        </div>
      </motion.div>

      {/* </div> */}
    </motion.div>
  );
};

export default LoginForm;
