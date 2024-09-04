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
      <Link href="/admin" className="text-blue-500  inline-block">
        Back to Doctor List
      </Link>

      <div className="doctor-profile flex flex-col md:flex-row  p-6 rounded-xl shadow-2xl mt-10 bg-teal-50">
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
            className="btn btn-primary mt-4 "
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
              className="btn bg-teal-600  mt-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path
                  fillRule="evenodd"
                  d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
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
