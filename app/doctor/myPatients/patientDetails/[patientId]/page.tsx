"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Typography } from "@mui/material";
import { FaBars, FaTimes } from "react-icons/fa";
import { usePrescriptionStore } from "@/store/usePrescriptionStore";
import useReportStore from "@/store/useReportStore";
import useLoginStore from "@/store/useLoginStore";
import { MdAccessTimeFilled } from "react-icons/md";
import { GiOverdose } from "react-icons/gi";
import { IoMdArrowBack } from "react-icons/io";
import { Prescription } from "@/store/usePrescriptionStore";

const PatientPage = () => {
  const { patientId } = useParams();
  const { prescriptions, fetchPrescriptions } = usePrescriptionStore();
  const { reports, fetchReports } = useReportStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("prescriptions");
  const [patientName, setPatientName] = useState("");

  const doctor = useLoginStore((state) => state.doctor);
  const doctorId = doctor?._id;
  useEffect(() => {
    if (patientId) {
      fetchPrescriptions(patientId as string);
      fetchReports({ patient: patientId as string });
    }
  }, [patientId, fetchReports, prescriptions]);
  const router = useRouter();

  const goBack = () => router.back(); // Function to navigate back

  useEffect(() => {
    if (prescriptions.length > 0) {
      // Assuming patientName is the same across all prescriptions
      setPatientName(prescriptions[0].patientName);
    }
  }, [prescriptions]);

  const sortedPrescriptions = prescriptions.sort(
    (a, b) =>
      new Date(b.appointmentDate).getTime() -
      new Date(a.appointmentDate).getTime()
  );
  const myPrescriptions = sortedPrescriptions.filter(
    (prescription) => prescription.doctorId === doctorId
  );

  const handleFilterChange = (selectedFilter: string) => {
    setFilter(selectedFilter);

    if (selectedFilter === "prescriptions") {
      myPrescriptions;
    } else if (selectedFilter === "reports") {
      fetchReports({ patient: patientId as string });
    } else if (selectedFilter === "allPrescriptions") {
      sortedPrescriptions;
      // Assuming you want to show all prescriptions
    }
  };

  return (
    <div className="flex flex-col lg:flex-row mt-16 h-fit min-h-screen">
      {/* Sidebar for Filtering */}
      <div
        className={`transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 h-full border-r border-gray-300 w-64 p-4 mt-16 bg-white`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl">Filters</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <FaTimes className="text-black" />
          </button>
        </div>

        <button
          onClick={() => handleFilterChange("prescriptions")}
          className={`w-full text-left py-2 px-4 rounded ${
            filter === "prescriptions"
              ? "bg-teal-600 text-white"
              : "bg-gray-200"
          }`}
        >
          My Prescriptions
        </button>

        <button
          onClick={() => handleFilterChange("reports")}
          className={`w-full text-left py-2 px-4 mt-4 rounded ${
            filter === "reports" ? "bg-teal-600 text-white" : "bg-gray-200"
          }`}
        >
          Reports
        </button>

        <button
          onClick={() => handleFilterChange("allPrescriptions")}
          className={`w-full text-left py-2 px-4 mt-4 rounded ${
            filter === "allPrescriptions"
              ? "bg-teal-600 text-white"
              : "bg-gray-200"
          }`}
        >
          All Prescriptions
        </button>
      </div>

      {/* Main Content */}
      <main
        className={`flex-1  transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="flex items-center  p-2 border-b border-gray-200">
          {!sidebarOpen && (
            <div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 bg-gray-200 rounded-full mr-4"
              >
                <FaBars className="text-black" />
              </button>
              <button
                onClick={goBack} // Add onClick handler for back navigation
                className="p-2 bg-gray-200 rounded-full mr-4"
              >
                <IoMdArrowBack className="text-black" />
              </button>
            </div>
          )}
          <h1>
            Patient :{" "}
            <span className="text-blue-500  font-normal">{patientName}</span>{" "}
          </h1>
        </div>

        <div className="p-4">
          {filter === "prescriptions" && (
            <>
              <h2 className="text-xl font-normal text-teal-500 mb-4">
                My Prescriptions
              </h2>
              {myPrescriptions.length === 0 ? (
                <p className="text-gray-500">No prescriptions found.</p>
              ) : (
                myPrescriptions.map((prescription, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg hover:shadow-2xl transform transition-transform duration-300 ease-in-out hover:scale-104 rounded-lg p-6 mb-6 flex flex-col sm:flex-row justify-center items-start"
                  >
                    <div className="w-full sm:w-3/4 flex flex-col ">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                        <Typography variant="body1">
                          Doctor Name: {prescription.doctorName}
                        </Typography>
                        <Typography
                          variant="body1"
                          className="text-right mt-2 sm:mt-0"
                        >
                          Date:{" "}
                          {new Date(
                            prescription.appointmentDate
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </div>

                      <div className="overflow-x-auto mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <svg
                                    data-name="Layer 1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 128 128"
                                    width="2em"
                                    height="2em"
                                    className="ml-2"
                                    style={{ flexShrink: 0 }}
                                  >
                                    {/* SVG path here */}
                                  </svg>
                                  <span
                                    className="align-middle"
                                    style={{ marginLeft: "0.5rem" }}
                                  >
                                    Medicine
                                  </span>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                <span className="inline-block align-middle mr-2">
                                  <GiOverdose className="text-3xl text-blue-500" />
                                </span>
                                <span className="align-middle">Dosage</span>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                <span className="inline-block align-middle mr-2">
                                  <MdAccessTimeFilled className="text-xl text-red-500" />
                                </span>
                                <span className="align-middle">Time</span>
                              </th>
                              <th className="text-left text-xs font-bold text-gray-500 uppercase">
                                <span className="inline-block align-middle mr-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 64 64"
                                    height={28}
                                    width={28}
                                  >
                                    {/* SVG path here */}
                                  </svg>
                                </span>
                                <span className="align-middle">DAYS</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {prescription.medicines.map((medicine, idx) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {medicine.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {medicine.dosage}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {medicine.time}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 text-center">
                                  {medicine.days}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {/* -------------reports-------------------- */}
          {filter === "reports" && (
            <>
              <h2 className="font-normal mb-4 text-xl text-teal-500">
                Reports
              </h2>
              {reports.length === 0 ? (
                <p className="text-gray-500">No reports found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reports.map((report, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-lg hover:shadow-2xl transform transition-transform duration-300 ease-in-out hover:scale-105 rounded-lg p-6 mb-6 flex flex-col"
                    >
                      <img
                        src={report.uploadReport}
                        alt={report.reportName}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <div className="flex flex-col flex-grow">
                        <Typography variant="h6" className="mb-2">
                          {report.reportName}
                        </Typography>
                        <Typography variant="body1" className="mb-4">
                          Date:{" "}
                          {new Date(report.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                        <a
                          href={report.uploadReport}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline mt-auto"
                        >
                          View Report
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {filter === "allPrescriptions" && (
            <>
              <h2 className="text-xl font-normal text-teal-500 mb-4">
                All Prescriptions
              </h2>
              {sortedPrescriptions.length === 0 ? (
                <p className="text-gray-500">No prescriptions found.</p>
              ) : (
                sortedPrescriptions.map((prescription, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg hover:shadow-2xl transform transition-transform duration-300 ease-in-out hover:scale-104 rounded-lg p-6 mb-6 flex flex-col sm:flex-row justify-center items-start"
                  >
                    <div className="w-full sm:w-3/4 flex flex-col ">
                      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                        <Typography variant="body1">
                          Doctor Name: {prescription.doctorName}
                        </Typography>
                        <Typography
                          variant="body1"
                          className="text-right mt-2 sm:mt-0"
                        >
                          Date:{" "}
                          {new Date(
                            prescription.appointmentDate
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </div>

                      <div className="overflow-x-auto mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <svg
                                    data-name="Layer 1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 128 128"
                                    width="2em"
                                    height="2em"
                                    className="ml-2"
                                    style={{ flexShrink: 0 }}
                                  >
                                    {/* SVG path here */}
                                  </svg>
                                  <span
                                    className="align-middle"
                                    style={{ marginLeft: "0.5rem" }}
                                  >
                                    Medicine
                                  </span>
                                </div>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                <span className="inline-block align-middle mr-2">
                                  <GiOverdose className="text-3xl text-blue-500" />
                                </span>
                                <span className="align-middle">Dosage</span>
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                                <span className="inline-block align-middle mr-2">
                                  <MdAccessTimeFilled className="text-xl text-red-500" />
                                </span>
                                <span className="align-middle">Time</span>
                              </th>
                              <th className="text-left text-xs font-bold text-gray-500 uppercase">
                                <span className="inline-block align-middle mr-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 64 64"
                                    height={28}
                                    width={28}
                                  >
                                    {/* SVG path here */}
                                  </svg>
                                </span>
                                <span className="align-middle">DAYS</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {prescription.medicines.map((medicine, idx) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {medicine.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {medicine.dosage}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {medicine.time}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 text-center">
                                  {medicine.days}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientPage;
