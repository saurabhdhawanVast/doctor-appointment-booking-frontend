"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import useAppointmentStore from "@/store/useAppointmentStore";
import PrescriptionModal from "@/app/components/PrescriptionModal";

// Define a type for the Patient object
interface Patient {
  name: string;
  profilePic?: string;
  contactNumber?: string;
  email?: string;
  _id?: string;
  patientId?: string; // Ensure patientId is included
}

const AppointmentsPage = () => {
  const { doctorId } = useParams();

  const appointments = useAppointmentStore((state) => state.appointments);
  const filteredAppointments = useAppointmentStore(
    (state) => state.filteredAppointments
  );
  const fetchAppointments = useAppointmentStore(
    (state) => state.fetchAppointments
  );
  const fetchDoctorDetails = useAppointmentStore(
    (state) => state.fetchDoctorDetails
  );
  const doctorDetails = useAppointmentStore((state) => state.doctorDetails);
  const filterAppointmentsByDate = useAppointmentStore(
    (state) => state.filterAppointmentsByDate
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [appointmentsFetched, setAppointmentsFetched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [slotId, setSlotId] = useState<string>("");
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    if (typeof doctorId === "string") {
      setLoading(true);
      fetchAppointments(doctorId, new Date())
        .then(() => {
          setAppointmentsFetched(true);
        })
        .catch((err) => {
          setError("Failed to load appointments.");
        })
        .finally(() => {
          setLoading(false);
        });

      // Fetch doctor details
      fetchDoctorDetails(doctorId).catch((err) => {
        console.error("Failed to load doctor details:", err);
      });
    }
  }, [doctorId, fetchAppointments, fetchDoctorDetails]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      filterAppointmentsByDate(date);
    }
  };

  const handleAddPrescription = (
    patient: Patient,
    appointmentDate: string,
    slotId: string
  ) => {
    setCurrentPatient({
      ...patient,
      _id: patient.patientId, // Ensure patientId is properly mapped
    });
    setAppointmentDate(appointmentDate);
    setSlotId(slotId);
    setIsModalOpen(true);
  };

  const renderSlots = (slots: any) => {
    if (!slots || slots.length === 0) {
      return <p className="text-gray-500 ml-12">No slots available.</p>;
    }
    return slots.map((slot: any) => (
      <motion.div
        key={slot.slotId}
        className="flex items-center border-b border-gray-200 p-4 space-x-4 hover:bg-blue-100 transition duration-300 ease-in-out mb-4 ml-12"
        whileHover={{ scale: 1.04 }}
      >
        <div className="flex-shrink-0 w-1/4">
          <div className="text-lg font-medium">{slot.time}</div>
        </div>
        <div className="flex-1 space-y-1 pl-4">
          <div className="flex items-center space-x-5">
            <div className="w-12 h-12 flex-shrink-0">
              <img
                src={slot.patient?.profilePic || "/default-profile.png"}
                alt={slot.patient?.name || "Profile Picture"}
                className="w-full h-full object-cover rounded-full border border-gray-300"
              />
            </div>
            <div className="flex-1">
              <div className="text-lg font-medium">
                {slot.patient?.name || "No appointment"}
              </div>
              {slot.patient && (
                <div className="text-sm text-gray-500">
                  <div>{slot.patient?.contactNumber || "No contact info"}</div>
                  <div>{slot.patient?.email || "No email info"}</div>
                </div>
              )}
            </div>
          </div>
          {slot.patient && (
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                onClick={() => {
                  console.log("RselectedDate: ", selectedDate?.toISOString());
                  console.log("RappointmentDate: ", appointmentDate);
                  if (selectedDate) {
                    handleAddPrescription(
                      slot.patient,
                      selectedDate.toISOString(),
                      slot.slotId
                    );
                  } else {
                    // Handle case where selectedDate is null
                    console.error("Selected date is not set");
                  }
                }}
              >
                Prescribe
              </button>
            </div>
          )}
        </div>
      </motion.div>
    ));
  };

  const renderAppointmentDetails = (appointment: any) => {
    const formattedDate = new Date(appointment.date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

    return (
      <motion.div
        key={appointment.date}
        className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:bg-blue-50 hover:shadow-xl transition-all duration-300 ease-in-out ml-12"
        whileHover={{ scale: 1.05 }}
      >
        <h2 className="text-xl font-semibold mb-4 ml-12">{formattedDate}</h2>
        {renderSlots(appointment.appointmentsBooked)}
      </motion.div>
    );
  };

  return (
    <div className="p-8 mt-16">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <div className="flex space-x-8">
        <div className="flex-1 h-full overflow-y-auto overflow-x-hidden">
          {loading ? (
            <p>Loading appointments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : appointmentsFetched && filteredAppointments.length === 0 ? (
            selectedDate?.toDateString() === new Date().toDateString() ? (
              <p>No appointments found for today.</p>
            ) : (
              <p>No appointments found for the selected date.</p>
            )
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4 ml-14">Slots</h2>
              <div className="space-y-4">
                {filteredAppointments.map((appointment) =>
                  renderAppointmentDetails(appointment)
                )}
              </div>
            </div>
          )}
        </div>

        <motion.div
          className="w-64"
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h2 className="text-xl font-semibold mb-4">Pick a Date</h2>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            highlightDates={appointments.map(
              (appointment) => new Date(appointment.date)
            )}
            className="w-full bg-white shadow-lg rounded-lg p-4"
          />
        </motion.div>
      </div>

      <PrescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctorName={doctorDetails?.name || "Doctor"}
        patientName={currentPatient?.name || ""}
        patientId={currentPatient?._id ?? ""} // Ensure patientId is being passed correctly
        doctorId={doctorId as string}
        appointmentDate={appointmentDate} // Pass appointmentDate
        slotId={slotId} // Pass slotId
      />
    </div>
  );
};

export default AppointmentsPage;
