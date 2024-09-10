"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, toZonedTime } from "date-fns-tz";

import useDoctorStore from "@/store/useDoctorStoree";
import { useSearchParams } from "next/navigation";
import useBookAppointmentStore from "@/store/useBookAppointmentStore";
import { AnimatePresence, motion } from "framer-motion";

const timeZone = "Asia/Kolkata"; // Set your preferred time zone

const BookAppointmentPage = () => {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const patientId = searchParams.get("patientId");

  const { doctor, availableDates, fetchDoctorProfile, fetchAvailableDates } =
    useDoctorStore((state) => ({
      doctor: state.doctor,
      availableDates: state.availableDates,
      fetchDoctorProfile: state.fetchDoctorProfile,
      fetchAvailableDates: state.fetchAvailableDates,
    }));

  const {
    selectedSlotId,
    showModal,
    bookingError,
    bookingSuccess,
    setSelectedSlotId,
    setShowModal,
    setBookingError,
    setBookingSuccess,
    bookSlot,
  } = useBookAppointmentStore((state) => ({
    selectedSlotId: state.selectedSlotId,
    showModal: state.showModal,
    bookingError: state.bookingError,
    bookingSuccess: state.bookingSuccess,
    setSelectedSlotId: state.setSelectedSlotId,
    setShowModal: state.setShowModal,
    setBookingError: state.setBookingError,
    setBookingSuccess: state.setBookingSuccess,
    bookSlot: state.bookSlot,
  }));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [slots, setSlots] = useState<any[]>([]);

  useEffect(() => {
    if (doctorId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          await fetchDoctorProfile(doctorId);
          await fetchAvailableDates(doctorId);
        } catch (err) {
          setError("Failed to fetch doctor details.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [doctorId, fetchDoctorProfile, fetchAvailableDates]);

  useEffect(() => {
    if (selectedDate) {
      const normalizedSelectedDate = fomattedDate(selectedDate);
      const dateString = format(
        toZonedTime(normalizedSelectedDate, timeZone),
        "yyyy-MM-dd",
        { timeZone }
      );
      console.log(`Date Selected is ${dateString}`);
      const dateSlots = availableDates.find(
        ({ date }) =>
          format(toZonedTime(date, timeZone), "yyyy-MM-dd", { timeZone }) ===
          dateString
      );
      setSlots(dateSlots?.slots || []);
    } else {
      setSlots([]);
    }
  }, [selectedDate, availableDates]);

  useEffect(() => {
    if (bookingSuccess) {
      const timer = setTimeout(() => {
        setBookingSuccess(null); // Clear success message after 5 seconds
      }, 3000);

      // Cleanup function to clear the timer if the component unmounts or success message changes
      return () => clearTimeout(timer);
    }
  }, [bookingSuccess, setBookingSuccess]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date ? fomattedDate(date) : null);
  };
  const fomattedDate = (date: Date): any => {
    const dateString = format(toZonedTime(date, timeZone), "yyyy-MM-dd", {
      timeZone,
    });
    return dateString;
  };

  const isDateAvailable = (date: Date) => {
    const dateString = format(toZonedTime(date, timeZone), "yyyy-MM-dd", {
      timeZone,
    });
    return availableDates.some(
      ({ date: availableDate }) =>
        format(toZonedTime(availableDate, timeZone), "yyyy-MM-dd", {
          timeZone,
        }) === dateString
    );
  };

  const highlightDates = (date: Date) => {
    return isDateAvailable(date)
      ? "bg-green-500 text-white"
      : "bg-[#f55d5d] text-black";
  };

  const handleBookSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
    setShowModal(true);
  };

  const confirmBooking = async () => {
    if (selectedSlotId && doctorId && patientId && selectedDate) {
      try {
        await bookSlot(doctorId, patientId, selectedSlotId, selectedDate);
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot.id === selectedSlotId ? { ...slot, status: "booked" } : slot
          )
        );
        setBookingSuccess("Slot booked successfully!");
        setBookingError(null);
      } catch (err) {
        setBookingError("Failed to book slot.");
        console.error(err);
      } finally {
        setShowModal(false);
      }
    } else {
      if (!selectedSlotId) setBookingError("No slot selected.");
      if (!doctorId) setBookingError("No doctor selected.");
      if (!patientId) setBookingError("No patient selected.");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading doctor profile...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!doctor) {
    return <p className="text-center text-gray-500">No doctor found.</p>;
  }

  const formatTime = (time: string): string => {
    const [hourString, minute] = time.split(":");
    let hour = parseInt(hourString, 10);
    const isPM = hour >= 12;

    if (hour > 12) {
      hour -= 12;
    } else if (hour === 0) {
      hour = 12;
    }

    return `${hour}:${minute} ${isPM ? "PM" : "AM"}`;
  };

  return (
    <div className="mx-auto p-8 bg-gray-50 rounded-lg shadow-lg mt-16 w-full">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Book Appointment with Dr. {doctor.name}
      </h1>

      <div className="flex items-center space-x-6 mb-6">
        <img
          src={doctor.profilePic}
          alt={`Dr. ${doctor.name}`}
          className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow-md"
        />
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Doctor Profile
          </h2>
          <p>
            <strong className="font-medium text-gray-600">Name:</strong> Dr.{" "}
            {doctor.name}
          </p>
          <p>
            <strong className="font-medium text-gray-600">Speciality:</strong>{" "}
            {doctor.speciality}
          </p>
          <p>
            <strong className="font-medium text-gray-600">
              Qualification:
            </strong>{" "}
            {doctor.qualification}
          </p>
          <p>
            <strong className="font-medium text-gray-600">
              Clinic Address:
            </strong>{" "}
            {doctor.clinicDetails?.clinicAddress}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Select Date
          </h2>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            calendarClassName="react-datepicker-calendar"
            dayClassName={(date) => highlightDates(date)}
            className="border border-gray-300 rounded-lg shadow-sm p-2 w-full"
            placeholderText="Select a date"
            dateFormat="d MMM yyyy"
            minDate={new Date()} // Optional: to prevent selecting past dates
          />
          <div className="flex space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-400"></div>
              <span className="text-gray-700">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#f55d5d]"></div>
              <span className="text-gray-700">Not Available</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 h-80 overflow-y-auto">
          {selectedDate && (
            <>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Available Slots for{" "}
                {format(toZonedTime(selectedDate, timeZone), "d MMM yyyy", {
                  timeZone,
                })}
              </h2>
              <ul className="space-y-4">
                {slots.length > 0 ? (
                  slots.map((slot) => (
                    <li
                      key={slot.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-medium text-gray-800">
                          {formatTime(slot.time)}
                        </span>
                        <span
                          className={`font-semibold ${
                            slot.status === "available"
                              ? "text-green-600"
                              : slot.status === "booked"
                              ? "text-gray-500"
                              : "text-red-500"
                          }`}
                        >
                          {slot.status === "available"
                            ? "Available"
                            : slot.status === "booked"
                            ? "Booked"
                            : "Unavailable"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleBookSlot(slot.id)}
                        disabled={slot.status !== "available"}
                        className={`py-2 px-4 rounded-md text-white font-semibold ${
                          slot.status === "available"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {slot.status === "available"
                          ? "Book Now"
                          : "Unavailable"}
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No available slots on this date.
                  </p>
                )}
              </ul>
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Confirm Booking
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to book this slot?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {bookingSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="flex items-center bg-green-500 text-white text-sm font-bold px-4 py-3 rounded-md space-x-2">
            <svg
              className="fill-current w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm0 18.18A8.18 8.18 0 1 1 18.18 10 8.19 8.19 0 0 1 10 18.18zM8.93 14.07L4.88 10l1.41-1.41 2.65 2.65 5.36-5.36 1.41 1.41z" />
            </svg>
            <span>{bookingSuccess}</span>
          </div>
        </div>
      )}

      {bookingError && (
        <div className="flex items-center justify-center mt-6">
          <div className="bg-red-500 text-white text-sm font-bold px-4 py-3 rounded-md">
            {bookingError}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointmentPage;
