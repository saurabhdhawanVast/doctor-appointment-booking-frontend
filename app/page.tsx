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
import faqImg from "../public/images/faq-img.png";
import videoIcon from "../public/images/video-icon.png";
import avatarIcon from "../public/images/avatar-icon.png";

export default function Home() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const fetchDoctors = useDoctorStore((state) => state.fetchDoctors);

  useEffect(() => {
    const getDoctors = async () => {
      await fetchDoctors();
      // Access the Zustand state directly to get doctors
      const fetchedDoctors = useDoctorStore.getState().doctors;
      // Ensure fetchedDoctors is an array
      if (Array.isArray(fetchedDoctors)) {
        setDoctors(fetchedDoctors);
      } else {
        console.error("Doctors data is not an array:", fetchedDoctors);
      }
    };
    getDoctors();
  }, [fetchDoctors]);

  // Framer Motion scroll animations
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
  return (
    <>
      {/* Header Section */}

      {/* Hero Section */}
      <section className="hero bg-blue-500 text-white text-center py-24">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            We Help You Find the Best Doctors
          </h1>
          <p className="text-xl mb-6">
            Easily book your appointments and get the best healthcare services.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
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
                className="feature-card p-6 bg-slate-200 border rounded-lg shadow-2xl drop-shadow-2xl"
                initial={{ scale: 1 }}
                whileInView={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
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
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {[
              {
                step: 1,
                title: "Search for Doctors",
                desc: "Use our search feature to find the best doctors near you.",
              },
              {
                step: 2,
                title: "Choose a Time",
                desc: "Select a time slot that works for you from the available options.",
              },
              {
                step: 3,
                title: "Confirm and Book",
                desc: "Confirm your details and book your appointment.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="step-card p-6 border rounded-lg bg-slate-200 shadow-2xl drop-shadow-2xl"
                initial={{ scale: 1 }}
                whileInView={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
              >
                <h3 className="text-2xl font-semibold">Step {step.step}</h3>
                <h4 className="text-xl font-semibold mt-2">{step.title}</h4>
                <p className="mt-2">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor List Section */}
      <section className="doctor-list py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Find Your Doctor
          </h2>
          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search by name, specialty, or location..."
              className="p-2 rounded-lg border"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.length > 0 ? (
              doctors.map((doctor: any) => (
                <motion.div
                  key={doctor._id}
                  className="doctor-card p-6 bg-white border rounded-lg shadow-md"
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1.05 }}
                  transition={{ duration: 0.9 }}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{doctor.name}</h3>
                      <p className="mt-2">{doctor.speciality || ""}</p>
                      <Link
                        href={`/doctor/${doctor._id}`}
                        className="btn btn-primary mt-4"
                      >
                        View Profile
                      </Link>
                    </div>
                    <div className="flex mt-2">
                      {renderStars(doctor.avgRating)}
                      {/* <span className="ml-2 text-gray-600">
                        {doctor.ratings.toFixed(1)} / 5
                      </span> */}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center col-span-full">No doctors found</p>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Patients Say</h2>
          <div className="flex flex-col md:flex-row gap-6">
            {[
              {
                name: "Emily R.",
                review:
                  "Excellent service! Booking an appointment was a breeze.",
              },
              {
                name: "Michael T.",
                review: "Great doctors and fast appointment scheduling.",
              },
              {
                name: "Sarah L.",
                review: "The support team was very helpful with my queries.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card p-6 bg-white border rounded-lg shadow-md"
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
              >
                <p className="text-md mb-4">"{testimonial.review}"</p>
                <p className="font-semibold">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="feature py-16">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">
              Get Virtual Treatment Anytime
            </h2>
            <ul className="list-disc list-inside text-lg mb-4">
              <li>Schedule the appointment directly.</li>
              <li>Search your physician and contact their office.</li>
              <li>
                View physicians who are accepting new patients and use the
                online scheduling tool to select an appointment time.
              </li>
            </ul>
            <Link href="/services" className="btn btn-primary">
              Learn More
            </Link>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0 relative">
            <motion.div
              className="relative"
              initial={{ scale: 1 }}
              whileInView={{ scale: 1.05 }}
              transition={{ duration: 0.7 }}
            >
              <Image
                src={featureImg}
                alt="Feature Image"
                layout="responsive"
                width={700}
                height={500}
              />
              <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold">Tue, 24</p>
                    <p className="text-lg">10:00AM</p>
                  </div>
                  <span className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center">
                    <Image
                      src={videoIcon}
                      alt="Video Icon"
                      width={24}
                      height={24}
                    />
                  </span>
                </div>
                <div className="bg-blue-100 p-2 rounded-full mt-2 text-center text-blue-600">
                  Consultation
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Image
                    src={avatarIcon}
                    alt="Avatar Icon"
                    width={24}
                    height={24}
                  />
                  <p className="text-lg font-semibold">Wayne Collins</p>
                </div>
              </div>
            </motion.div>
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
            <h2 className="text-3xl font-bold mb-8">Most Asked Questions</h2>
            <div className="space-y-4">
              <div className="faq-item">
                <h3 className="text-xl font-semibold">
                  How do I book an appointment?
                </h3>
                <p className="mt-2">
                  You can book an appointment through our website by searching
                  for doctors and selecting a time slot that suits you.
                </p>
              </div>
              <div className="faq-item">
                <h3 className="text-xl font-semibold">
                  What should I bring to my appointment?
                </h3>
                <p className="mt-2">
                  Please bring your ID, insurance card, and any relevant medical
                  records.
                </p>
              </div>
              <div className="faq-item">
                <h3 className="text-xl font-semibold">
                  How can I cancel or reschedule my appointment?
                </h3>
                <p className="mt-2">
                  You can cancel or reschedule your appointment by logging into
                  your account and selecting the appointment details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
