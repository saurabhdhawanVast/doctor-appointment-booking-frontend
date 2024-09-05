"use client";
import useLoginStore from "@/store/useLoginStore";
import { usePrescriptionStore } from "@/store/usePrescriptionStore";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import { format, startOfDay, endOfDay } from "date-fns";
import { toZonedTime, format as formatZoned } from "date-fns-tz";
import PrescriptionDetailsModal from "@/app/components/prescriptionDetailsModal";

const PatientPrescriptions = ({
  params,
}: {
  params: { patientId: string };
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State for selected date
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<any[]>([]); // State for filtered prescriptions
  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(
    null
  ); // State for selected prescription for modal
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility

  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage] = useState(10); // Number of items per page

  const prescriptions = usePrescriptionStore((state) => state.prescriptions);
  const fetchPrescriptionsByPatientAndDoctor = usePrescriptionStore(
    (state) => state.fetchPrescriptionsByPatientAndDoctor
  );

  const fetchPrescriptions = usePrescriptionStore(
    (state) => state.fetchPrescriptions
  );
  const doctor = useLoginStore((state) => state.doctor);
  const doctorId = doctor?._id;
  const { patientId } = params;
  const timeZone = "Asia/Kolkata";

  useEffect(() => {
    if (doctorId && patientId) {
      fetchPrescriptionsByPatientAndDoctor(patientId, doctorId)
        .then(() => console.log("Prescriptions fetched successfully"))
        .catch((error) =>
          console.error("Error fetching prescriptions:", error)
        );
    }
  }, [doctorId, patientId, fetchPrescriptionsByPatientAndDoctor]);

  useEffect(() => {
    // Filter prescriptions based on the selected date
    if (selectedDate) {
      const startOfSelectedDate = startOfDay(selectedDate);
      const endOfSelectedDate = endOfDay(selectedDate);

      const filtered = prescriptions.filter((prescription) => {
        const appointmentDate = new Date(prescription.appointmentDate);

        // Check if appointmentDate is a valid date
        if (isNaN(appointmentDate.getTime())) {
          console.error(
            "Invalid appointment date:",
            prescription.appointmentDate
          );
          return false;
        }

        const zonedAppointmentDate = toZonedTime(appointmentDate, timeZone);
        return (
          zonedAppointmentDate >= startOfSelectedDate &&
          zonedAppointmentDate <= endOfSelectedDate
        );
      });
      setFilteredPrescriptions(filtered);
    } else {
      // If no date selected, show all prescriptions
      setFilteredPrescriptions(prescriptions);
    }
  }, [selectedDate, prescriptions]);

  // Paginate the filtered prescriptions
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPrescriptions = filteredPrescriptions.slice(
    indexOfFirst,
    indexOfLast
  );

  // Calculate the number of pages
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);

  const handleOpenModal = (prescription: any) => {
    setSelectedPrescription(prescription);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <div className="mt-16 p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Patient Prescriptions</h2>

        {/* Date Picker */}
        <div className="w-64">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Select a date"
            className="p-2 border rounded-lg w-full"
          />
        </div>
      </div>

      <ul>
        {currentPrescriptions.length > 0 ? (
          currentPrescriptions.map((prescription) => {
            // Ensure appointmentDate is a valid date
            const appointmentDate = new Date(prescription.appointmentDate);
            if (isNaN(appointmentDate.getTime())) {
              return null; // Skip invalid dates
            }

            const formattedDate = formatZoned(
              appointmentDate,
              "yyyy-MM-dd HH:mm:ss",
              { timeZone }
            );

            return (
              <li
                key={prescription._id}
                className="mb-2 p-4 bg-gray-100 rounded-lg"
              >
                <p>Patient Name: {prescription.patientName}</p>
                <p>Doctor Name: {prescription.doctorName}</p>
                <p>Date: {formattedDate}</p>
                <button
                  className="mt-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                  onClick={() => handleOpenModal(prescription)}
                >
                  View Details
                </button>
              </li>
            );
          })
        ) : (
          <p>No prescriptions found for the selected date.</p>
        )}
      </ul>

      {/* Pagination Controls */}
      {filteredPrescriptions.length > itemsPerPage && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-teal-600 text-white rounded transition duration-300 mr-2"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 bg-teal-600 text-white rounded transition duration-300 ml-2"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {selectedPrescription && (
        <PrescriptionDetailsModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          doctorName={selectedPrescription.doctorName}
          patientName={selectedPrescription.patientName}
          appointmentDate={selectedPrescription.appointmentDate}
          note={selectedPrescription.note}
          medicines={selectedPrescription.medicines}
        />
      )}
    </div>
  );
};

export default PatientPrescriptions;
