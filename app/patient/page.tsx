"use client";
import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa"; // Import search icon from react-icons

import useRegisterDoctorStore from "@/store/useRegisterDoctorStore";
import { toast } from "react-toastify";
import { set } from "react-hook-form";
import Loading from "../loading";

const Doctor = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const doctorSpecialties = useRegisterDoctorStore(
    (state) => state.doctorSpecialties
  );

  const handleSearch = () => {
    try {
      if (selectedSpecialty) {
        setIsLoading(true);
        router.push(`/patient/find-doctor?specialty=${selectedSpecialty}`);
      }
    } catch (err) {
      toast.error("Error Occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    // <div className="relative w-[100%] h-[100%] mt-16 overflow-hidden object-fit">
    <div className="relative w-[99.9vw] h-[89vh] mt-16 overflow-hidden ">
      {/* Image Slider */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="loader">
            <Loading />
          </div>{" "}
        </div>
      )}

      <Slider {...settings} className="w-full h-full ">
        <img
          src="/images/doctors1.jpg"
          alt="Doctor Image 1"
          className="w-full h-full object-contain"
        />

        <img
          src="/images/doctors4.jpg"
          alt="Doctor Image 4"
          className="w-full h-full object-contain"
        />

        <img
          src="/images/doctors6.jpg"
          alt="Doctor Image 6"
          className="w-full h-full object-contain"
        />
      </Slider>

      {/* Search Bar */}
      <div className="absolute z-10 top-0 left-0 right-0 w-full h-64  flex items-center justify-center">
        <div className="flex items-center w-96 space-x-2 bg-white  border border-gray-300 rounded-lg shadow-lg p-2">
          <select
            className="flex-grow p-2 border-none rounded-l-lg"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="">Select doctor by speciality</option>
            {doctorSpecialties.map((specialty, index) => (
              <option key={index} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>

          <button
            className="bg-teal-500 text-white p-2 rounded-r-lg flex items-center space-x-1 hover:bg-teal-600"
            onClick={handleSearch}
          >
            <FaSearch />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>

      {/* Get Appointment Button */}
    </div>
  );
};

export default Doctor;
