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

const PatientPage = () => {
  const { patientId } = useParams();
  const { prescriptions, fetchPrescriptionsByPatientAndDoctor } =
    usePrescriptionStore();
  const { reports, fetchReports } = useReportStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("prescriptions");
  const [patientName, setPatientName] = useState("");
  const doctor = useLoginStore((state) => state.doctor);
  const doctorId = doctor?._id;
  useEffect(() => {
    if (patientId) {
      fetchPrescriptionsByPatientAndDoctor(
        patientId as string,
        doctorId as string
      );
      fetchReports({ patient: patientId as string });
    }
  }, [patientId, fetchPrescriptionsByPatientAndDoctor, fetchReports]);
  const router = useRouter();

  const goBack = () => router.back(); // Function to navigate back

  useEffect(() => {
    if (prescriptions.length > 0) {
      // Assuming patientName is the same across all prescriptions
      setPatientName(prescriptions[0].patientName);
    }
  }, [prescriptions]);

  // Handle filter change
  const handleFilterChange = (selectedFilter: string) => {
    setFilter(selectedFilter);
    if (selectedFilter === "prescriptions") {
      fetchPrescriptionsByPatientAndDoctor(
        patientId as string,
        doctorId as string
      );
    } else if (selectedFilter === "reports") {
      fetchReports({ patient: patientId as string });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row mt-16">
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
          Prescriptions
        </button>

        <button
          onClick={() => handleFilterChange("reports")}
          className={`w-full text-left py-2 px-4 mt-4 rounded ${
            filter === "reports" ? "bg-teal-600 text-white" : "bg-gray-200"
          }`}
        >
          Reports
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
                Prescriptions
              </h2>
              {prescriptions.map((prescription, index) => (
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
                                  width="2em" // Adjusts dynamically with the font size
                                  height="2em"
                                  className="ml-2"
                                  style={{ flexShrink: 0 }} // Prevents the icon from shrinking
                                >
                                  <path d="M61.748 70.68h-4.914v-4.914a1.749 1.749 0 0 0-1.75-1.75h-8.649a1.75 1.75 0 0 0-1.75 1.75v4.914h-4.913a1.75 1.75 0 0 0-1.75 1.75v8.648a1.75 1.75 0 0 0 1.75 1.75h4.913v4.913a1.75 1.75 0 0 0 1.75 1.75h8.649a1.749 1.749 0 0 0 1.75-1.75v-4.913h4.914a1.75 1.75 0 0 0 1.75-1.75V72.43a1.75 1.75 0 0 0-1.75-1.75zM60 79.328h-4.916a1.75 1.75 0 0 0-1.75 1.75v4.913h-5.149v-4.913a1.75 1.75 0 0 0-1.75-1.75h-4.913V74.18h4.913a1.751 1.751 0 0 0 1.75-1.75v-4.914h5.149v4.914a1.751 1.751 0 0 0 1.75 1.75H60z" />
                                  <path d="M97.694 93.58H82.223V45.986a8.531 8.531 0 0 0-6.712-8.3l-1.93-.414a5.014 5.014 0 0 1-3.945-4.872v-4.633h3.975a1.75 1.75 0 0 0 1.75-1.75V14.146a1.75 1.75 0 0 0-1.75-1.75h-45.7a1.751 1.751 0 0 0-1.75 1.75v11.871a1.751 1.751 0 0 0 1.75 1.75h3.975V32.4a5.013 5.013 0 0 1-3.944 4.877l-1.931.414a8.53 8.53 0 0 0-6.712 8.3v61.129a8.5 8.5 0 0 0 8.488 8.489h45.948a8.483 8.483 0 0 0 3.379-.712 10.919 10.919 0 0 0 3.847.708h16.733a11.01 11.01 0 0 0 0-22.02zM22.8 59.924h55.923v33.66H22.8zM29.658 15.9h42.2v8.371h-42.2zm-2.917 25.208 1.93-.413a8.529 8.529 0 0 0 6.712-8.3v-4.628h30.753V32.4a8.53 8.53 0 0 0 6.713 8.3l1.929.413a5.016 5.016 0 0 1 3.945 4.878v10.433H22.8V45.986a5.015 5.015 0 0 1 3.941-4.878zM22.8 107.115V97.084h50.134a10.942 10.942 0 0 0 0 15.02h-45.15a4.994 4.994 0 0 1-4.984-4.989zm50.655-2.525a7.528 7.528 0 0 1 7.51-7.51h6.622v15.02h-6.626a7.519 7.519 0 0 1-7.51-7.51zm29.563 5.311a7.5 7.5 0 0 1-5.32 2.2h-6.615V97.08h6.611a7.517 7.517 0 0 1 5.32 12.821z" />
                                </svg>
                                <span
                                  className="align-middle"
                                  style={{
                                    verticalAlign: "middle",
                                    // fontSize: "1rem", // Dynamically scalable font size
                                    marginLeft: "0.5rem",
                                  }}
                                >
                                  Medicine
                                </span>
                              </div>{" "}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                              <span
                                className="inline-block align-middle mr-2"
                                style={{ verticalAlign: "middle" }}
                              >
                                <GiOverdose className="text-3xl text-blue-500" />
                              </span>
                              <span
                                className="align-middle"
                                style={{ verticalAlign: "middle" }}
                              >
                                Dosage
                              </span>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                              <span
                                className="inline-block align-middle mr-2"
                                style={{ verticalAlign: "middle" }}
                              >
                                <MdAccessTimeFilled className="text-xl text-red-500" />
                              </span>
                              <span
                                className="align-middle"
                                style={{ verticalAlign: "middle" }}
                              >
                                Time
                              </span>
                            </th>
                            <th className=" text-left text-xs font-bold text-gray-500 uppercase">
                              <span
                                className="inline-block align-middle mr-2"
                                style={{ verticalAlign: "middle" }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 64 64"
                                  height={28}
                                  width={28}
                                >
                                  <path
                                    style={{ fill: "#bbcaea" }}
                                    d="M2 63v-6h49l11-11v17H2z"
                                  />
                                  <path
                                    style={{ fill: "#e6ecff" }}
                                    d="M2 57V5h60v41L51 57H2z"
                                  />
                                  <path
                                    style={{ fill: "#f25757" }}
                                    d="M2 5h60v14H2z"
                                  />
                                  <circle
                                    cx="11"
                                    cy="12"
                                    r="3"
                                    style={{ fill: "#d63434" }}
                                  />
                                  <circle
                                    cx="25"
                                    cy="12"
                                    r="3"
                                    style={{ fill: "#d63434" }}
                                  />
                                  <circle
                                    cx="39"
                                    cy="12"
                                    r="3"
                                    style={{ fill: "#d63434" }}
                                  />
                                  <circle
                                    cx="53"
                                    cy="12"
                                    r="3"
                                    style={{ fill: "#d63434" }}
                                  />
                                  <path
                                    style={{ fill: "#f25757" }}
                                    d="M29 35h6v6h-6zM29 46h6v6h-6zM29 24h6v6h-6zM18 35h6v6h-6zM18 46h6v6h-6zM18 24h6v6h-6zM7 35h6v6H7zM7 46h6v6H7zM7 24h6v6H7zM40 35h6v6h-6zM40 46h6v6h-6zM40 24h6v6h-6zM51 35h6v6h-6zM51 24h6v6h-6z"
                                  />
                                  <path
                                    style={{ fill: "#d0dbf7" }}
                                    d="M51 46v11l11-11H51z"
                                  />
                                  <path
                                    d="M62 4h-8V1a1 1 0 0 0-2 0v3H40V1a1 1 0 0 0-2 0v3H26V1a1 1 0 0 0-2 0v3H12V1a1 1 0 0 0-2 0v3H2a1 1 0 0 0-1 1v58a1 1 0 0 0 1 1h60a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM3 20h58v25H51a1 1 0 0 0-1 1v10H3zm49 27h7.586L52 54.586zM10 6v2.142a4 4 0 1 0 2 0V6h12v2.142a4 4 0 1 0 2 0V6h12v2.142a4 4 0 1 0 2 0V6h12v2.142a4 4 0 1 0 2 0V6h7v12H3V6zm1 7a1 1 0 0 0 1-1v-1.722a2 2 0 1 1-2 0V12a1 1 0 0 0 1 1zm14 0a1 1 0 0 0 1-1v-1.722a2 2 0 1 1-2 0V12a1 1 0 0 0 1 1zm14 0a1 1 0 0 0 1-1v-1.722a2 2 0 1 1-2 0V12a1 1 0 0 0 1 1zm14 0a1 1 0 0 0 1-1v-1.722a2 2 0 1 1-2 0V12a1 1 0 0 0 1 1zM3 62v-4h48a1.003 1.003 0 0 0 .707-.293L61 48.414V62z"
                                    style={{ fill: "#231e23" }}
                                  />
                                  <path
                                    d="M35 34h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM35 45h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM35 23h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM24 34h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM24 45h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM24 23h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM13 34H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6H8v-4h4zM13 45H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6H8v-4h4zM13 23H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6H8v-4h4zM46 34h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM46 45h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM46 23h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM57 34h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM57 23h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4z"
                                    style={{ fill: "#231e23" }}
                                  />
                                </svg>
                              </span>
                              <span
                                className="align-middle"
                                style={{ verticalAlign: "middle" }}
                              >
                                DAYS
                              </span>{" "}
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
                              </td>{" "}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          {filter === "reports" && (
            <>
              <h2 className=" font-normal mb-4 text-xl text-teal-500">
                Reports
              </h2>
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientPage;
