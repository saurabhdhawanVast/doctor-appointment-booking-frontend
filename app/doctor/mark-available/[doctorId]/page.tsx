"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import useManageScheduleStore from "@/store/useManageScheduleStore";
import "react-datepicker/dist/react-datepicker.css";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns-tz";
import { toast } from "react-toastify";

const DoctorSchedulePage: React.FC<{ params: { doctorId: string } }> = ({
  params,
}) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [slotToCancel, setSlotToCancel] = useState<string | null>(null);
  const [showCancelAllConfirmation, setShowCancelAllConfirmation] =
    useState<boolean>(false);
  const [showMarkAvailable, setShowMarkAvailable] = useState<boolean>(false);
  const [timePerSlot, setTimePerSlot] = useState<number>(15);
  const today = new Date(); // Get the current date
  const timeZone = "Asia/Kolkata"; // IST timezone
  const {
    availableDates,
    fetchAvailableDates,
    toggleAvailableDate,
    cancelSlot,
    cancelAllSlots,
    addAvailability,
    loading,
    error,
  } = useManageScheduleStore((state) => ({
    availableDates: state.availableDates,
    fetchAvailableDates: state.fetchAvailableDates,
    toggleAvailableDate: state.toggleAvailableDate,
    cancelSlot: state.cancelSlot,
    cancelAllSlots: state.cancelAllSlots,
    addAvailability: state.addAvailability,
    loading: state.loading,
    error: state.error,
  }));

  useEffect(() => {
    if (params.doctorId) {
      fetchAvailableDates(params.doctorId);
    }
  }, [params.doctorId, fetchAvailableDates]);

  useEffect(() => {
    if (selectedDates.length > 0) {
      const latestDate = selectedDates[selectedDates.length - 1];
      const formattedDate = formatDateInTimeZone(latestDate, timeZone);
      const dateObj = availableDates.find(
        (avail) =>
          formatDateInTimeZone(new Date(avail.date), timeZone) === formattedDate
      );
      const allSlots = dateObj?.slots || [];
      setSlots(allSlots);
    } else {
      setSlots([]);
    }
  }, [selectedDates, availableDates]);

  const formatDateInTimeZone = (date: Date, timeZone: string) => {
    return format(date, "yyyy-MM-dd", { timeZone });
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = formatDateInTimeZone(date, timeZone);
      const isDateAvailable = availableDates.some(
        (avail) =>
          formatDateInTimeZone(new Date(avail.date), timeZone) === formattedDate
      );

      if (isDateAvailable) {
        // Clear previously selected dates if selecting an available date
        setSelectedDates([date]);
        setShowMarkAvailable(false);
      } else {
        setSelectedDates((prevDates) => {
          const alreadySelected = prevDates.some(
            (d) => formatDateInTimeZone(d, timeZone) === formattedDate
          );

          // Check if any previously selected date is an available date
          const updatedDates = prevDates.filter(
            (d) =>
              formatDateInTimeZone(d, timeZone) !== formattedDate &&
              !availableDates.some(
                (avail) =>
                  formatDateInTimeZone(new Date(avail.date), timeZone) ===
                  formatDateInTimeZone(d, timeZone)
              )
          );

          if (!alreadySelected) {
            return [...updatedDates, date];
          }
          return updatedDates;
        });
        setShowMarkAvailable(true);
      }
    }
  };

  const handleCancelSlot = (slotId: string) => {
    setSlotToCancel(slotId);
    setShowConfirmation(true);
  };

  const confirmCancelSlot = async () => {
    if (slotToCancel && selectedDates.length > 0) {
      try {
        // Perform the API call to cancel the slot
        await cancelSlot(params.doctorId, selectedDates[0], slotToCancel);

        // If successful, update the local state to reflect the canceled slot
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot.id === slotToCancel ? { ...slot, status: "canceled" } : slot
          )
        );
      } catch (error) {
        console.error("Failed to cancel slot:", error);
      } finally {
        // Close the confirmation dialog
        setShowConfirmation(false);
        setSlotToCancel(null);
      }
    }
  };

  const handleCancelAllSlots = () => {
    if (selectedDates.length > 0) {
      setShowCancelAllConfirmation(true);
    }
  };

  const confirmCancelAllSlots = async () => {
    try {
      if (selectedDates.length > 0) {
        await cancelAllSlots(params.doctorId, selectedDates[0]);
        setSlots([]);
      }
    } catch (error) {
      console.error("Failed to cancel all slots:", error);
    } finally {
      setShowCancelAllConfirmation(false);
    }
  };

  const handleMarkAvailable = async () => {
    if (selectedDates.length > 0) {
      try {
        const formattedDates = selectedDates.map((date) =>
          formatDateInTimeZone(date, timeZone)
        );

        await addAvailability(params.doctorId, formattedDates, timePerSlot);
        setSelectedDates([]); // Clear selection after marking
        toast.success("Dates marked as available successfully");
        setShowMarkAvailable(false); // Hide the mark available section
      } catch (error) {
        console.error("Failed to mark dates as available:", error);
      }
    } else {
      toast.error("No dates selected.");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimePerSlot(Number(e.target.value));
  };

  const handleDeselectDate = (date: Date) => {
    setSelectedDates((prevDates) =>
      prevDates.filter(
        (d) =>
          formatDateInTimeZone(d, timeZone) !==
          formatDateInTimeZone(date, timeZone)
      )
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const isDateAvailable = (date: Date) => {
    const formattedDate = formatDateInTimeZone(date, timeZone);
    return availableDates.some(
      (avail) =>
        formatDateInTimeZone(new Date(avail.date), timeZone) === formattedDate
    );
  };

  const renderSelectedDates = () => (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium mb-2">Selected Dates</h3>
      <ul>
        {selectedDates.map((date, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 border-b last:border-b-0"
          >
            <span>{formatDateInTimeZone(date, timeZone)}</span>
            <button
              className="text-red-500"
              onClick={() => handleDeselectDate(date)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18l12-12M6 6l12 12"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderSlotManagement = () => (
    <div className="w-full p-4">
      {selectedDates.length === 0 ? (
        <p>No dates selected.</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Manage Slots for Date{" "}
            {formatDateInTimeZone(selectedDates[0], timeZone)}
          </h2>
          <button
            className="bg-red-500 text-white px-4 py-2 mb-4 rounded"
            onClick={handleCancelAllSlots}
          >
            Cancel All Slots
          </button>
          <div>
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="border p-4 my-2 flex justify-between items-center hover:bg-gray-100 transition duration-200"
              >
                <div>
                  <p className="font-medium">Time: {slot.time}</p>
                  <p>Status: {slot.status}</p>
                </div>
                {slot.status === "available" && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => handleCancelSlot(slot.id)}
                  >
                    Cancel Slot
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row mt-16">
      <div className="w-full lg:w-1/4 border-r p-4">
        <h2 className="text-xl font-semibold mb-4">Calendar</h2>
        <DatePicker
          selected={null} // Keep this null as we handle multiple dates
          onChange={handleDateChange}
          inline
          minDate={today} // Disable past dates
          highlightDates={selectedDates}
          dayClassName={(date) =>
            isDateAvailable(date) ? "bg-green-400 text-white" : "bg-white"
          }
        />
      </div>
      <div className="w-full lg:w-3/4 p-4">
        {showMarkAvailable ? (
          <div className="flex-1 p-4 border border-gray-300 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium mb-2">
              Mark Dates as Available
            </h3>
            {renderSelectedDates()}
            <button
              onClick={handleMarkAvailable}
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
            >
              Mark as Available
            </button>
          </div>
        ) : (
          renderSlotManagement()
        )}
        {showConfirmation && (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Confirm Cancellation
                </h3>
                <p>Are you sure you want to cancel this slot?</p>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={confirmCancelSlot}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
        {showCancelAllConfirmation && (
          <AnimatePresence>
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h3 className="text-lg font-semibold mb-4">
                  Confirm Cancel All
                </h3>
                <p>Are you sure you want to cancel all slots for this date?</p>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                    onClick={() => setShowCancelAllConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={confirmCancelAllSlots}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedulePage;
