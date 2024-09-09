// pages/contact.tsx
"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

interface ContactFormInputs {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormInputs) => {
    setIsSubmitting(true);
    try {
      await axios.post("/api/contact", data); // Adjust API endpoint as needed
      setSubmitSuccess("Your message has been sent successfully.");
      reset();
    } catch (error) {
      setSubmitSuccess(
        "There was an error sending your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-6 text-gray-600">
        If you have any questions or need support, please fill out the form
        below, and we will get back to you as soon as possible.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Subject
          </label>
          <input
            type="text"
            {...register("subject", { required: "Subject is required" })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter the subject"
          />
          {errors.subject && (
            <p className="text-red-500 text-xs italic">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Message
          </label>
          <textarea
            {...register("message", { required: "Message is required" })}
            className="w-full px-3 py-2 border rounded-lg"
            rows={4}
            placeholder="Enter your message"
          />
          {errors.message && (
            <p className="text-red-500 text-xs italic">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          {submitSuccess && (
            <p className="text-green-500 text-sm">{submitSuccess}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-500 text-white py-2 px-4 rounded ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}
