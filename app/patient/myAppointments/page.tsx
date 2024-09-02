"use client";
import React, { useEffect } from "react";
import useAppointmentStore from "@/store/useAppointmentStore";
import useLoginStore from "@/store/useLoginStore";
import Image from "next/image";

const MyAppointmentsList = () => {
  const upcomingAppointments = useAppointmentStore(
    (state) => state.upcomingAppointments
  );
  const getAppointments = useAppointmentStore((state) => state.getAppointments);
  const patient = useLoginStore((state) => state.patient);

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
  return (
    <div className="mt-16 p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Upcoming Appointments
      </h2>
      <div>
        {upcomingAppointments.length === 0 && (
          <p className="text-center">No Upcoming appointments to display!</p>
        )}
      </div>
      <div className="space-y-4">
        {upcomingAppointments.length > 0 &&
          upcomingAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between items-center"
            >
              <div>
                <Image
                  src={
                    patient && patient.profilePic
                      ? patient.profilePic
                      : "/images/avatar-icon.png"
                  }
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="rounded-full border-2 border-white"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">
                  {appointment.doctor.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Speciality: {appointment.doctor.speciality}
                </p>
                <p className="text-sm text-gray-600">
                  Clinic: {appointment.doctor.clinicDetails.clinicName}
                </p>
                <p className="text-sm text-gray-600">
                  Address: {appointment.doctor.clinicDetails.clinicAddress},{" "}
                  {appointment.doctor.clinicDetails.city},{" "}
                  {appointment.doctor.clinicDetails.state}
                </p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6">
                <p className="text-sm text-gray-500">
                  Appointment Date:{" "}
                  <span className="font-semibold">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Time:{" "}
                  <span className="font-semibold">{appointment.slot.time}</span>
                </p>
                <p
                  className={`text-sm ${
                    appointment.status !== "accepted"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  Status: {appointment.status}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyAppointmentsList;
