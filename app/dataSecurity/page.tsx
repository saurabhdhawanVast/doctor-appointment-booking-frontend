"use client";
import React from "react";
import {
  FaLock,
  FaShieldAlt,
  FaRegClipboard,
  FaDatabase,
} from "react-icons/fa";
import { motion } from "framer-motion";

const DataSecurity = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-500 text-white overflow-hidden pt-20">
        <div className="absolute inset-0 bg-data-security-pattern bg-center bg-cover opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center py-16 px-6">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Data Security
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Ensuring Your Information is Safe and Secure
          </motion.p>
        </div>
      </section>

      {/* Security Measures Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-indigo-600 mb-6">
              How We Protect Your Data
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              At DABS, safeguarding your data is our top priority. Here’s how we
              ensure the security of your personal and medical information.
            </p>
          </motion.div>

          <div className="flex justify-around ">
            <motion.div
              className=" bg-white p-8 rounded-xl shadow-lg mb-8 md:mb-0 flex items-start w-[30%]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-indigo-600 text-4xl mr-4">
                <FaLock />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Advanced Encryption
                </h3>
                <p className="text-gray-600">
                  We have services to ensure that all your personal and medical
                  data is securely protected against unauthorized access.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg mb-8 md:mb-0 flex items-start w-[30%]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-green-600 text-4xl mr-4">
                <FaShieldAlt />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Secure Authentication
                </h3>
                <p className="text-gray-600">
                  Our robust authentication mechanisms ensure that only
                  authorized users can access sensitive information. We employ
                  multi-factor authentication to enhance security.
                </p>
              </div>
            </motion.div>

            {/* <motion.div
              className="bg-white p-8 rounded-xl shadow-lg mb-8 md:mb-0 flex items-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-yellow-600 text-4xl mr-4">
                <FaDatabase />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Regular Data Backups
                </h3>
                <p className="text-gray-600">
                  We perform regular backups of all data to ensure that in case
                  of any unforeseen issues, your information remains intact and
                  recoverable.
                </p>
              </div>
            </motion.div> */}

            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg mb-8 md:mb-0 flex items-start w-[30%]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-red-600 text-4xl mr-4">
                <FaRegClipboard />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Compliance with Regulations
                </h3>
                <p className="text-gray-600">
                  We adhere to all relevant data protection regulations and
                  standards to ensure that your information is handled in
                  accordance with the highest security practices.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visual Representation Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 md:px-12 text-center relative">
          <motion.h2
            className="text-3xl md:text-4xl font-semibold text-indigo-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            Visualizing Data Security
          </motion.h2>
          <motion.p
            className="text-gray-700 mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Discover how we implement security measures through our
            comprehensive approach to data protection.
          </motion.p>

          <div className="relative">
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center p-6 rounded-lg">
              <div className="text-center text-white">
                <p>
                  Our services ensures that only you and authorized parties have
                  access to your sensitive data, maintaining confidentiality and
                  integrity.
                </p>
              </div>
            </div>
            <img
              src="/images/data-security.jpeg"
              alt="Data Security"
              className="w-full h-64 object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-200">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            We're Here to Protect Your Data
          </h2>
          <p className="text-gray-400 mb-4">
            For any concerns about our data security practices, feel free to{" "}
            <a href="/contact-us" className="text-blue-400 hover:underline">
              contact us
            </a>
            .
          </p>
          <p className="text-gray-400">© 2024 DABMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DataSecurity;
