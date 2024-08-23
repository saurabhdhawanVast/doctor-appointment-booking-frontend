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

  useEffect(() => {
    fetchDoctors(filter, currentPage, 9);
  }, [filter, currentPage, fetchDoctors]);

  const handleFilterChange = (newFilter: "all" | "verified" | "unverified") => {
    setFilter(newFilter);
    fetchDoctors(newFilter, 1, 9);
  };

  const handlePageChange = (page: number) => {
    fetchDoctors(filter, page, 8);
  };

  return (
    <section className="doctor-list py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Find Your Doctor
        </h2>

        <div className="flex justify-center m-8 space-x-8">
          <button
            onClick={() => handleFilterChange("all")}
            className={`p-2 rounded-lg border ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("verified")}
            className={`p-2 rounded-lg border ${
              filter === "verified" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Verified
          </button>
          <button
            onClick={() => handleFilterChange("unverified")}
            className={`p-2 rounded-lg border ${
              filter === "unverified" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Unverified
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.length > 0 ? (
            doctors.map((doctor: any) => (
              <div
                key={doctor._id}
                className="doctor-card p-6 border rounded-lg shadow-2xl flex items-start space-x-4"
              >
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={doctor.profilePic || "/default-profile.png"} // Use a default image if profilePic is not available
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
      </div>
    </section>
  );
}
