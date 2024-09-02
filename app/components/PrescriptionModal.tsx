import { usePrescriptionStore } from "@/store/usePrescriptionStore";
import { motion } from "framer-motion";
import { useState } from "react";
import React from "react";
import SuccessToast from "./successToast";
import { toast } from "react-toastify";

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  patientName: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  slotId: string;
}

const PrescriptionModal = ({
  isOpen,
  onClose,
  doctorName,
  patientName,
  patientId,
  doctorId,
  appointmentDate,
  slotId,
}: PrescriptionModalProps) => {
  const [medicines, setMedicines] = useState<
    { name: string; dosage: string[]; time: string; days: number }[]
  >([{ name: "", dosage: [], time: "", days: 1 }]);

  const [note, setNote] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { savePrescription } = usePrescriptionStore();

  const handleMedicineChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
    setMedicines(updatedMedicines);
  };

  const handleDosageChange = (index: number, dosage: string) => {
    const updatedMedicines = [...medicines];
    const currentDosage = updatedMedicines[index].dosage;
    if (currentDosage.includes(dosage)) {
      updatedMedicines[index].dosage = currentDosage.filter(
        (d) => d !== dosage
      );
    } else {
      updatedMedicines[index].dosage = [...currentDosage, dosage];
    }
    setMedicines(updatedMedicines);
  };

  const handleTimeChange = (index: number, time: string) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index].time = time;
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: [], time: "", days: 1 }]);
  };

  const removeMedicine = (index: number) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const handleSave = () => {
    setIsConfirming(true);
  };

  const handleEdit = () => {
    setIsConfirming(false);
  };

  const handleConfirm = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      await savePrescription({
        patientId,
        doctorId,
        doctorName,
        patientName,
        note,
        medicines,
        appointmentDate,
        slotId,
      });
      toast.success("Prescription saved successfully");
      onClose();
    } catch (err) {
      toast.error("Error saving prescription");
    }
  };

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
          <h2 className="text-xl font-bold">
            {isConfirming ? "Confirm Prescription" : "Add Prescription"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            &#x2715;
          </button>
        </div>

        {isConfirming ? (
          <div>
            <div className="flex space-x-4  mb-2">
              <div className=" bg-gray-200 p-4 rounded-lg w-full">
                <h3 className="text-lg font-semibold">{doctorName}</h3>
                <p className="text-sm text-gray-600">Doctor</p>
              </div>

              <div className=" mr-4 bg-gray-200 p-4 rounded-lg w-full">
                <h3 className="text-lg font-semibold">{patientName}</h3>
                <p className="text-sm text-gray-600">Patient</p>
              </div>
            </div>

            <div className="flex flex-row flex-wrap mb-2 ">
              {medicines.map((medicine, index) => (
                <div
                  key={index}
                  className="flex flex-row w-full space-x-2  bg-gray-200 rounded-lg"
                >
                  <div className="p-2 rounded-lg w-1/4 ">
                    <div className="font-bold">Medicine Name</div>
                    {medicine.name}
                  </div>
                  <div className=" p-2 rounded-lg w-1/4">
                    <div className="font-bold">Dosage</div>
                    {medicine.dosage.join(", ")}
                  </div>
                  <div className="p-2 rounded-lg w-1/4">
                    <div className="font-bold">Time</div>
                    {medicine.time}
                  </div>
                  <div className=" p-2 rounded-lg w-1/4">
                    <div className="font-bold">Days</div>
                    {medicine.days}
                  </div>
                </div>
              ))}
            </div>
            <div>
              {note && (
                <div className=" w-full  space-x-2 p-2 mb-2 bg-gray-200 rounded-lg ">
                  <div>
                    <h4 className="text-md font-semibold">Notes:</h4>
                    <textarea
                      name="note"
                      id="note"
                      value={note}
                      className="w-full border border-gray-300 rounded p-2 focus:border-teal-500 focus:ring-teal-500"
                      readOnly
                    ></textarea>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-teal-600 text-white rounded transition duration-300"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex space-x-4 ">
              <div className="mb-4  bg-gray-200 p-4 rounded-lg w-full">
                <h3 className="text-lg font-semibold">{doctorName}</h3>
                <p className="text-sm text-gray-600">Doctor</p>
              </div>

              <div className="mb-4 mr-4 bg-gray-200 p-4 rounded-lg w-full">
                <h3 className="text-lg font-semibold">{patientName}</h3>
                <p className="text-sm text-gray-600">Patient</p>
              </div>
            </div>

            <div>
              {medicines.map((medicine, index) => (
                <div
                  key={index}
                  // className="flex  gap-4 mb-4 relative bg-gray-200 p-4 rounded-lg"
                  className="flex flex-col p-2 mb-4 md:flex-row space-y-4 md:space-y-0 md:space-x-4 relative  bg-gray-200 rounded-lg w-full "
                >
                  <button
                    type="button"
                    className="absolute top-0 right-0 mr-2 text-red-500 hover:text-red-700"
                    onClick={() => removeMedicine(index)}
                  >
                    &#x2715;
                  </button>

                  <div className=" w-1/4">
                    <label className="block text-sm font-medium text-gray-700 ">
                      Medicine Name
                    </label>
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) =>
                        handleMedicineChange(index, "name", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="w-1/4">
                    <label className="block text-sm font-medium text-gray-700">
                      Dosage
                    </label>
                    <div className="flex flex-col space-y-2">
                      {["Morning", "Afternoon", "Night"].map((time) => (
                        <div key={time} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${time}-${index}`}
                            checked={medicine.dosage.includes(
                              time.toLowerCase()
                            )}
                            onChange={() =>
                              handleDosageChange(index, time.toLowerCase())
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor={`${time}-${index}`}
                            className="text-sm font-medium text-gray-700"
                          >
                            {time}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className=" w-1/4">
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <div className="flex flex-col space-y-2">
                      {["Before Meal", "After Meal"].map((time) => (
                        <div key={time} className="flex items-center">
                          <input
                            type="radio"
                            name={`time-${index}`}
                            id={`${time}-${index}`}
                            value={time}
                            checked={medicine.time === time}
                            onChange={() => handleTimeChange(index, time)}
                            className="mr-2"
                          />
                          <label
                            htmlFor={`${time}-${index}`}
                            className="text-sm font-medium text-gray-700"
                          >
                            {time}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className=" w-1/4">
                    <label className="block text-sm font-medium text-gray-700">
                      Days
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={medicine.days}
                      onChange={(e) =>
                        handleMedicineChange(
                          index,
                          "days",
                          Number(e.target.value)
                        )
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                onClick={addMedicine}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-6">
              <label
                htmlFor="note"
                className="block text-sm font-medium text-gray-700"
              >
                Additional Notes
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {error && <p className="mt-4 text-red-500">{error}</p>}

            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                onClick={handleSave}
              >
                Save Prescription
              </button>
            </div>
          </div>
        )}
      </motion.div>
      {/* Render the Toast if there's a success message */}
    </div>
  );
};

export default PrescriptionModal;
