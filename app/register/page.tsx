"use client";

import React from "react";
import Link from "next/link";

const Register = () => {
  return (
    <div className="mt-16 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-600 to-gray-300 p-10">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4 animate-fadeIn">
        Join Us
      </h1>
      <p className="text-xl text-gray-700 mb-10">
        Choose your role and embark on your journey!
      </p>

      <div className="flex flex-col md:flex-row gap-10 items-center">
        {/* Doctor Card */}
        <div className="relative w-[500px] h-[350px] bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fadeIn">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-[-1] opacity-50"
          >
            <source src="/video/v1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full p-6">
            <h2 className="text-3xl font-semibold text-white">Doctor</h2>
            <p className="mt-2 text-white text-center">
              Become a doctor and make a difference in people's lives.
            </p>
            <Link
              href="/register/registerdoctor"
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Patient Card */}
        <div className="relative w-[500px] h-[350px] bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fadeIn">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-[-1] opacity-50"
          >
            <source src="/video/v3.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
          <div className="relative z-10 flex flex-col justify-center items-center h-full p-6">
            <h2 className="text-3xl font-semibold text-white">Patient</h2>
            <p className="mt-2 text-white text-center">
              Join us as a patient and access quality healthcare.
            </p>
            <Link
              href="/register/registerpatient"
              className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition duration-300"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mt-8">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Register;
