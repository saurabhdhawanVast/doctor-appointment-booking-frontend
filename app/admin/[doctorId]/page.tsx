"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useDoctorStore from "@/store/useDoctorStoree";
import Link from "next/link";

export default function DoctorProfile() {
  const { doctorId } = useParams(); // Get the doctorId from URL parameters
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleVerify = () => {
    if (doctorId) {
      verifyDoctor(doctorId as string);
    }
  };

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="container mx-auto py-16 mt-4">
      <Link href="/admin" className="text-blue-500 mb-4 inline-block">
        Back to Doctor List
      </Link>

      <div className="doctor-profile flex flex-col md:flex-row bg-slate-50 p-6 rounded-xxl shadow-2xl mt-10 bg-rose-50">
        {/* Doctor Details Section */}
        <div className="md:w-2/3 md:pr-6">
          <h2 className="text-3xl font-bold mb-4">{doctor.name}</h2>

          {/* Display Profile Picture */}
          {doctor.profilePic && (
            <img
              src={doctor.profilePic}
              alt={`${doctor.name}'s profile picture`}
              className="w-32 h-32 rounded-full mb-4"
            />
          )}

          <p className="text-lg mb-2">
            <strong>Email:</strong> {doctor.email}
          </p>
          <p className="text-lg mb-2">
            <strong>Speciality:</strong> {doctor.speciality}
          </p>
          <p className="text-lg mb-2">
            <strong>Qualification:</strong> {doctor.qualification}
          </p>
          <p className="text-lg mb-2">
            <strong>Registration Number:</strong> {doctor.registrationNumber}
          </p>
          <p className="text-lg mb-2">
            <strong>Bio:</strong> {doctor.bio}
          </p>
          <p className="text-lg mb-2">
            <strong>Year of Registration:</strong> {doctor.yearOfRegistration}
          </p>
          <p className="text-lg mb-2">
            <strong>State Medical Council:</strong> {doctor.stateMedicalCouncil}
          </p>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            className="btn btn-primary mt-4"
            disabled={doctor.isVerified} // Disable if already verified
          >
            {doctor.isVerified ? "Verified" : "Verify Doctor"}
          </button>
        </div>

        {/* Document Image Section */}
        {doctor.document && (
          <div className="md:w-1/3 flex flex-col items-center mt-6 md:mt-0">
            <img
              src={doctor.document}
              alt={`${doctor.name}'s document`}
              className="w-full h-auto rounded-lg shadow-md cursor-pointer"
              onClick={() => setIsModalOpen(true)} // Open modal on click
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-secondary mt-4"
            >
              View Full Image
            </button>
          </div>
        )}
      </div>

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
