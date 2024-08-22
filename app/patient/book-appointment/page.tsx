"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, toZonedTime } from "date-fns-tz";
import useBookAppointmentStore from "@/store/useBookAppointmentStore";
import useDoctorStore from "@/store/useDoctorStoree";
import { useSearchParams } from "next/navigation";

const timeZone = "Asia/Kolkata"; // Set your preferred time zone

// Utility function to normalize date to start of the day in UTC
const normalizeDateToUTC = (date: Date): Date => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
};

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
      const normalizedSelectedDate = normalizeDateToUTC(selectedDate);
      const dateString = format(
        toZonedTime(normalizedSelectedDate, timeZone),
        "yyyy-MM-dd",
        { timeZone }
      );
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

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date ? normalizeDateToUTC(date) : null);
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
      : "bg-gray-200 text-gray-400";
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

  return (
    <div className=" mx-auto p-8 bg-gray-50 rounded-lg shadow-lg mt-16 w-full  ">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Book Appointment with Dr. {doctor.name}
      </h1>

      <div className="flex items-center space-x-6 mb-6 ">
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
            <strong className="font-medium text-gray-600">Name:</strong> Dr.
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
            dateFormat="MMMM d, yyyy"
            minDate={new Date()} // Optional: to prevent selecting past dates
          />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 h-80 overflow-y-auto">
          {selectedDate && (
            <>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Available Slots for{" "}
                {format(toZonedTime(selectedDate, timeZone), "MMMM d, yyyy", {
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
                          {slot.time}
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
                          {slot.status.charAt(0).toUpperCase() +
                            slot.status.slice(1)}
                        </span>
                      </div>
                      {slot.status === "available" && (
                        <button
                          onClick={() => handleBookSlot(slot.id)}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                        >
                          Book Slot
                        </button>
                      )}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No available slots for this date.
                  </p>
                )}
              </ul>
              {bookingError && (
                <p className="text-red-500 mt-4">{bookingError}</p>
              )}
              {bookingSuccess && (
                <p className="text-green-500 mt-4">{bookingSuccess}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Confirmation Box */}
      {showModal && (
        <dialog
          open
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Booking
            </h3>
            <p className="text-gray-700 mb-4">Do you want to book this slot?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmBooking}
                className="btn btn-primary bg-blue-600 text-white rounded-lg px-4 py-2 shadow-md hover:bg-blue-700 transition duration-300"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary bg-gray-300 text-gray-800 rounded-lg px-4 py-2 shadow-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default BookAppointmentPage;
