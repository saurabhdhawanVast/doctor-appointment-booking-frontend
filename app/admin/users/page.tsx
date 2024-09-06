"use client";
import useDoctorStore from "@/store/useDoctorStore";
import { usePatientStore } from "@/store/usePatientStore";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing FontAwesome icons

const Users = () => {
  const patients = usePatientStore((state) => state.patients);
  const allPatients = usePatientStore((state) => state.allPatients);
  const doctors = useDoctorStore((state) => state.doctors);
  const fetchDoctors = useDoctorStore((state) => state.fetchDoctors);
  const [view, setView] = useState("doctors"); // State to toggle between doctors and patients
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to handle sidebar visibility
  const [searchTerm, setSearchTerm] = useState(""); // State to handle search input

  useEffect(() => {
    fetchDoctors();
    allPatients();
  }, [fetchDoctors, allPatients]);

  // Filtered list based on the search term
  const filteredDoctors = doctors?.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredPatients = patients?.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen mt-16">
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
      <div className="flex-1 pl-4 pr-4 bg-gray-100 relative">
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
                    className="p-2 bg-white mb-2 shadow rounded font-semibold"
                  >
                    {doctor.name}
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
                    className="p-2 bg-white mb-2 shadow rounded font-semibold"
                  >
                    {patient.name}
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
