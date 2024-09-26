"use client";

import { usePatientStore } from "@/store/usePatientStore";
import useDoctorStore from "@/store/useDoctorStore";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";

const Users = () => {
  const patients = usePatientStore((state) => state.patients);
  const allPatients = usePatientStore((state) => state.allPatients);
  const doctors = useDoctorStore((state) => state.doctors);

  const deletePatient = usePatientStore((state) => state.deletePatient);

  const disableDoctor = useDoctorStore((state) => state.disableDoctor);
  const fetchDoctorsMain = useDoctorStore((state) => state.fetchDoctorsMain);
  const [view, setView] = useState("doctors"); // State to toggle between doctors and patients
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to handle sidebar visibility
  const [searchTerm, setSearchTerm] = useState(""); // State to handle search input
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [isViewImage, setIsViewImage] = useState<boolean>(false);

  useEffect(() => {
    fetchDoctorsMain();
    allPatients();
  }, [fetchDoctorsMain, allPatients]);

  // Filtered list based on the search term
  const filteredDoctors = doctors?.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredPatients = patients?.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDoctorDelete = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setIsModalOpen(true);
  };

  const handlePatientDelete = (patientId: string) => {
    setSelectedPatientId(patientId);
    setIsModalOpen(true);
  };

  return (
    <div className="flex  h-fit min-h-screen mt-16">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } w-64 border-r border-gray-300 p-4 transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl">Users</h2>
          {/* Close Sidebar Icon */}
          <button onClick={() => setSidebarOpen(false)}>
            <FaTimes className="text-black " />
          </button>
        </div>

        <button
          onClick={() => setView("doctors")}
          className={`w-full text-left py-2 px-4 rounded ${
            view === "doctors" ? "bg-teal-600 text-white" : "bg-gray-200"
          }`}
        >
          Doctors
        </button>
        <button
          onClick={() => setView("patients")}
          className={`w-full text-left py-2 px-4 mt-4 rounded ${
            view === "patients" ? "bg-teal-600 text-white" : "bg-gray-200"
          }`}
        >
          Patients
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pl-4 pr-4 bg-gray-100 relative h-fit min-h-screen">
        {/* Modal for Viewing Full Image */}

        {isModalOpen && (
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
                <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                {view === "doctors" && (
                  <p>Are you sure you want to Disable this doctor?</p>
                )}

                {view === "patients" && (
                  <p>Are you sure you want to delete this patient?</p>
                )}
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      if (view === "doctors") {
                        disableDoctor(selectedDoctorId);
                      } else if (view === "patients") {
                        deletePatient(selectedPatientId);
                      }
                      setIsModalOpen(false);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
        <div className="flex items-center p-2  border-b border-gray-200 ">
          {/* Toggle Button */}
          {!sidebarOpen && (
            <div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 bg-gray-200 rounded-full mr-4"
              >
                <FaBars className="text-black " />
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="flex-1 flex justify-end">
            <input
              type="text"
              placeholder={`Search ${
                view === "doctors" ? "doctors" : "patients"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-lg w-full max-w-xs"
            />
          </div>
        </div>

        {/* Doctors List */}
        {view === "doctors" && (
          <div>
            <ul className="mt-4">
              {filteredDoctors?.length ? (
                filteredDoctors.map((doctor) => (
                  <li
                    key={doctor._id}
                    className="p-2 bg-white mb-2 shadow rounded font-semibold flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <img
                        src={doctor.profilePic || "/default-profile.png"} // Default profile picture if unavailable
                        alt={`${doctor.name}'s profile`}
                        className="w-10 h-10 rounded-full mr-4 " // Cursor pointer for clickable image
                      />
                      <div>
                        <span className="block">{doctor.name}</span>
                        <span className="block text-sm text-gray-500">
                          {doctor.contactNumber
                            ? doctor.contactNumber
                            : "No contact available"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleDoctorDelete(doctor._id); // Open the modal
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Disable
                    </button>
                  </li>
                ))
              ) : (
                <p>No doctors available.</p>
              )}
            </ul>
          </div>
        )}

        {/* Patients List */}
        {view === "patients" && (
          <div>
            <ul className="mt-4">
              {filteredPatients?.length ? (
                filteredPatients.map((patient) => (
                  <li
                    key={patient._id}
                    className="p-2 bg-white mb-2 shadow rounded font-semibold flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <img
                        src={patient.profilePic || "/default-profile.png"} // Use a default profile picture if none exists
                        alt={`${patient.name}'s profile`}
                        className="w-10 h-10 rounded-full mr-4 "
                      />
                      <div>
                        <span className="block">{patient.name}</span>
                        <span className="block text-sm text-gray-500">
                          {patient.contactNumber
                            ? patient.contactNumber
                            : "No contact available"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (patient._id) {
                          handlePatientDelete(patient._id);
                        }
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      <MdDelete />
                    </button>
                  </li>
                ))
              ) : (
                <p>No patients available.</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
