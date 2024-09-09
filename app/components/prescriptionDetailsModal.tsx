import React from "react";
import { motion } from "framer-motion";

interface PrescriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  patientName: string;
  appointmentDate: string;
  note: string;
  medicines: {
    name: string;
    dosage: string[];
    time: string;
    days: number;
  }[];
}

const PrescriptionDetailsModal = ({
  isOpen,
  onClose,
  doctorName,
  patientName,
  appointmentDate,
  note,
  medicines,
}: PrescriptionDetailsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl h-[70vh] overflow-auto relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Prescription Details</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            &#x2715;
          </button>
        </div>

        <div className="mb-4">
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Doctor: {doctorName}</h3>
            <p className="text-sm text-gray-600">Patient: {patientName}</p>
            <p className="text-sm text-gray-600">
            {new Date(appointmentDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
            </p>
          </div>
        </div>

        {medicines.length > 0 ? (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Medicines</h3>
            <div className="grid grid-cols-4 gap-4 bg-gray-200 p-2 rounded-lg">
              <div className="font-semibold">Medicine Name</div>
              <div className="font-semibold">Dosage</div>
              <div className="font-semibold">Time</div>
              <div className="font-semibold">Days</div>
            </div>
            {medicines.map((medicine, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-2">
                <div>{medicine.name}</div>
                <div>
                  {medicine.dosage
                    .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
                    .join(", ")}
                </div>
                <div>{medicine.time}</div>
                <div>{medicine.days}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No medicines listed.</p>
        )}

        {note && (
          <div className="bg-gray-200 p-4 rounded-lg mt-4">
            <h4 className="text-md font-semibold">Notes:</h4>
            <p>{note}</p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrescriptionDetailsModal;
