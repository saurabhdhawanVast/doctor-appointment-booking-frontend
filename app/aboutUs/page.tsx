"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

// Images for carousel
const carouselImages = [
  "/images/dabms1.jpg",
  "/images/dabms2.png",
  "/images/dabms3.png",
  "/images/dabms4.jpg",
];

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle automatic background carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Adjusted time for carousel
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans text-gray-800 mt-16">
      {/* Hero Section with Background Carousel */}
      <section className="relative h-96 bg-cover bg-center">
        <div className="absolute inset-0">
          <Image
            src={carouselImages[currentIndex]}
            layout="fill"
            objectFit="fill height-46 w-96"
            alt="Healthcare Innovation"
            className="transition-all duration-700 ease-in-out"
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold">DABMS</h1>
          <p className="text-lg md:text-2xl text-gray-200 mt-4">
            Your Health, Our Priority - Connecting Patients & Doctors
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-700">
              We are a healthcare platform that connects patients with trusted
              healthcare providers. Our mission is to make healthcare more
              accessible, affordable, and convenient for everyone, whether
              you're a doctor or a patient.
            </p>
          </div>

          <div className="md:flex justify-between mb-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Our Services for Patients
              </h2>
              <ul className="list-none space-y-4">
                <li className="bg-blue-500 text-white py-3 px-4 rounded-md shadow-md">
                  Book Appointments with Doctors
                </li>
                <li className="bg-blue-500 text-white py-3 px-4 rounded-md shadow-md">
                  Find Specialists Near You
                </li>
                <li className="bg-blue-500 text-white py-3 px-4 rounded-md shadow-md">
                  Manage Medical Reports and Health Records
                </li>
                <li className="bg-blue-500 text-white py-3 px-4 rounded-md shadow-md">
                  Get Reminders for Appointments and Follow-ups
                </li>
              </ul>
            </div>

            <div className="md:w-1/2">
              <h2 className="text-xl font-semibold ml-4 text-gray-900 mb-4">
                Our Services for Doctors
              </h2>
              <ul className="list-none space-y-4">
                <li className="bg-blue-500 text-white ml-4 py-3 px-4 rounded-md shadow-md">
                  Manage Appointments and Schedules
                </li>
                <li className="bg-blue-500 text-white py-3 ml-4 px-4 rounded-md shadow-md">
                  Review Patient Medical Records
                </li>
                <li className="bg-blue-500 text-white py-3 px-4 ml-4 rounded-md shadow-md">
                  Consult with Patients
                </li>
                <li className="bg-blue-500 text-white py-3 px-4 ml-4 rounded-md shadow-md">
                  Grow Your Patient Base
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          We aim to bridge the gap between patients and healthcare providers by
          utilizing technology to ensure everyone receives the care they need in
          a seamless and efficient way.
        </p>
      </section>

      {/* Innovations in Healthcare Section */}
      <section className="py-16 bg-white">
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-12">
          Innovations in Healthcare
        </h2>
        <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              Seamless Appointment Scheduling
            </h3>
            <p className="text-gray-600">
              Easily book appointments with healthcare providers using our
              user-friendly platform, ensuring you find the right doctor when
              you need them.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              Doctor Reviews and Ratings
            </h3>
            <p className="text-gray-600">
              Access trusted reviews and ratings from other patients to make
              informed decisions about the healthcare provider that best suits
              your needs.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">
              Medical Records Management
            </h3>
            <p className="text-gray-600">
              Keep all your health records, prescriptions, and reports in one
              place, accessible anytime, anywhere, ensuring you stay organized
              and prepared for consultations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
