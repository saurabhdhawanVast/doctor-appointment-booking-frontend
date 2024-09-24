"use client";
import React, { useEffect, useState } from "react";
import useAppointmentStore from "@/store/useAppointmentStore";
import useLoginStore from "@/store/useLoginStore";
import Image from "next/image";
import RatingModal from "@/app/components/ratingModel";
import useRatingStore from "@/store/useRatingStore";

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
  const [ratedAppointments, setRatedAppointments] = useState<Set<string>>(
    new Set()
  );
  const [activeSection, setActiveSection] = useState<"upcoming" | "completed">(
    "upcoming"
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0); // To make the comparison date-only

  useEffect(() => {
    const fetch = async () => {
      if (patient) {
        await getAppointments({ patient: patient._id });
      }
    };
    fetch();
  }, [patient]);

  const openRatingModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  const closeRatingModal = () => {
    setIsModalOpen(false);
    setSelectedAppointmentId(null);
  };

  const handleRatingSubmit = async (ratingData: {
    rating: number;
    comment?: string;
  }) => {
    let appointment = upcomingAppointments.find(
      (appointment) =>
        appointment._id.toString() === selectedAppointmentId?.toString()
    );
    if (
      patient &&
      patient._id &&
      appointment &&
      appointment.doctor &&
      appointment.doctor._id
    ) {
      let payload = {
        rating: ratingData.rating,
        comment: ratingData.comment || "",
        doctor: appointment.doctor._id,
        appointment: appointment._id,
        patient: patient._id,
      };
      await createRating(payload);
      setRatedAppointments((prev) =>
        new Set(prev).add(appointment._id.toString())
      );
      closeRatingModal();
    }
  };

  // Combine upcoming and completed appointments
  const allAppointments = upcomingAppointments.map((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0); // Make it date-only for comparison

    let status = appointment.status;

    // If the appointment is in the past and accepted, mark it as 'not attended'
    if (appointmentDate < today && appointment.status === "accepted") {
      status = "not attended";
    }

    // Flag for upcoming appointments
    return {
      ...appointment,
      status,
      isUpcoming:
        appointmentDate >= today && appointment.status !== "completed",
    };
  });

  // Sort upcoming appointments by date (ascending order)
  const upcoming = allAppointments
    .filter((appointment) => appointment.isUpcoming)
    .sort(
      (a, b) =>
        new Date(a.appointmentDate).getTime() -
        new Date(b.appointmentDate).getTime()
    );

  // Sort completed appointments by date (descending order)
  const completed = allAppointments
    .filter((appointment) => !appointment.isUpcoming)
    .sort(
      (a, b) =>
        new Date(b.appointmentDate).getTime() -
        new Date(a.appointmentDate).getTime()
    );

  const activeAppointments =
    activeSection === "upcoming" ? upcoming : completed;

  return (
    <div className="mt-16 p-4 h-fit min-h-screen">
      {/* Sidebar for toggling */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setActiveSection("upcoming")}
          className={`mx-2 px-4 py-2 rounded ${
            activeSection === "upcoming"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Upcoming Appointments
        </button>
        <button
          onClick={() => setActiveSection("completed")}
          className={`mx-2 px-4 py-2 rounded ${
            activeSection === "completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Past Appointments
        </button>
      </div>

      {/* Display appointments based on active section */}
      {activeAppointments.length === 0 && (
        <p className="text-center text-lg text-gray-600">
          No {activeSection === "upcoming" ? "Upcoming" : "Past"} appointments
          to display!
        </p>
      )}
      <div className="space-y-6">
        {activeAppointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-200"
          >
            <div className="flex-shrink-0 mr-4">
              <Image
                src={patient?.profilePic || "/images/avatar-icon.png"}
                alt="Avatar"
                width={100}
                height={100}
                className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover"
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
                {new Date(
                  `1970-01-01T${appointment.slot.time}:00`
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
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
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-blue-200"
                  disabled={
                    appointment.isAppointmentRated ||
                    ratedAppointments.has(appointment._id)
                  }
                  onClick={() => openRatingModal(appointment._id)}
                >
                  Rate Appointment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

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
