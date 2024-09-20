// "use client";
// import { useEffect } from "react";
// import ReportsForm from "@/app/components/ReportsForm";
// import useReportStore from "@/store/useReportStore";
// import useLoginStore from "@/store/useLoginStore";
// import { FaEye } from "react-icons/fa";
// import { MdDeleteOutline } from "react-icons/md";

// export default function ReportsPage() {
//   const reports = useReportStore((state) => state.reports);
//   const fetchReports = useReportStore((state) => state.fetchReports);
//   const removeReport = useReportStore((state) => state.removeReport);
//   const patient = useLoginStore((state) => state.patient);
//   useEffect(() => {
//     let fetch = async () => {
//       if (patient) {
//         await fetchReports({ patient: patient._id });
//       }
//     };
//     fetch();
//   }, [patient]);
//   useEffect(() => {
//     console.log("Reports state updated:", reports);
//   }, [reports]);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Patient Reports</h1>
//       <ReportsForm />

//       <h2 className="text-xl font-bold mt-6 mb-4">Saved Reports</h2>
//       <div>
//         {reports.length === 0 && (
//           <p className="text-center">No reports to display!</p>
//         )}
//       </div>
//       <ul className="space-y-4">
//         {reports.length > 0 &&
//           reports.map((report) => (
//             <li
//               key={report._id}
//               className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="text-lg font-bold">{report.reportName}</h3>
//                 <p>{report.type}</p>
//                 <p>
//                   {new Date(report.date).toLocaleDateString("en-GB", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                   })}
//                 </p>
//               </div>
//               <div className="flex">
//                 <a
//                   href={report.uploadReport}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:underline"
//                 >
//                   <FaEye className="text-2xl" />
//                 </a>
//                 <button
//                   onClick={() => removeReport(report._id)}
//                   className="text-red-500 hover:underline ml-4"
//                 >
//                   <MdDeleteOutline className="text-2xl" />
//                 </button>
//               </div>
//             </li>
//           ))}
//       </ul>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReportsForm from "@/app/components/ReportsForm";
import useReportStore from "@/store/useReportStore";
import useLoginStore from "@/store/useLoginStore";
import { FaEye } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

export default function ReportsPage() {
  const reports = useReportStore((state) => state.reports);
  const fetchReports = useReportStore((state) => state.fetchReports);
  const removeReport = useReportStore((state) => state.removeReport);
  const patient = useLoginStore((state) => state.patient);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    let fetch = async () => {
      if (patient) {
        await fetchReports({ patient: patient._id });
      }
    };
    fetch();
  }, [patient]);

  useEffect(() => {
    console.log("Reports state updated:", reports);
  }, [reports]);

  const handleDeleteClick = (reportId: string) => {
    setSelectedReportId(reportId);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedReportId) {
      await removeReport(selectedReportId);
      setShowConfirmation(false);
      setSelectedReportId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
    setSelectedReportId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patient Reports</h1>
      <ReportsForm />

      <h2 className="text-xl font-bold mt-6 mb-4">Saved Reports</h2>
      {reports.length === 0 && (
        <p className="text-center">No reports to display!</p>
      )}

      {/* Grid-based card layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div
            key={report._id}
            className="bg-white shadow-lg hover:shadow-2xl transform transition-transform duration-300 ease-in-out hover:scale-105 rounded-lg p-6 mb-6 flex flex-col"
          >
            {/* Report Image */}
            <img
              src={report.uploadReport}
              alt={report.reportName}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            {/* Report Details */}
            <div className="flex flex-col flex-grow">
              <h3 className="text-lg font-bold mb-2">{report.reportName}</h3>
              <p className="mb-4">
                Date:{" "}
                {new Date(report.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <div className="flex justify-between items-center mt-auto">
                {/* View Report */}
                <a
                  href={report.uploadReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  <FaEye className="text-2xl" />
                </a>
                {/* Delete Report */}
                <button
                  onClick={() => handleDeleteClick(report._id)}
                  className="text-red-500 hover:underline"
                >
                  <MdDeleteOutline className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
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
              <p>Are you sure you want to delete this report?</p>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleConfirmDelete}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
