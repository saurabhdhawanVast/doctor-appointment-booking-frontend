"use client"; // Mark this file as a Client Component

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Define types for the form data
interface AvailabilityFormData {
  doctorId: string;
  dates: string[];
  timePerSlot: number;
}

const Availability = ({ params }: { params: { doctorId: string } }) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [timePerSlot, setTimePerSlot] = useState<number>(30);
  const [movingDate, setMovingDate] = useState<Date | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false); // State for popup visibility

  const { doctorId } = params; // Extract doctorId from params
  const today = new Date(); // Get the current date

  useEffect(() => {
    // Reset movingDate when animation is done
    if (movingDate) {
      setTimeout(() => setMovingDate(null), 300); // Match duration of animation
    }
  }, [movingDate]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDates((prevDates) => {
        const isSelected = prevDates.some(
          (d) => d.toDateString() === date.toDateString()
        );
        if (isSelected) {
          return prevDates.filter(
            (d) => d.toDateString() !== date.toDateString()
          );
        } else {
          setMovingDate(date);
          return [...prevDates, date];
        }
      });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimePerSlot(Number(e.target.value)); // Convert to number
  };

  const handleSubmit = async () => {
    if (!doctorId) {
      console.error("Doctor ID is not available");
      return;
    }

    // Convert dates to ISO strings
    const formattedDates = selectedDates.map(
      (date) => date.toISOString().split("T")[0]
    );

    const availabilityData: AvailabilityFormData = {
      doctorId: doctorId,
      dates: formattedDates,
      timePerSlot,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/doctors/addAvailability`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(availabilityData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        setShowPopup(true); // Show the popup upon success
        // Optionally, you can reset form state here
      } else {
        const error = await response.text(); // Use text() to handle non-JSON responses
        console.error("Error:", error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between mt-20 gap-4">
      <div className="flex-1 p-4 border border-gray-300 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Set Your Availability</h2>
        <DatePicker
          selected={null}
          onChange={handleDateChange}
          inline
          shouldCloseOnSelect={false}
          minDate={today} // Disable past dates
          renderDayContents={(day, date) => {
            const isSelected = selectedDates.some(
              (d) => d.toDateString() === date.toDateString()
            );
            const isPastDate = date < today;
            return (
              <span
                className={`inline-block w-8 h-8 rounded-full text-center ${
                  isPastDate
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Style for past dates
                    : isSelected
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                {day}
              </span>
            );
          }}
        />
      </div>
      <div className="flex-1 p-4 border border-gray-300 rounded-lg shadow-lg relative">
        <h3 className="text-lg font-medium mb-2">Selected Dates</h3>
        <ul className="list-disc pl-5 mb-4">
          <AnimatePresence>
            {selectedDates.map((date) => (
              <motion.li
                key={date.toDateString()}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-1"
              >
                {date.toDateString()}
              </motion.li>
            ))}
            {movingDate && (
              <motion.div
                key={movingDate.toDateString()}
                className="absolute top-0 left-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 0, x: 300 }} // Adjust x value based on the right section position
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {movingDate.toDateString().slice(0, 3)}{" "}
                {/* Show only the first 3 characters */}
              </motion.div>
            )}
          </AnimatePresence>
        </ul>
        <div className="mb-4">
          <label className="mr-2">
            Time per Slot:
            <select
              value={timePerSlot}
              onChange={handleTimeChange}
              className="ml-2 border border-gray-300 rounded px-2 py-1"
            >
              <option value={15}>15 minutes</option>
              <option value={20}>20 minutes</option>
              <option value={30}>30 minutes</option>
            </select>
          </label>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 hover:shadow-lg transition-colors"
        >
          Mark Availability
        </button>
      </div>

      {/* Popup Box */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
              <h3 className="text-lg font-semibold mb-4">Success!</h3>
              <p>Your availability has been marked successfully.</p>
              <button
                onClick={() => setShowPopup(false)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Availability;
