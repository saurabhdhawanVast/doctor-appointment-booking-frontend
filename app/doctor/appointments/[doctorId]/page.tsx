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
}

const AppointmentsPage = () => {
  const { doctorId } = useParams();

  // Access store values and actions using selectors
  const appointments = useAppointmentStore((state) => state.appointments);
  const filteredAppointments = useAppointmentStore(
    (state) => state.filteredAppointments
  );
  const fetchAppointments = useAppointmentStore(
    (state) => state.fetchAppointments
  );
  const filterAppointmentsByDate = useAppointmentStore(
    (state) => state.filterAppointmentsByDate
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [appointmentsFetched, setAppointmentsFetched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null); // State to hold the current patient info

  // Fetch appointments when the component mounts
  useEffect(() => {
    if (typeof doctorId === "string") {
      fetchAppointments(doctorId, new Date()).then(() => {
        setAppointmentsFetched(true);
      });
    }
  }, [doctorId, fetchAppointments]);

  // Handle date change in DatePicker
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      filterAppointmentsByDate(date);
    }
  };

  // Function to render slots
  const renderSlots = (slots: any) => {
    return slots.map((slot: any) => (
      <motion.div
        key={slot.slotId}
        className="flex items-center border-b border-gray-200 p-4 space-x-4 hover:bg-blue-100 transition duration-300 ease-in-out mb-4 ml-12"
        whileHover={{ scale: 1.04 }}
      >
        {/* Slot Timing on the Left */}
        <div className="flex-shrink-0 w-1/4">
          <div className="text-lg font-medium">{slot.time}</div>
        </div>

        {/* Patient Information on the Right */}
        <div className="flex-1 space-y-1 pl-4">
          <div className="flex items-center space-x-5">
            {/* Profile Picture */}
            <div className="w-12 h-12 flex-shrink-0">
              <img
                src={slot.patient?.profilePic || "/default-profile.png"}
                alt={slot.patient?.name || "Profile Picture"}
                className="w-full h-full object-cover rounded-full border border-gray-300"
              />
            </div>

            {/* Patient Details */}
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
          {/* Add Prescription Button */}
          {slot.patient && (
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                onClick={() => handleAddPrescription(slot.patient)}
              >
                Add Prescription
              </button>
            </div>
          )}
        </div>
      </motion.div>
    ));
  };

  // Function to handle the "Add Prescription" button click
  const handleAddPrescription = (patient: Patient) => {
    setCurrentPatient(patient); // Set the current patient
    setIsModalOpen(true); // Open the modal
  };

  // Function to render appointment details
  const renderAppointmentDetails = (appointment: any) => {
    // Format the appointment date as "day-month-year"
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

      {/* Flex container to hold DatePicker and Appointments */}
      <div className="flex space-x-8">
        {/* Appointments Details */}
        <div className="flex-1 h-full overflow-y-auto overflow-x-hidden">
          {/* Display a message if no appointments are available for today */}
          {appointmentsFetched && filteredAppointments.length === 0 ? (
            <p>No appointments found for today.</p>
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

        {/* DatePicker with Framer Motion Hover Animation */}
        <motion.div
          className="w-64"
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h2 className="text-xl font-semibold mb-4 ">Pick a Date</h2>
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

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctorName="Dr. John Doe" // Replace with actual doctor name
        patientName={currentPatient?.name || ""}
      />
    </div>
  );
};

export default AppointmentsPage;
