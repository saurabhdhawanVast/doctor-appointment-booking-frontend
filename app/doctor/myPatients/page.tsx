"use client";
import useLoginStore from "@/store/useLoginStore";
import { usePrescriptionStore } from "@/store/usePrescriptionStore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const MyPatients = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
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

  return (
    <div className="mt-16 p-8">
      <h2 className="text-2xl font-bold mb-4">My Patients</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by patient name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-lg w-full"
        />
      </div>

      <ul>
        {filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((prescription) => (
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
                <button className="px-4 py-2 bg-teal-600 text-white rounded  transition duration-300">
                  <Link
                    // className="btn bg-teal-600 w-full "
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
    </div>
  );
};

export default MyPatients;

// "use client";
// import useLoginStore from "@/store/useLoginStore";
// import { usePrescriptionStore } from "@/store/usePrescriptionStore";
// import React, { useEffect, useState } from "react";

// const MyPatients = () => {
//   const [searchQuery, setSearchQuery] = useState(""); // State for search query
//   const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
//     null
//   ); // State for selected patientId
//   const [showList, setShowList] = useState(true); // State to show patient list or details

//   const prescriptions = usePrescriptionStore((state) => state.prescriptions);
//   const fetchPrescriptionsByDoctor = usePrescriptionStore(
//     (state) => state.fetchPrescriptionsByDoctor
//   );
//   const fetchPrescriptions = usePrescriptionStore(
//     (state) => state.fetchPrescriptions
//   );
//   const doctor = useLoginStore((state) => state.doctor);
//   const doctorId = doctor?._id;

//   useEffect(() => {
//     if (doctorId) {
//       fetchPrescriptionsByDoctor(doctorId)
//         .then(() => console.log("Prescription fetching completed"))
//         .catch((error) => console.error("Error in useEffect:", error));
//     } else {
//       console.log("No doctorId available");
//     }
//   }, [fetchPrescriptionsByDoctor, doctorId]);

//   useEffect(() => {
//     if (selectedPatientId && doctorId) {
//       fetchPrescriptions(selectedPatientId)
//         .then(() => console.log("Prescriptions fetched successfully"))
//         .catch((error) =>
//           console.error("Error fetching prescriptions:", error)
//         );
//     }
//   }, [selectedPatientId, fetchPrescriptions, doctorId]);

//   // Filter to get unique prescriptions based on patientId
//   const uniquePrescriptions = prescriptions.filter(
//     (prescription, index, self) =>
//       index === self.findIndex((p) => p.patientId === prescription.patientId)
//   );

//   // Filter prescriptions based on the search query
//   const filteredPrescriptions = uniquePrescriptions.filter((prescription) =>
//     prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Get prescriptions for the selected patient
//   const selectedPatientPrescriptions = prescriptions.filter(
//     (prescription) => prescription.patientId === selectedPatientId
//   );

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-1/3 p-4 bg-gray-100 overflow-y-auto">
//         <h2 className="text-2xl font-bold mb-4">Search Patients</h2>

//         {/* Search Bar */}
//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Search by patient name..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="p-2 border rounded-lg w-full"
//           />
//         </div>

//         {showList ? (
//           <ul>
//             {filteredPrescriptions.length > 0 ? (
//               filteredPrescriptions.map((prescription) => (
//                 <div
//                   key={prescription.patientId}
//                   className="mb-2 p-2 bg-gray-200 rounded-lg flex justify-between items-center"
//                 >
//                   <p>{prescription.patientName}</p>
//                   <button
//                     onClick={() => {
//                       setSelectedPatientId(prescription.patientId);
//                       setShowList(false); // Hide list and show details
//                     }}
//                     className="px-4 py-2 bg-teal-600 text-white rounded transition duration-300"
//                   >
//                     View Prescription
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p>No patients found.</p>
//             )}
//           </ul>
//         ) : (
//           <button
//             onClick={() => setShowList(true)} // Show list again
//             className="mb-4 px-4 py-2 bg-teal-600 text-white rounded transition duration-300"
//           >
//             Back to Patient List
//           </button>
//         )}
//       </div>

//       {/* Main Area */}
//       <div className="w-2/3 p-4">
//         {!showList && selectedPatientId ? (
//           <>
//             <h2 className="text-2xl font-bold mb-4">
//               Prescriptions for Patient
//             </h2>
//             <ul>
//               {selectedPatientPrescriptions.length > 0 ? (
//                 selectedPatientPrescriptions.map((prescription) => (
//                   <li
//                     key={prescription._id}
//                     className="mb-2 p-4 bg-gray-200 rounded-lg"
//                   >
//                     <p>Patient Name: {prescription.patientName}</p>
//                     <p>Doctor Name: {prescription.doctorName}</p>
//                     <p>Date: {prescription.appointmentDate}</p>
//                     {/* Add more fields as needed */}
//                   </li>
//                 ))
//               ) : (
//                 <p>No prescriptions found for this patient.</p>
//               )}
//             </ul>
//           </>
//         ) : (
//           <p>Select a patient to view their prescriptions.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyPatients;
