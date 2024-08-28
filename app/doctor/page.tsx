"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAppointmentStore from "@/store/useAppointmentStore";
import PrescriptionModal from "@/app/components/PrescriptionModal";
import useLoginStore from "@/store/useLoginStore";
import Loading from "../loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Doctor = () => {
  const fetchUser = useLoginStore((state) => state.fetchUser);
  const doctor = useLoginStore((state) => state.doctor);
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const doctorId = doctor?._id;

  const appointments = useAppointmentStore((state) => state.appointments);
  const fetchAppointments = useAppointmentStore(
    (state) => state.fetchAppointments
  );
  const fetchDoctorDetails = useAppointmentStore(
    (state) => state.fetchDoctorDetails
  );
  const doctorDetails = useAppointmentStore((state) => state.doctorDetails);

  const [appointmentsFetched, setAppointmentsFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"today" | "tomorrow" | "custom">(
    "today"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // New state for calendar visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for dropdown visibility

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust the number of items per page as needed

  useEffect(() => {
    if (typeof doctorId === "string") {
      setLoading(true);
      fetchAppointments(doctorId, new Date())
        .then(() => {
          setAppointmentsFetched(true);
        })
        .catch((err) => {
          setError("Failed to load appointments.");
        })
        .finally(() => {
          setLoading(false);
        });

      // Fetch doctor details
      fetchDoctorDetails(doctorId).catch((err) => {
        console.error("Failed to load doctor details:", err);
      });
    }
  }, [doctorId, fetchAppointments, fetchDoctorDetails]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn, fetchUser]);

  // Filter appointments based on the selected filter
  const getFilteredAppointments = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    if (filter === "today") {
      return appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.toDateString() === now.toDateString();
      });
    } else if (filter === "tomorrow") {
      return appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.toDateString() === tomorrow.toDateString();
      });
    } else if (filter === "custom" && selectedDate) {
      return appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.toDateString() === selectedDate.toDateString();
      });
    }

    return [];
  };

  const getPaginatedAppointments = (appointments: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return appointments.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(getFilteredAppointments().length / itemsPerPage);

  const renderSlots = (slots: any) => {
    if (!slots || slots.length === 0) {
      return <p className="text-gray-500">No slots available.</p>;
    }
    return slots.map((slot: any) => (
      <motion.div
        key={slot.slotId}
        className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out mb-4 relative"
        whileHover={{ scale: 1.02 }}
        style={{ height: "auto" }} // Adjust the height here if needed
      >
        <div className="flex items-center p-2 pt-4 space-x-4">
          <div className="w-14 h-14 flex-shrink-0">
            <img
              src={slot.patient?.profilePic || "/default-profile.png"}
              alt={slot.patient?.name || "Profile Picture"}
              className="w-full h-full object-cover rounded-full border border-gray-300"
            />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-1 space-y-1">
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
            <div className="text-lg text-gray-600 ml-4 mr-4">{slot.time}</div>
          </div>
        </div>
      </motion.div>
    ));
  };

  const renderAppointmentDetails = (appointment: any) => {
    const formattedDate = new Date(appointment.date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

    return (
      <motion.div key={appointment.date} className="p-2 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{formattedDate}</h2>
        </div>
        {renderSlots(appointment.appointmentsBooked)}
      </motion.div>
    );
  };

  const renderPaginationControls = () => {
    return (
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-teal-500 text-white"
          }`}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-teal-500 text-white"
          }`}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for Filters */}
      <aside
        className={`fixed z-30 mt-16 top-0 left-0 h-screen w-64 bg-gray-100 p-4 border-r border-gray-200 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300`}
      >
        <button
          className="md:hidden text-2xl absolute top-4 right-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          &#9776; {/* Hamburger icon */}
        </button>
        <h2 className="text-xl font-semibold mb-4">Filter Appointments</h2>
        <button
          className={`flex items-center px-4 py-2 mb-4 rounded w-full ${
            filter === "today" ? "bg-teal-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setFilter("today");
            setSelectedDate(null); // Reset selected date
          }}
        >
          Today's Appointments
        </button>
        <button
          className={`flex items-center px-2 py-2 rounded w-full ${
            filter === "tomorrow" ? "bg-teal-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setFilter("tomorrow");
            setSelectedDate(null); // Reset selected date
          }}
        >
          Tomorrow's Appointments
        </button>
        <div className="mt-4">
          <button
            className="w-full px-4 py-2 rounded bg-teal-500 text-white"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            Select Date
          </button>
          {isCalendarOpen && (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setFilter("custom");
                setIsCalendarOpen(false); // Close the calendar after selecting a date
              }}
              dateFormat="yyyy-MM-dd"
              className="w-full mt-2 p-2 border border-gray-300 rounded"
              inline
            />
          )}
        </div>
      </aside>

      {/* Main Content */}

      {loading ? (
        <div className="flex-1 p-8 mt-16">
          <Loading />
        </div>
      ) : (
        <main className="flex-1 p-8 mt-16 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Appointments</h1>
            <button
              className="md:hidden text-2xl"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              &#9660; {/* Dropdown icon */}
            </button>
            {isDropdownOpen && (
              <div className="absolute top-16 right-4 bg-white border border-gray-200 shadow-md rounded z-30">
                <button
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {
                    setFilter("today");
                    setSelectedDate(null); // Reset selected date
                    setIsDropdownOpen(false);
                  }}
                >
                  Today's Appointments
                </button>
                <button
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {
                    setFilter("tomorrow");
                    setSelectedDate(null); // Reset selected date
                    setIsDropdownOpen(false);
                  }}
                >
                  Tomorrow's Appointments
                </button>
                <button
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {
                    setIsCalendarOpen(!isCalendarOpen);
                    setIsDropdownOpen(false);
                  }}
                >
                  Select Date
                </button>
                {isCalendarOpen && (
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setFilter("custom");
                      setIsCalendarOpen(false); // Close the calendar after selecting a date
                    }}
                    dateFormat="yyyy-MM-dd"
                    className="w-full mt-2 p-2 border border-gray-300 rounded"
                    inline
                  />
                )}
              </div>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !appointmentsFetched && (
            <p className="text-gray-500">No appointments found.</p>
          )}
          {getFilteredAppointments().length > 0 ? (
            <>
              {getPaginatedAppointments(getFilteredAppointments()).map(
                renderAppointmentDetails
              )}
              {renderPaginationControls()}
            </>
          ) : (
            !loading && (
              <p className="text-gray-500">
                No appointments for the selected date.
              </p>
            )
          )}
        </main>
      )}
    </div>
  );
};

export default Doctor;
