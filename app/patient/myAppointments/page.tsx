"use client";
import React, { useEffect, useState } from "react";
import useAppointmentStore from "@/store/useAppointmentStore";
import useLoginStore from "@/store/useLoginStore";
import Image from "next/image";
import RatingModal from "@/app/components/ratingModel";
import useRatingStore from "@/store/useRatingStore";
import { toast } from "react-toastify";

const MyAppointmentsList = () => {
  const upcomingAppointments = useAppointmentStore(
    (state) => state.upcomingAppointments
  );
  const getAppointments = useAppointmentStore((state) => state.getAppointments);
  const createRating = useRatingStore((state) => state.createRating);
  const patient = useLoginStore((state) => state.patient);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetch = async () => {
      if (patient) {
        await getAppointments({
          patient: patient._id,
          appointmentDate: { $gte: new Date() },
        });
      }
    };
    fetch();
  }, [patient]);

  const openRatingModal = (appointmentId: string) => {
    console.log(`Appointment Id is ${appointmentId}`);
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  const closeRatingModal = () => {
    setIsModalOpen(false);
    setSelectedAppointmentId(null);
  };

  const handleRatingSubmit = async (ratingData: {
    rating: number;
    comment: string;
  }) => {
    let appointment = upcomingAppointments.find(
      (appointment) =>
        appointment._id.toString() === selectedAppointmentId?.toString()
    );
    console.log(appointment);
    if (
      patient &&
      patient._id &&
      appointment &&
      appointment.doctor &&
      appointment.doctor._id
    ) {
      let payload = {
        rating: ratingData.rating,
        comment: ratingData.comment,
        doctor: appointment.doctor._id,
        patient: patient._id,
      };
      console.log(payload);
      await createRating(payload);
      toast.success("Thank you for providing your feedback!");
    }
  };

  const upcoming = upcomingAppointments.filter(
    (appointment) => appointment.status !== "completed"
  );
  const completed = upcomingAppointments.filter(
    (appointment) => appointment.status === "completed"
  );

  return (
    <div className="mt-16 p-4">
      {/* Upcoming Appointments Section */}
      <h2 className="text-2xl font-sans text-center mb-8 text-green-800">
        Upcoming Appointments
      </h2>
      <div>
        {upcoming.length === 0 && (
          <p className="text-center text-lg text-gray-600">
            No Upcoming appointments to display!
          </p>
        )}
      </div>
      <div className="space-y-6">
        {upcoming.length > 0 &&
          upcoming.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-200"
            >
              <div className="flex-shrink-0 mr-4">
                <Image
                  src={
                    patient && patient.profilePic
                      ? patient.profilePic
                      : "/images/avatar-icon.png"
                  }
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover" // Circular shape
                />
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <h3 className="text-xl font-normal text-gray-800 mb-2">
                  Dr. {appointment.doctor.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Speciality:</strong> {appointment.doctor.speciality}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Clinic:</strong>{" "}
                  {appointment.doctor.clinicDetails.clinicName}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Address:</strong>{" "}
                  {appointment.doctor.clinicDetails.clinicAddress},{" "}
                  {appointment.doctor.clinicDetails.city},{" "}
                  {appointment.doctor.clinicDetails.state}
                </p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Appointment Date:</strong>{" "}
                  <span className="font-medium">
                    {new Date(appointment.appointmentDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Time:</strong>{" "}
                  <span className="font-medium">{appointment.slot.time}</span>
                </p>
                <p
                  className={`text-sm ${
                    appointment.status !== "accepted"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  <strong>Status:</strong> {appointment.status}
                </p>
                {appointment.status === "completed" && (
                  <button
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                    onClick={() => openRatingModal(appointment._id)}
                  >
                    Rate Appointment
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Completed Appointments Section */}
      {completed.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-sans text-center mb-8 text-green-800">
            Completed Appointments
          </h2>
          <div className="space-y-6">
            {completed.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-200"
              >
                <div className="flex-shrink-0 mr-4">
                  <Image
                    src={
                      patient && patient.profilePic
                        ? patient.profilePic
                        : "/images/avatar-icon.png"
                    }
                    alt="Avatar"
                    width={100}
                    height={100}
                    className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover" // Circular shape
                  />
                </div>
                <div className="flex-1 mt-4 md:mt-0">
                  <h3 className="text-xl font-normal text-gray-800 mb-2">
                    Dr. {appointment.doctor.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Speciality:</strong> {appointment.doctor.speciality}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Clinic:</strong>{" "}
                    {appointment.doctor.clinicDetails.clinicName}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Address:</strong>{" "}
                    {appointment.doctor.clinicDetails.clinicAddress},{" "}
                    {appointment.doctor.clinicDetails.city},{" "}
                    {appointment.doctor.clinicDetails.state}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Appointment Date:</strong>{" "}
                    <span className="font-medium">
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Time:</strong>{" "}
                    <span className="font-medium">{appointment.slot.time}</span>
                  </p>
                  <p
                    className={`text-sm ${
                      appointment.status !== "accepted"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    <strong>Status:</strong> {appointment.status}
                  </p>
                  {appointment.status === "completed" && (
                    <button
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                      onClick={() => openRatingModal(appointment._id)}
                    >
                      Rate Appointment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={isModalOpen}
        onClose={closeRatingModal}
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default MyAppointmentsList;
