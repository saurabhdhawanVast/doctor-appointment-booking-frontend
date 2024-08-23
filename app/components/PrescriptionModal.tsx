import { motion } from "framer-motion";
import { useState } from "react";

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  patientName: string;
}

const PrescriptionModal = ({
  isOpen,
  onClose,
  doctorName,
  patientName,
}: PrescriptionModalProps) => {
  const [medicines, setMedicines] = useState<
    { name: string; dosage: string[]; time: string; days: number }[]
  >([{ name: "", dosage: [], time: "", days: 1 }]);

  const [note, setNote] = useState<string>("");

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[70vh] overflow-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Add Prescription</h2>
          <button
            className="text-gray-500 hover:text-gray-800 "
            onClick={onClose}
          >
            &#x2715;
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">{doctorName}</h3>
          <p className="text-sm text-gray-600">Doctor</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">{patientName}</h3>
          <p className="text-sm text-gray-600">Patient</p>
        </div>

        <div>
          {medicines.map((medicine, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mb-4 relative">
              <button
                type="button"
                className="absolute top-0 right-0  mr-2 text-red-500 hover:text-red-700 "
                onClick={() => removeMedicine(index)}
              >
                &#x2715;
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-700">
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dosage
                </label>
                <div className="flex flex-col space-y-2">
                  {["Morning", "Afternoon", "Night"].map((time) => (
                    <div key={time} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${time}-${index}`}
                        checked={medicine.dosage.includes(time.toLowerCase())}
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <div className="flex flex-col space-y-2">
                  {["Before Meal", "After Meal"].map((time) => (
                    <div key={time} className="flex items-center">
                      <input
                        type="radio"
                        id={`${time}-${index}`}
                        checked={medicine.time === time.toLowerCase()}
                        onChange={() =>
                          handleTimeChange(index, time.toLowerCase())
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Days
                </label>
                <input
                  type="number"
                  value={medicine.days}
                  onChange={(e) =>
                    handleMedicineChange(
                      index,
                      "days",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          ))}

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
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

        <div className="mt-6 mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            rows={4}
          />
        </div>

        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            onClick={onClose}
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrescriptionModal;
