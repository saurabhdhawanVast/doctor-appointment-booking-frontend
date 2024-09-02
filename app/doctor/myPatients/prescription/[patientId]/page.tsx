// "use client";
// import useLoginStore from "@/store/useLoginStore";
// import { usePrescriptionStore } from "@/store/usePrescriptionStore";
// import React, { useEffect } from "react";

// const PatientPrescriptions = ({
//   params,
// }: {
//   params: { patientId: string };
// }) => {
//   const prescriptions = usePrescriptionStore((state) => state.prescriptions);
//   const fetchPrescriptions = usePrescriptionStore(
//     (state) => state.fetchPrescriptions
//   );
//   const doctor = useLoginStore((state) => state.doctor);
//   const doctorId = doctor?._id;
//   const { patientId } = params;

//   useEffect(() => {
//     if (doctorId && patientId) {
//       fetchPrescriptions(patientId)
//         .then(() => console.log("Prescriptions fetched successfully"))
//         .catch((error) =>
//           console.error("Error fetching prescriptions:", error)
//         );
//     }
//   }, [doctorId, patientId, fetchPrescriptions]);

//   return (
//     <div className="mt-16 p-8">
//       <h2 className="text-2xl font-bold mb-4">Patient Prescriptions</h2>
//       <ul>
//         {prescriptions.length > 0 ? (
//           prescriptions.map((prescription) => (
//             <li
//               key={prescription._id}
//               className="mb-2 p-4 bg-gray-100 rounded-lg"
//             >
//               <p>Patient Name: {prescription.patientName}</p>
//               <p>Doctor Name: {prescription.doctorName}</p>

//               <p>Date: {prescription.appointmentDate}</p>
//               {/* Add more fields as needed */}
//             </li>
//           ))
//         ) : (
//           <p>No prescriptions found for this patient.</p>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default PatientPrescriptions;

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

  const prescriptions = usePrescriptionStore((state) => state.prescriptions);
  const fetchPrescriptions = usePrescriptionStore(
    (state) => state.fetchPrescriptions
  );
  const doctor = useLoginStore((state) => state.doctor);
  const doctorId = doctor?._id;
  const { patientId } = params;
  const timeZone = "Asia/Kolkata";

  useEffect(() => {
    if (doctorId && patientId) {
      fetchPrescriptions(patientId)
        .then(() => console.log("Prescriptions fetched successfully"))
        .catch((error) =>
          console.error("Error fetching prescriptions:", error)
        );
    }
  }, [doctorId, patientId, fetchPrescriptions]);

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
      <h2 className="text-2xl font-bold mb-4">Patient Prescriptions</h2>

      {/* Date Picker */}
      <div className="mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          placeholderText="Select a date"
          className="p-2 border rounded-lg w-full"
        />
      </div>

      <ul>
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((prescription) => {
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
