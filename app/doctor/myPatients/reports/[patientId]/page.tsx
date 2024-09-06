"use client";
import useLoginStore from "@/store/useLoginStore";
import { useReportStore } from "@/store/useReportStore";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import { format, startOfDay, endOfDay } from "date-fns";
import { toZonedTime, format as formatZoned } from "date-fns-tz";

const PatientReports = ({ params }: { params: { patientId: string } }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // State for selected date
  const [filteredReports, setFilteredReports] = useState<any[]>([]); // State for filtered reports

  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [itemsPerPage] = useState(10); // Number of items per page

  const reports = useReportStore((state) => state.reports);
  const fetchReports = useReportStore((state) => state.fetchReports);
  const doctor = useLoginStore((state) => state.doctor);
  const doctorId = doctor?._id;
  const { patientId } = params;
  const timeZone = "Asia/Kolkata";

  useEffect(() => {
    if (doctorId && patientId) {
      fetchReports({ patient: patientId, doctor: doctorId })
        .then(() => console.log("Reports fetched successfully"))
        .catch((error) => console.error("Error fetching reports:", error));
    }
  }, [doctorId, patientId, fetchReports]);

  useEffect(() => {
    // Filter reports based on the selected date
    if (selectedDate) {
      const startOfSelectedDate = startOfDay(selectedDate);
      const endOfSelectedDate = endOfDay(selectedDate);

      const filtered = reports.filter((report) => {
        if (report.appointmentDate) {
          const appointmentDate = new Date(report.appointmentDate);

          // Check if appointmentDate is a valid date
          if (isNaN(appointmentDate.getTime())) {
            console.error("Invalid appointment date:", report.appointmentDate);
            return false;
          }

          const zonedAppointmentDate = toZonedTime(appointmentDate, timeZone);
          return (
            zonedAppointmentDate >= startOfSelectedDate &&
            zonedAppointmentDate <= endOfSelectedDate
          );
        }
      });
      setFilteredReports(filtered);
    } else {
      // If no date selected, show all reports
      setFilteredReports(reports);
    }
  }, [selectedDate, reports]);

  // Paginate the filtered reports
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirst, indexOfLast);

  // Calculate the number of pages
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  return (
    <div className="mt-16 p-8">
      <h2 className="text-2xl font-bold mb-4">Patient Reports</h2>

      {/* Date Picker */}
      <div className="mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          placeholderText="Select a date"
          className="p-2 border rounded-lg w-full"
        />
      </div>

      <ul>
        {currentReports.length > 0 ? (
          currentReports.map((report) => {
            // Ensure appointmentDate is a valid date
            const appointmentDate = new Date(report.appointmentDate);
            if (isNaN(appointmentDate.getTime())) {
              return null; // Skip invalid dates
            }

            const formattedDate = formatZoned(
              appointmentDate,
              "yyyy-MM-dd HH:mm:ss",
              { timeZone }
            );

            return (
              <li key={report._id} className="mb-2 p-4 bg-gray-100 rounded-lg">
                <p>Patient Name: {report.patient.name}</p>
                <p>Doctor Name: {report.doctor.name}</p>
                <p>Date: {formattedDate}</p>
                <a
                  href={report.uploadReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                >
                  View Report
                </a>
              </li>
            );
          })
        ) : (
          <p>No reports found for the selected date.</p>
        )}
      </ul>

      {/* Pagination Controls */}
      {filteredReports.length > itemsPerPage && (
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

export default PatientReports;
