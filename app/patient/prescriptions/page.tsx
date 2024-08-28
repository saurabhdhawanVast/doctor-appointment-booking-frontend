"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePrescriptionStore } from "@/store/usePrescriptionStore";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Define interfaces for Medicine and Prescription
interface Medicine {
  name: string;
  dosage: string[];
  time: string;
  days: number;
}

interface Prescription {
  patientId: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  note: string;
  medicines: Medicine[];
  appointmentDate: string;
}

// Include the "Baloo 2" font in your HTML or CSS file
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700&display=swap');
  body {
    font-family: 'Baloo 2', cursive;
  }
`;

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PrescriptionPage = () => {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const { prescriptions, fetchPrescriptions } = usePrescriptionStore(
    (state) => ({
      prescriptions: state.prescriptions,
      fetchPrescriptions: state.fetchPrescriptions,
    })
  );

  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (patientId) {
      fetchPrescriptions(patientId)
        .then(() => console.log("Prescription fetching completed"))
        .catch((error) => console.error("Error in useEffect:", error));
    } else {
      console.log("No patientId available");
    }
  }, [patientId, fetchPrescriptions]);

  const openModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedPrescription(null);
    setModalIsOpen(false);
  };

  const saveAsPDF = () => {
    if (!selectedPrescription) return;

    const doc = new jsPDF();
    doc.setFont("Baloo 2", "normal"); // Set font for PDF
    doc.setFontSize(16);
    doc.text(`Patient Name: ${selectedPrescription.patientName}`, 10, 10);
    doc.text(`Doctor Name: ${selectedPrescription.doctorName}`, 10, 20);
    doc.text(
      `Date: ${new Date(
        selectedPrescription.appointmentDate
      ).toLocaleDateString("en-GB")}`,
      190,
      10,
      { align: "right" }
    );

    const tableColumn = ["Medicine", "Dosage", "Time", "Days"];
    const tableRows = selectedPrescription.medicines.map((medicine) => [
      medicine.name,
      medicine.dosage.join(", "),
      medicine.time,
      medicine.days,
    ]);

    let finalY = 30;

    autoTable(doc, {
      startY: finalY,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      margin: { top: 10 },
      styles: {
        cellPadding: 5,
        fontSize: 10,
        overflow: "linebreak",
        font: "Baloo 2",
      },
      headStyles: {
        fillColor: "#05998c", // Green header background
        textColor: "#FFFFFF", // White text
        fontStyle: "bold",
        font: "Baloo 2", // Apply the font to headings
      },
      alternateRowStyles: {
        fillColor: "#f2f2f2", // Light gray for alternating rows
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
      },
      didDrawPage: (data) => {
        if (data.cursor) {
          finalY = data.cursor.y; // Update finalY to the position after the table
        }
      },
    });

    // Use the updated finalY to position the note
    doc.text(`Note: ${selectedPrescription.note}`, 10, finalY + 10);

    doc.save("prescription.pdf");
  };

  return (
    <div className="p-6 max-w-full mx-auto bg-gray-100">
      <style jsx global>
        {globalStyle}
      </style>{" "}
      {/* Apply global styles */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Prescriptions</h1>
      {prescriptions.length === 0 && <p>No prescriptions found.</p>}
      <div className="grid grid-cols-1 gap-6">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.patientId}
            className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mx-auto border border-gray-200"
          >
            <h4 className=" font-medium text-gray-600 mb-4">
              Date:{" "}
              {new Date(prescription.appointmentDate).toLocaleDateString(
                "en-GB"
              )}
            </h4>
            <h4 className=" font-medium text-gray-600 mb-4">
              Doctor: Dr.{prescription.doctorName}
            </h4>
            <div className="mb-4 max-h-60 overflow-y-auto border-t border-gray-200">
              {prescription.medicines.length > 0 && (
                <div>
                  <div className="grid grid-cols-4 gap-4 text-sm font-semibold mb-2 border-b pb-2 text-gray-500">
                    <div>Drug</div>
                    <div>Dosage</div>
                    <div>Time</div>
                    <div>Days</div>
                  </div>
                  {prescription.medicines.slice(0, 2).map((medicine, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 text-sm mb-2"
                    >
                      <div className="text-gray-800">{medicine.name}</div>
                      <div className="text-gray-600">
                        {medicine.dosage.join(", ")}
                      </div>
                      <div className="text-gray-600">{medicine.time}</div>
                      <div className="text-gray-600">{medicine.days}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* View Full Prescription Button */}
            <button
              onClick={() => openModal(prescription)}
              className="text-blue-500 font-medium underline hover:text-blue-700 transition duration-300"
            >
              View Full Prescription
            </button>
          </div>
        ))}
      </div>
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <div className="relative">
            <div onClick={closeModal} className="flex justify-end">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#d1001f"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <Typography id="modal-title" variant="h6" component="h2">
              Prescription Details
            </Typography>
            {selectedPrescription && (
              <div className="mt-4">
                <Typography variant="body1">
                  <strong>Patient Name:</strong>{" "}
                  {selectedPrescription.patientName}
                </Typography>
                <Typography variant="body1">
                  <strong>Doctor Name:</strong>{" "}
                  {selectedPrescription.doctorName}
                </Typography>
                <Typography variant="body1" className="text-right">
                  <strong>Date:</strong>{" "}
                  {new Date(
                    selectedPrescription.appointmentDate
                  ).toLocaleDateString("en-GB")}
                </Typography>
                <h4 className="text-lg font-medium mb-2">Medicines</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Medicine
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Dosage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Days
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPrescription.medicines.map((medicine, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {medicine.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {medicine.dosage.join(", ")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {medicine.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {medicine.days}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Typography variant="body1" className="mt-4">
                  <strong>Note:</strong> {selectedPrescription.note}
                </Typography>
                <button
                  onClick={saveAsPDF}
                  className="btn rounded-3xl  border-slate-500 text-red-600 font-bold py-2 px-4 transition-all duration-300 hover:bg-slate-300 hover:text-red-600 hover:-translate-y-1 mt-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.5 2.5H6A1.5 1.5 0 004.5 4v16A1.5 1.5 0 006 21.5h12a1.5 1.5 0 001.5-1.5V8.5L12.5 2.5zM12 4.5L18.5 11H12V4.5zM19 20.5H5V5.5h6V10h8v10.5zM12 13h3v1.5h-3V13zM12 15h3v1.5h-3V15z"
                      clipRule="evenodd"
                    />
                  </svg>{" "}
                  Save as a PDF
                </button>
              </div>
            )}{" "}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PrescriptionPage;
