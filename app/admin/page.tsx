"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useDoctorStore from "@/store/useDoctorStoree";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa"; // Importing FontAwesome icons

export default function DoctorList() {
  const { doctors, fetchDoctors, currentPage, totalPages } = useDoctorStore(
    (state) => ({
      doctors: state.doctors,
      fetchDoctors: state.fetchDoctors,
      currentPage: state.currentPage,
      totalPages: state.totalPages,
    })
  );

  const [filter, setFilter] = useState<"all" | "verified" | "unverified">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchDoctors(filter, currentPage, 9);
  }, [filter, currentPage, fetchDoctors]);

  const handleFilterChange = (newFilter: "all" | "verified" | "unverified") => {
    setFilter(newFilter);
    fetchDoctors(newFilter, 1, 9);
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchDoctors(filter, page, 8);
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex mt-16 ">
      {/* Sidebar */}
      <div
        className={`transition-transform duration-300  ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 h-full  border-r border-gray-300 w-64 p-4 mt-16`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl">Filters</h2>
          {/* Close Sidebar Icon */}
          <button onClick={() => setSidebarOpen(false)}>
            <FaTimes className="text-black" />
          </button>
        </div>

        <button
          onClick={() => handleFilterChange("all")}
          className={`w-full text-left py-2 px-4 rounded ${
            filter === "all" ? "bg-teal-600 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() => handleFilterChange("verified")}
          className={`w-full text-left py-2 px-4 mt-4 rounded ${
            filter === "verified" ? "bg-teal-600 text-white" : "bg-gray-200"
          }`}
        >
          Verified
        </button>

        <button
          onClick={() => handleFilterChange("unverified")}
          className={`w-full text-left py-2 px-4 mt-4 rounded ${
            filter === "unverified" ? "bg-teal-600 text-white" : "bg-gray-200"
          }`}
        >
          Unverified
        </button>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
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
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 pl-10 border rounded-lg w-full"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <section className="py-8 px-4 sm:px-6 lg:px-8">
          {/* <h2 className="text-3xl font-bold text-center mb-2">
            Find Your Doctor
          </h2> */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="doctor-card p-6 border rounded-lg shadow-2xl flex items-start space-x-4"
                >
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={doctor.profilePic || "/default-profile.png"}
                      alt={doctor.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{doctor.name}</h3>
                    <p className="mt-2">{doctor.speciality || ""}</p>
                    <p className="text-sm text-gray-600">
                      {doctor.yearOfRegistration && (
                        <span>
                          Year of Registration: {doctor.yearOfRegistration}
                        </span>
                      )}
                    </p>
                    <Link
                      href={`/admin/${doctor._id}`}
                      className="btn bg-teal-500 mt-4"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full">No doctors found</p>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border bg-gray-300 text-gray-600"
            >
              Previous
            </button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border bg-gray-300 text-gray-600"
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
