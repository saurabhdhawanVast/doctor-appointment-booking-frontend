"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useDoctorStore from "@/store/useDoctorStoree";

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
        } fixed top-0 left-0 h-full  border-r border-gray-300 w-52 p-4 mt-16`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2  rounded-full"
        >
          <span className="text-gray-600">
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </span>
        </button>

        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <button
          onClick={() => handleFilterChange("all")}
          className={`block p-3 rounded-lg border mb-2 w-full text-center ${
            filter === "all" ? "bg-teal-600 text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("verified")}
          className={`block p-3 rounded-lg border mb-2 w-full text-center ${
            filter === "verified" ? "bg-teal-600 text-white" : "bg-gray-200"
          }`}
        >
          Verified
        </button>
        <button
          onClick={() => handleFilterChange("unverified")}
          className={`block p-3 rounded-lg border mb-2 w-full text-center ${
            filter === "unverified" ? "bg-teal-600 text-white" : "bg-gray-200"
          }`}
        >
          Unverified
        </button>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-52" : "ml-0"
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
                <span className="text-gray-600">
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
                      d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                    />
                  </svg>
                </span>
              </button>
              <label>Filters</label>
            </div>
          )}

          {/* Search Bar */}
          <div className="flex-1 flex justify-end">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-lg w-full max-w-xs"
            />
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
