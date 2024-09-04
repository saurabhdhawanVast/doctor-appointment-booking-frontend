"use client";
import { useEffect } from "react";
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Patient Reports</h1>
      <ReportsForm />

      <h2 className="text-xl font-bold mt-6 mb-4">Saved Reports</h2>
      <div>
        {reports.length === 0 && (
          <p className="text-center">No reports to display!</p>
        )}
      </div>
      <ul className="space-y-4">
        {reports.length > 0 &&
          reports.map((report) => (
            <li
              key={report._id}
              className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">{report.reportName}</h3>
                <p>{report.type}</p>
                <p>{new Date(report.date).toLocaleDateString()}</p>
              </div>
              <div className="flex">
                <a
                  href={report.uploadReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  <FaEye className="text-2xl" />
                </a>
                <button
                  onClick={() => removeReport(report._id)}
                  className="text-red-500 hover:underline ml-4"
                >
                  <MdDeleteOutline className="text-2xl" />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
