"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import useDoctorStore from "@/store/useDoctorStore";
import Link from "next/link";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
// Importing assets
import icon01 from "../public/images/icon01.png";
import icon02 from "../public/images/icon02.png";
import icon03 from "../public/images/icon03.png";
import featureImg from "../public/images/feature-img.png";
import faqImg from "../public/images/homePageDoctor.png";
import bgImage1 from "../public/images/HomeBg.jpg";
import bgImage2 from "../public/images/doctors2.png";
import bgImage3 from "../public/images/doctors3.jpg";
import bgImage4 from "../public/images/doctors4.jpg";

import ReviewList from "./components/reviewModel";
import Typewriter from "typewriter-effect";

export default function Home() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isReviewModelOpen, setIsReviewModelOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const fetchDoctors = useDoctorStore((state) => state.fetchDoctors);

  useEffect(() => {
    const getDoctors = async () => {
      await fetchDoctors();
      const fetchedDoctors = useDoctorStore.getState().doctors;
      if (Array.isArray(fetchedDoctors)) {
        setDoctors(fetchedDoctors);
      } else {
        console.error("Doctors data is not an array:", fetchedDoctors);
      }
    };
    getDoctors();
  }, [fetchDoctors]);

  const { scrollY } = useScroll();
  const yRange = useTransform(scrollY, [0, 500], [0, -100]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  const handleReviewModelClose = () => {
    setIsReviewModelOpen(false);
    setSelectedDoctor("");
  };

  const handleReviewModelOpen = (doctor: any) => {
    setIsReviewModelOpen(true);
    setSelectedDoctor(doctor);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero relative text-white text-center h-[100vh] sm:h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-10">
          <Image
            src={bgImage1} // Replace with your image path
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            // Adjust opacity as needed
          />
        </div>

        {/* Overlay for Opacity Effect */}
        <div className="absolute inset-0 bg-teal-600 opacity-60  z-20"></div>

        {/* Content */}
        <motion.div
          className="relative container mb-20 p-6 z-30"
          initial={{ scale: 1 }}
          whileInView={{ scale: 1.05 }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center">
            <label className="block text-3xl sm:text-4xl font-bold">
              <Typewriter
                options={{
                  strings: ["Doctor's Appointment Booking System"],
                  autoStart: true,
                  loop: true,
                  delay: 200,
                  cursor: "|",
                }}
              />
            </label>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold mt-6 mb-4">
            We Help You Find the Best Doctors
          </h1>
          <p className="text-lg sm:text-xl">
            Easily book your appointments and get the best healthcare services.
          </p>
        </motion.div>
      </section>

      {/* Features Section - Overlapping Cards */}
      <section className="features relative p-8 w-full -mt-40">
        {" "}
        {/* Use negative margin to overlap */}
        {/* Blue Background */}
        <div className="absolute top-0 left-0 w-full h-full  -z-10"></div>
        {/* Title */}
        {/* Cards */}
        <div className="text-center relative z-20 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Why Choose Us?
          </h2>
        </div>
        <div className="relative z-30 grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Easy Appointment Scheduling",
              desc: "Book and manage your appointments with ease.",
              icon: icon01,
            },
            {
              title: "Experienced Doctors",
              desc: "Connect with certified and experienced doctors.",
              icon: icon02,
            },
            {
              title: "24/7 Support",
              desc: "Get support anytime you need it.",
              icon: icon03,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="relative p-6 bg-gray-100 rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105"
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={40}
                height={40}
              />
              <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
              <p className="mt-2">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Doctor List Section */}
      <section className="doctor-list py-16">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Our Best Doctors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.length > 0 ? (
              <>
                {doctors.slice(0, 3).map((doctor) => (
                  <motion.div
                    key={doctor._id}
                    className="doctor-card p-6 bg-white border rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-fit"
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: 1.05 }}
                    transition={{ duration: 0.9 }}
                  >
                    <div className="flex justify-between">
                      {/* Profile picture and doctor details */}
                      <div className="flex">
                        <div className="w-16 h-16 mr-4">
                          <img
                            src={doctor.profilePic || "/default-profile.png"}
                            alt={doctor.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h3 className="text-lg font-semibold">
                            {doctor.name}
                          </h3>
                          <p>{doctor.speciality || ""}</p>
                          {/* <Link
                  href={`/login`}
                  className="mt-6 bg-teal-600 rounded-lg flex items-center justify-center px-4 py-2 hover:bg-teal-700"
                >
                  Book Appointment
                </Link> */}
                        </div>
                      </div>

                      {/* Rating and reviews */}
                      <div>
                        <div className="flex mt-2">
                          {renderStars(doctor.avgRating)}
                        </div>
                        <div
                          className="text-center text-sm underline hover:text-blue-500 cursor-pointer"
                          onClick={() => handleReviewModelOpen(doctor._id)}
                        >
                          Reviews
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Render skeleton loaders if fewer than 3 doctors are present */}
                {[...Array(Math.max(0, 3 - doctors.length))].map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="p-6 bg-gray-200 border rounded-lg shadow-md animate-pulse h-fit"
                  >
                    <div className="flex justify-between">
                      {/* Profile picture placeholder */}
                      <div className="flex">
                        <div className="w-16 h-16 mr-4 bg-gray-300 rounded-full"></div>
                        <div className="flex flex-col justify-center">
                          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                        </div>
                      </div>
                      {/* Rating placeholder */}
                      <div>
                        <div className="flex mt-2">
                          <div className="h-4 bg-gray-300 rounded w-10 mr-1"></div>
                          <div className="h-4 bg-gray-300 rounded w-10"></div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded w-20 mt-2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-center col-span-full">No doctors found</p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq py-16">
        <div className="container mx-auto flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <motion.div
              className="relative"
              initial={{ scale: 1 }}
              whileInView={{ scale: 1.05 }}
              transition={{ duration: 0.7 }}
            >
              <Image
                src={faqImg}
                alt="FAQ Image"
                layout="responsive"
                width={700}
                height={500}
              />
            </motion.div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Most Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: "How do I book an appointment?",
                  answer:
                    "You can book an appointment through our website by searching for doctors and selecting a time slot that suits you.",
                },
                {
                  question: "What should I bring to my appointment?",
                  answer:
                    "Please bring your ID, insurance card, and any relevant medical records.",
                },
                {
                  question: "How can I cancel or reschedule my appointment?",
                  answer:
                    "You can cancel or reschedule your appointment by logging into your account and selecting the appointment details.",
                },
              ].map((faq, index) => (
                <div key={index} className="faq-item">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {isReviewModelOpen && (
        <ReviewList
          doctorId={selectedDoctor}
          isOpen={isReviewModelOpen}
          onClose={handleReviewModelClose}
        />
      )}
    </>
  );
}
