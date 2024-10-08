"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAppointmentStore from "@/store/useAppointmentStore";
import PrescriptionModal from "@/app/components/PrescriptionModal";
import useLoginStore from "@/store/useLoginStore";
import Loading from "../loading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { date, set } from "zod";
import { toDate } from "date-fns-tz";
import { IoPlayBack, IoPlayForward } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";
import medicalHistory from "../../public/images/medicalHistory.png";
import prescription from "../../public/images/prescription.png";

interface Patient {
  name: string;
  profilePic?: string;
  contactNumber?: string;
  email?: string;
  _id?: string;
  patientId?: string; // Ensure patientId is included
}

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"today" | "tomorrow" | "custom">(
    "today"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(true); // New state for calendar visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for dropdown visibility

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust the number of items per page as needed
  const router = useRouter();

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
      console.log("Appointments are : ", appointments);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [slotId, setSlotId] = useState<string>("");

  const handleAddPrescription = (
    patient: Patient,
    appointmentDate: string,
    slotId: string
  ) => {
    setCurrentPatient({
      ...patient,
      _id: patient.patientId,
    });
    setAppointmentDate(appointmentDate);
    setSlotId(slotId);
    setIsModalOpen(true);
  };

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

  const formatTime = (time: string): string => {
    console.log(time);
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

  const getPaginatedAppointments = (appointments: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return appointments.slice(startIndex, endIndex);
  };

  const isAppointmentDate = (date: any) => {
    console.log(appointments);

    return appointments.some(
      (appointment) =>
        new Date(appointment.date).toDateString() === date.toDateString()
    );
  };

  const getDateClassName = (date: any) => {
    return isAppointmentDate(date)
      ? "bg-green-500 text-white" // Appointment date (highlight with green)
      : "bg-[#f55d5d] text-black"; // Non-appointment date (highlight with red)
  };

  const totalPages = Math.ceil(getFilteredAppointments().length / itemsPerPage);

  const renderSlots = (slots: any) => {
    if (!slots || slots.length === 0) {
      return <p className="text-gray-500">No slots available.</p>;
    }

    // Filter out slots without time and sort by time in ascending order
    const filteredAndSortedSlots = slots
      .filter((slot: any) => slot.time) // Only include slots where time is present
      .sort(
        (a: any, b: any) =>
          new Date(a.time).getTime() - new Date(b.time).getTime()
      ); // Sort in ascending order by time

    return filteredAndSortedSlots.map((slot: any) => (
      <motion.div
        key={slot.slotId}
        className="bg-slate-100 p-2 flex flex-wrap border items-center justify-between border-gray-200 
      rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out mb-4 relative"
        whileHover={{ scale: 1.01 }}
        style={{ height: "auto" }}
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 flex-shrink-0">
            <img
              src={slot.patient?.profilePic || "/default-profile.png"}
              alt={slot.patient?.name || "Profile Picture"}
              className="w-full h-full object-cover rounded-full border border-gray-300"
            />
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-md text-blue-600 font-normal">
              {slot.patient?.name || "No appointment"}
            </div>
            {slot.patient && (
              <div className="text-sm text-gray-500">
                <div>
                  Contact Number:{" "}
                  {slot.patient?.contactNumber || "No contact info"}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------Time Button------------------- */}
        <div className="p-2 rounded-lg flex flex-wrap items-center gap-2 flex-end">
          <div className="text-md text-gray-600 ml-4 mr-4">
            {formatTime(slot.time)}
          </div>
          <div className="divider divider-horizontal"></div>

          {slot.patient && (
            <div className="flex items-center gap-4">
              {/* Prescribe Button */}
              <button
                className="flex items-center gap-2 px-2 py-1 bg-teal-600 text-white rounded transition duration-300 text-sm"
                onClick={() => {
                  if (selectedDate) {
                    handleAddPrescription(
                      slot.patient,
                      selectedDate.toISOString(),
                      slot.slotId
                    );
                  } else {
                    console.error("Selected date is not set");
                  }
                }}
              >
                <Image
                  src={prescription}
                  alt="Medical History"
                  width={28} // Set the desired width
                  height={28} // Set the desired height
                />
                <span>Prescribe</span>
              </button>

              <button
                className="flex items-center gap-2 px-2 py-1 bg-teal-600 text-white rounded transition duration-300 text-sm"
                onClick={() => {
                  router.push(
                    `doctor/myPatients/patientDetails/${slot.patient?.patientId}`
                  );
                }}
              >
                <Image
                  src={medicalHistory}
                  alt="Medical History"
                  width={28} // Set the desired width
                  height={28} // Set the desired height
                />
                <span>Medical History</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    ));
  };

  const renderAppointmentDetails = (appointment: any) => {
    const formattedDate = new Date(appointment.date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

    return (
      <motion.div key={appointment.date} className="p-2 mb-2 ">
        <div className="flex mb-2 ">
          <h2 className="font-normal ">{formattedDate}</h2>
        </div>
        {renderSlots(appointment.appointmentsBooked)}
      </motion.div>
    );
  };

  const renderPaginationControls = () => {
    return (
      <div className="flex justify-center mt-2 space-x-2 ">
        <button
          className={`px-2 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-teal-500 text-white"
          }`}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IoPlayBack className="w-4 h-4" />
        </button>
        <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className={`px-2 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-teal-500 text-white"
          }`}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <IoPlayForward className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-[99vh] mb-3 ">
      {/* Sidebar for Filters */}
      <aside
        className={`fixed z-30 p-6 mt-16 top-0 left-0 w-72 bg-gray-100  border-r border-gray-200 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <button
          className="md:hidden text-2xl absolute top-4 right-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          &#9776; {/* Hamburger icon */}
        </button>
        <h2 className="text-lg font-normal mb-4">Filter Appointments</h2>
        <button
          className={`flex items-center px-4 py-2 mb-4 font-md rounded w-full ${
            filter === "today" ? "bg-teal-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            const today = new Date(); // Get today's date
            today.setDate(today.getDate()); // Set today's date
            setFilter("today");
            setSelectedDate(today);
            // Reset selected date
          }}
        >
          Today's Appointments
        </button>
        <button
          className={`flex items-center px-2 py-2 font-md rounded w-full ${
            filter === "tomorrow" ? "bg-teal-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            const tomorrow = new Date(); // Get today's date
            tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day to get tomorrow's date
            setFilter("tomorrow");
            setSelectedDate(tomorrow); // Set tomorrow's date
          }}
        >
          Tomorrow's Appointments
        </button>
        <div className="mt-4">
          {/* <button
            className="w-full px-4 py-2 mb-4 rounded bg-teal-500 text-white"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            Select Date
          </button> */}
          {isCalendarOpen && (
            <div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setFilter("custom");
                  //setIsCalendarOpen(false); // Close calendar after selecting a date
                }}
                highlightDates={appointments.map(
                  (appointment) => new Date(appointment.date)
                )}
                dayClassName={(date) => getDateClassName(date)} // Apply the highlighting
                inline
              />
              <div className="flex flex-col space-y-2 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500"></div>
                  <span className="text-gray-700">Appointments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-[#f55d5d]"></div>
                  <span className="text-gray-700">No Appointments</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}

      {loading ? (
        <div className="flex-1 p-8 mt-16">
          <Loading />
        </div>
      ) : (
        <main className="flex-1 p-4 mt-16 overflow-y-auto">
          <div className="flex items-center justify-between bg-gray-200 p-2 rounded-lg">
            <h1 className="text-lg font-normal">Appointments</h1>
            <button
              className="md:hidden text-2xl"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M11.47 13.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 0 0-1.06-1.06L12 11.69 5.03 4.72a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M11.47 19.28a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 1 0-1.06-1.06L12 17.69l-6.97-6.97a.75.75 0 0 0-1.06 1.06l7.5 7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute  top-16 right-4 bg-white border border-gray-200 shadow-md rounded z-30">
                <div className="flex ">
                  <button
                    className="block px-4 py-2 w-full mt-5 text-left hover:bg-gray-100"
                    onClick={() => {
                      const today = new Date(); // Get today's date
                      setFilter("today");
                      setSelectedDate(today); // Reset selected date
                      setIsDropdownOpen(false);
                    }}
                  >
                    Today's Appointments
                  </button>
                  <button
                    className="block p-2 mb-2 "
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {
                    const tomorrow = new Date(); // Get today's date
                    tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day to get tomorrow's date
                    setFilter("tomorrow");
                    setSelectedDate(tomorrow); // Reset selected date
                    setIsDropdownOpen(false);
                  }}
                >
                  Tomorrow's Appointments
                </button>
                {/* <button
                  className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                  onClick={() => {
                    setIsCalendarOpen(!isCalendarOpen);
                  }}
                >
                  Select Date
                </button> */}
                {isCalendarOpen && (
                  <div>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setFilter("custom");
                        //setIsCalendarOpen(false); // Close calendar after selecting a date
                      }}
                      highlightDates={appointments.map(
                        (appointment) => new Date(appointment.date)
                      )}
                      dayClassName={(date) => getDateClassName(date)} // Apply the highlighting
                      inline
                    />
                    {
                      <div className="flex flex-col space-y-4 mt-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500"></div>
                          <span className="text-gray-700">Appointments</span>
                        </div>
                        <div className="flex items-center space-x-2 ">
                          <div className="w-4 h-4 bg-[#f55d5d] "></div>
                          <span className="text-gray-700 ">
                            No Appointments
                          </span>
                        </div>
                      </div>
                    }
                  </div>
                )}
              </div>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !appointmentsFetched && (
            <p className="text-gray-500">No appointments found.</p>
          )}
          {getFilteredAppointments().length > 0 ? (
            <div>
              {getPaginatedAppointments(getFilteredAppointments()).map(
                renderAppointmentDetails
              )}
              {renderPaginationControls()}
            </div>
          ) : (
            !loading && (
              <p className="text-gray-500 p-2">
                No appointments for the selected date.
              </p>
            )
          )}
        </main>
      )}

      <PrescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctorName={doctorDetails?.name || "Doctor"}
        patientName={currentPatient?.name || ""}
        patientId={currentPatient?._id ?? ""} // Ensure patientId is being passed correctly
        doctorId={doctorId as string}
        appointmentDate={appointmentDate} // Pass appointmentDate
        slotId={slotId} // Pass slotId
      />
    </div>
  );
};

export default Doctor;
