"use client";
import React, { useEffect, useState } from "react";
import { Patients, usePatientStore } from "@/store/usePatientStore";
import { useRouter } from "next/navigation";
import useLoginStore from "@/store/useLoginStore"; // Adjust the import path
import { FaSearch } from "react-icons/fa";
import Loading from "../../loading";

const PatientListPage = () => {
  const { patients, fetchPrescriptionsByDoctor } = usePatientStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patients[]>([]);
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  const doctor = useLoginStore((state) => state.doctor);
  const doctorId = doctor?._id;

  useEffect(() => {
    if (doctorId) fetchPrescriptionsByDoctor(doctorId, currentPage);
  }, [currentPage, doctorId]);

  useEffect(() => {
    const filtered =
      patients?.filter(
        (patient: Patients) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.contactNumber?.includes(searchTerm) // Handle optional contactNumber
      ) || [];
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handlePatientClick = (patientId: string) => {
    if (patientId) {
      setLoading(true); // Set loading state to true when a card is clicked
      router.push(`/doctor/myPatients/patientDetails/${patientId}`);
    }
  };

  const pageSize = 10;
  const totalPatients = filteredPatients.length;
  const totalPages = Math.ceil(totalPatients / pageSize);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container mx-auto px-4 py-8 mt-16 h-fit min-h-screen">
      {/* Search Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="m-4 font-normal text-xl">Treated Patients</h1>
        </div>

        <div className="relative w-full max-w-xs justify-end">
          <input
            type="text"
            placeholder="Search by name or contact number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 pl-10 border rounded-lg w-full"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Patient List */}

      <div className="space-y-6">
        {paginatedPatients && paginatedPatients.length > 0 ? (
          paginatedPatients.map((patient: Patients) => (
            <div
              key={patient._id}
              className="card bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 w-full"
              onClick={() => handlePatientClick(patient._id!)} // Ensure _id is defined
            >
              <div className="flex flex-col md:flex-row items-center space-x-6">
                <img
                  src={patient.profilePic || "/default-profile.png"} // Provide a default image
                  alt={patient.name}
                  className="rounded-full w-20 h-20 object-cover"
                />
                <div className="flex-1 mt-4 md:mt-0">
                  <h2 className="text-xl font-normal text-blue-600">
                    {patient.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Blood Group: {patient.bloodGroup}
                  </p>
                  <p className="text-sm text-gray-600">
                    Contact: {patient.contactNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Location: {patient.address?.city}, {patient.address?.state}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No patients present</div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPatients > pageSize && (
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition duration-300 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition duration-300 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <Loading /> {/* Use the Loader component */}
        </div>
      )}
    </div>
  );
};

export default PatientListPage;
