"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import useDoctorStore from "@/store/useDoctorStore";

export default function DoctorProfile() {
  const { doctorId } = useParams(); // Get the doctorId from URL parameters
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const router = useRouter();

  const { doctor, fetchDoctorProfile, verifyDoctor } = useDoctorStore(
    (state) => ({
      doctor: state.doctor,
      fetchDoctorProfile: state.fetchDoctorProfile,
      verifyDoctor: state.verifyDoctor,
    })
  );

  useEffect(() => {
    if (doctorId) {
      fetchDoctorProfile(doctorId as string);
    }
  }, [doctorId, fetchDoctorProfile]);

  const handleVerify = async () => {
    if (doctorId) {
      await verifyDoctor(doctorId as string);
      toast.success("Doctor verified successfully");
    }
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="mt-10 p-8 mb-1 ">
      <div>
        <button
          onClick={() => router.push("/admin")}
          className="p-2 bg-gray-200 rounded-full mr-4 mb-3"
        >
          <IoMdArrowRoundBack className="text-black " />
        </button>
      </div>

      <div className="flex  flex-wrap  rounded-xl shadow-2xl  h-fit min-h-screen ">
        <div className="rounded-xl flex flex-wrap sm:w-96 md:w-2/3 px-4">
          {/* Doctor Profile Picture and Name */}
          <div className="flex  flex-wrap items-center mb-6">
            {doctor.profilePic && (
              <img
                src={doctor.profilePic}
                alt={`${doctor.name}'s profile picture`}
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 mr-6"
              />
            )}
            <div>
              <h2 className="text-4xl font-bold text-gray-800">
                {doctor.name}
              </h2>
              <p className="text-gray-600 font-semibold">
                {doctor.contactNumber}
              </p>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="flex flex-wrap gap-4 ">
            <div className="space-y-2">
              <p className="text-lg">
                <strong className="text-teal-600">Speciality:</strong>{" "}
                {doctor.speciality}
              </p>
              <p className="text-lg">
                <strong className="text-teal-600">Qualification:</strong>{" "}
                {doctor.qualification}
              </p>
              <p className="text-lg">
                <strong className="text-teal-600">Registration No:</strong>{" "}
                {doctor.registrationNumber}
              </p>
            </div>
            {/* Vertical Divider */}
            <div className="border-l border-gray-300 h-auto "></div>
            <div className="space-y-2">
              <p className="text-lg">
                <strong className="text-teal-600">Year of Registration:</strong>{" "}
                {doctor.yearOfRegistration}
              </p>
              <p className="text-lg">
                <strong className="text-teal-600">
                  State Medical Council:
                </strong>{" "}
                {doctor.stateMedicalCouncil}
              </p>
              <p className="text-lg">
                <strong className="text-teal-600">Clinic Address:</strong>{" "}
                {doctor.clinicDetails?.clinicAddress}
              </p>
            </div>
          </div>

          <div className="mt-6 w-full">
            <p className=" text-gray-700 mt-2 text-justify leading-relaxed ">
              <strong className="text-teal-600 text-lg">Bio:</strong>{" "}
              {doctor.bio}
            </p>
          </div>

          {/* Verify Button */}
          <div className="mt-6">
            <button
              onClick={() => setIsVerificationModalOpen(true)}
              className={`btn px-6 py-3 text-white font-semibold ${
                doctor.isVerified
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700"
              } rounded-lg shadow-lg transition duration-300`}
              disabled={doctor.isVerified}
            >
              {doctor.isVerified ? "Verified" : "Verify Doctor"}
            </button>
          </div>
        </div>
        {/* Document Image Section */}
        {doctor.document && (
          <div className="md:w-1/3 flex flex-col items-center  ">
            <img
              src={doctor.document}
              alt={`${doctor.name}'s document`}
              className="w-full h-auto rounded-lg cursor-pointer"
              onClick={() => setIsModalOpen(true)} // Open modal on click
            />
          </div>
        )}
      </div>

      {isVerificationModalOpen && (
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-lg font-semibold mb-4">
                Confirm Verification
              </h3>
              <div>
                <p>Are you sure you want to verify this doctor?</p>
                <ul className="list-disc pl-5">
                  <li>This action will confirm their credentials.</li>
                  <li>They will be allowed to provide services.</li>
                  <li>
                    Please ensure all necessary checks have been completed
                    before proceeding.
                  </li>
                </ul>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                  onClick={() => setIsVerificationModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    handleVerify();
                    setIsVerificationModalOpen(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Modal for Viewing Full Image */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto">
          <div className="relative bg-white p-4 rounded-lg max-w-full mx-4 max-h-screen overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-black text-2xl cursor-pointer"
            >
              &times;
            </button>
            <img
              src={doctor.document}
              alt={`${doctor.name}'s document`}
              className="w-auto max-w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
