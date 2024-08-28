"use client";
import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import useLoginStore from "@/store/useLoginStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "react-toastify";

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
      className="py-24 h-96 w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative rounded-3xl bg-gradient-to-r from-teal-400 via-teal-500 to-teal-700 flex flex-wrap  justify-center items-center ml-8 mr-8 overflow-hidden">
        <div className="absolute top-0 transform translate-x-[220px] translate-y-[0px] w-[300px] h-[400px]  z-20  hidden md:block transition-transform duration-300 ">
          <Image
            src="/images/portrait-3d-male-doctor.png"
            alt="3D Male Doctor"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <motion.div
          className="w-[400px] p-8 "
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white w-full   rounded-lg shadow-lg overflow-hidden mx-auto p-4">
            <h2 className="text-2xl font-semibold text-gray-700 text-center m-2">
              Login
            </h2>
            <form onSubmit={handleSubmit(processForm)} className="space-y-2">
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
                  className="block w-full h-8 rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
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
                  className="block w-full h-8 rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className=" w-full  bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Login
              </button>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4"></span>
              <span className="text-sm text-gray-500">
                Are you new?
                <Link href="/register">Sign Up</Link>
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
      </div>
    </motion.div>
  );
};

export default LoginForm;
