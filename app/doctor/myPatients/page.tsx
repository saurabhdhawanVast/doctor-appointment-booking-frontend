"use client";
import useLoginStore from "@/store/useLoginStore";
import { usePrescriptionStore } from "@/store/usePrescriptionStore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const MyPatients = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage] = useState(10); // Number of items per page
  const prescriptions = usePrescriptionStore((state) => state.prescriptions);
  const fetchPrescriptionsByDoctor = usePrescriptionStore(
    (state) => state.fetchPrescriptionsByDoctor
  );
  const doctor = useLoginStore((state) => state.doctor);
  const doctorId = doctor?._id;

  useEffect(() => {
    if (doctorId) {
      fetchPrescriptionsByDoctor(doctorId)
        .then(() => console.log("Prescription fetching completed"))
        .catch((error) => console.error("Error in useEffect:", error));
    } else {
      console.log("No doctorId available");
    }
    console.log("prescriptions", prescriptions);
  }, [fetchPrescriptionsByDoctor, doctorId]);

  // Filter to get unique prescriptions based on patientId
  const uniquePrescriptions = prescriptions.filter(
    (prescription, index, self) =>
      index === self.findIndex((p) => p.patientId === prescription.patientId)
  );

  // Filter prescriptions based on the search query
  const filteredPrescriptions = uniquePrescriptions.filter((prescription) =>
    prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate the filtered prescriptions
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPrescriptions = filteredPrescriptions.slice(
    indexOfFirst,
    indexOfLast
  );

  // Calculate the number of pages
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);

  return (
    <div className="mt-16 p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Patients</h2>

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-lg w-full md:w-64 lg:w-80"
          />
        </div>
      </div>

      <ul>
        {currentPrescriptions.length > 0 ? (
          currentPrescriptions.map((prescription) => (
            <div
              key={prescription.patientId}
              className="mb-2 p-2 bg-gray-200 rounded-lg flex flex-row justify-between flex-wrap"
            >
              <div className="flex justify-center p-2 text-xl">
                <li>
                  <p>{prescription.patientName}</p>

                  {/* Add more fields as needed */}
                </li>
              </div>

              <div>
                <button className="px-4 py-2 mr-4 bg-teal-600 text-white rounded transition duration-300">
                  <Link
                    href={`/doctor/myPatients/reports/${prescription.patientId}`}
                  >
                    View Reports
                  </Link>
                </button>
                <button className="px-4 py-2 bg-teal-600 text-white rounded transition duration-300">
                  <Link
                    href={`/doctor/myPatients/prescription/${prescription.patientId}`}
                  >
                    View Prescription
                  </Link>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No prescriptions found.</p>
        )}
      </ul>

      {/* Pagination Controls */}
      {filteredPrescriptions.length > itemsPerPage && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-teal-600 text-white rounded transition duration-300 mr-2"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-4 py-2 bg-teal-600 text-white rounded transition duration-300 ml-2"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPatients;
