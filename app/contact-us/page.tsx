"use client";
import React, { useState } from "react";
import {
  FaEnvelope,
  FaUser,
  FaCommentDots,
  FaPaperPlane,
} from "react-icons/fa";
import { motion } from "framer-motion";
import useContactStore from "@/store/useContactStore";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState("");
  const createContact = useContactStore((state) => state.createContact);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("Sending..."); // Optional: Add sending status
    try {
      console.log("Sending contact data:", formData); // Debug log for form data
      await createContact(formData);
      setFormStatus("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      // Better error message handling
      setFormStatus(
        error.response?.data?.message || "An error occurred. Please try again later."
      );
    }
  };

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section with Background */}
      <section className="relative h-64 bg-gradient-to-r from-blue-600 to-green-400 text-white">
        <div className="absolute inset-0 bg-contact-bg-pattern bg-center bg-cover opacity-70"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10">
          <motion.h1
            className="text-5xl font-extrabold"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-xl mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            We're always here to help!
          </motion.p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl font-semibold text-blue-600 mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-600">
              {/* We’d love to hear from you! Fill out the form below to reach us. */}
              We’d love to hear from you! Fill out the form below, and our team will get back to you within 24 hours.
            </p>
          </motion.div>

          <motion.div
            className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative flex items-center border-b border-blue-500 py-2">
                <FaUser className="text-blue-600 absolute left-3" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border-b focus:outline-none focus:border-blue-500 focus:ring-0"
                  required
                />
              </div>

              <div className="relative flex items-center border-b border-green-500 py-2">
                <FaEnvelope className="text-green-600 absolute left-3" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border-b focus:outline-none focus:border-green-500 focus:ring-0"
                  required
                />
              </div>

              <div className="relative flex items-center border-b border-yellow-500 py-2">
                <FaCommentDots className="text-yellow-600 absolute left-3" />
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border-b focus:outline-none focus:border-yellow-500 focus:ring-0"
                  required
                />
              </div>

              <div className="relative flex items-start border-b border-red-500 py-2">
                <FaCommentDots className="text-red-600 absolute left-3 mt-3" />
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border-b focus:outline-none focus:border-red-500 focus:ring-0"
                  rows={5}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-md shadow-md hover:from-blue-500 hover:to-green-400 transition duration-300"
              >
                <FaPaperPlane className="mr-2" />
                Send Message
              </button>

              {/* Display form status */}
              {formStatus && (
                <motion.p
                  className={`text-center mt-4 font-semibold ${
                    formStatus.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formStatus}
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
};

export default ContactUs;
