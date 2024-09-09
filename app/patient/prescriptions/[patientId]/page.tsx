// "use client";
// import { useEffect, useState } from "react";
// import { useSearchParams, useParams } from "next/navigation";
// import { usePrescriptionStore } from "@/store/usePrescriptionStore";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import AddReportsToPrescriptionForm from "@/app/components/AddReportsToPrescriptionForm";
// import { GiOverdose } from "react-icons/gi";
// import { MdAccessTimeFilled } from "react-icons/md";

// // Define interfaces for Medicine and Prescription
// interface Medicine {
//   name: string;
//   dosage: string[];
//   time: string;
//   days: number;
// }

// interface Prescription {
//   patientId: string;
//   doctorId: string;
//   doctorName: string;
//   patientName: string;
//   note: string;
//   medicines: Medicine[];
//   appointmentDate: string;
// }

// // Include the "Baloo 2" font in your HTML or CSS file
// const globalStyle = `
//   @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700&display=swap');
//   body {
//     font-family: 'Baloo 2', cursive;
//   }
// `;

// const modalStyle = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "90%",
//   maxWidth: 800,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

// const PrescriptionPage = () => {
//   const params = useParams();
//   const patientId = params.patientId;
//   const { prescriptions, fetchPrescriptions } = usePrescriptionStore(
//     (state) => ({
//       prescriptions: state.prescriptions,
//       fetchPrescriptions: state.fetchPrescriptions,
//     })
//   );

//   const [selectedPrescription, setSelectedPrescription] =
//     useState<Prescription | null>(null);
//   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

//   //added reports modal is opened
//   const [addReportmodalIsOpen, setAddReportModalIsOpen] =
//     useState<boolean>(false);

//   useEffect(() => {
//     if (typeof patientId === "string") {
//       fetchPrescriptions(patientId)
//         .then(() => console.log("Prescription fetching completed"))
//         .catch((error) => console.error("Error in useEffect:", error));
//     } else {
//       console.log("Invalid patientId");
//     }
//   }, [patientId, fetchPrescriptions]);

//   const openModal = (prescription: Prescription) => {
//     setSelectedPrescription(prescription);
//     setModalIsOpen(true);
//   };

//   const openAddReportModal = (prescription: Prescription) => {
//     setSelectedPrescription(prescription);
//     setAddReportModalIsOpen(true);
//   };
//   const closeAddReportModal = () => {
//     setSelectedPrescription(null);
//     setAddReportModalIsOpen(false);
//   };

//   const closeModal = () => {
//     setSelectedPrescription(null);
//     setModalIsOpen(false);
//   };

//   const saveAsPDF = () => {
//     if (!selectedPrescription) return;

//     const doc = new jsPDF();
//     doc.setFont("Baloo 2", "normal"); // Set font for PDF
//     doc.setFontSize(16);
//     doc.text(`Patient Name: ${selectedPrescription.patientName}`, 10, 10);
//     doc.text(`Doctor Name: ${selectedPrescription.doctorName}`, 10, 20);
//     doc.text(
//       `Date: ${new Date(
//         selectedPrescription.appointmentDate
//       ).toLocaleDateString("en-GB")}`,
//       190,
//       10,
//       { align: "right" }
//     );

//     const tableColumn = ["Medicine", "Dosage", "Time", "Days"];
//     const tableRows = selectedPrescription.medicines.map((medicine) => [
//       medicine.name,
//       medicine.dosage.join(", "),
//       medicine.time,
//       medicine.days,
//     ]);

//     let finalY = 30;

//     autoTable(doc, {
//       startY: finalY,
//       head: [tableColumn],
//       body: tableRows,
//       theme: "grid",
//       margin: { top: 10 },
//       styles: {
//         cellPadding: 5,
//         fontSize: 10,
//         overflow: "linebreak",
//         font: "Baloo 2",
//       },
//       headStyles: {
//         fillColor: "#05998c", // Green header background
//         textColor: "#FFFFFF", // White text
//         fontStyle: "bold",
//         font: "Baloo 2", // Apply the font to headings
//       },
//       alternateRowStyles: {
//         fillColor: "#f2f2f2", // Light gray for alternating rows
//       },
//       columnStyles: {
//         0: { cellWidth: "auto" },
//         1: { cellWidth: "auto" },
//         2: { cellWidth: "auto" },
//         3: { cellWidth: "auto" },
//       },
//       didDrawPage: (data) => {
//         if (data.cursor) {
//           finalY = data.cursor.y; // Update finalY to the position after the table
//         }
//       },
//     });

//     // Use the updated finalY to position the note
//     doc.text(`Note: ${selectedPrescription.note}`, 10, finalY + 10);

//     doc.save("prescription.pdf");
//   };

//   return (
//     <div className="p-6 max-w-full mx-auto bg-gray-100">
//       <style jsx global>
//         {globalStyle}
//       </style>{" "}
//       {/* Apply global styles */}
//       <h1 className="text-4xl font-bold text-gray-800 mb-8">Prescriptions</h1>
//       {prescriptions.length === 0 && <p>No prescriptions found.</p>}
//       <div className="grid grid-cols-1 gap-6">
//         {prescriptions.map((prescription) => (
//           <div
//             key={prescription._id}
//             className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl mx-auto border border-gray-200"
//           >
//             <div className="flex items-center mb-4">
//               <svg
//                 id="Layer_1"
//                 data-name="Layer 1"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 122.88 121"
//                 className="w-6 h-6 mr-2 text-gray-600" // Adjust size and spacing
//               >
//                 <defs>
//                   <style>
//                     {`.cls-1{fill:#ef4136;}.cls-1,.cls-3,.cls-4,.cls-6{fill-rule:evenodd;}.cls-2{fill:gray;}.cls-3{fill:#fff;}.cls-4{fill:#c72b20;}.cls-5,.cls-6{fill:#1a1a1a;}`}
//                   </style>
//                 </defs>
//                 <title>calendar-color</title>
//                 <path
//                   className="cls-1"
//                   d="M11.52,6.67h99.84a11.57,11.57,0,0,1,11.52,11.52V44.94H0V18.19A11.56,11.56,0,0,1,11.52,6.67Zm24.79,9.75A9.31,9.31,0,1,1,27,25.73a9.31,9.31,0,0,1,9.31-9.31Zm49.79,0a9.31,9.31,0,1,1-9.31,9.31,9.31,9.31,0,0,1,9.31-9.31Z"
//                 />
//                 <path
//                   className="cls-2"
//                   d="M111.36,121H11.52A11.57,11.57,0,0,1,0,109.48V40H122.88v69.46A11.56,11.56,0,0,1,111.36,121Z"
//                 />
//                 <path
//                   className="cls-3"
//                   d="M12.75,117.31h97.38a9.1,9.1,0,0,0,9.06-9.06V40H3.69v68.23a9.09,9.09,0,0,0,9.06,9.06Z"
//                 />
//                 <path
//                   className="cls-4"
//                   d="M86.1,14.63a11.11,11.11,0,1,1-7.85,3.26l.11-.1a11.06,11.06,0,0,1,7.74-3.16Zm0,1.79a9.31,9.31,0,1,1-9.31,9.31,9.31,9.31,0,0,1,9.31-9.31Z"
//                 />
//                 <path
//                   className="cls-4"
//                   d="M36.31,14.63a11.11,11.11,0,1,1-7.85,3.26l.11-.1a11.08,11.08,0,0,1,7.74-3.16Zm0,1.79A9.31,9.31,0,1,1,27,25.73a9.31,9.31,0,0,1,9.31-9.31Z"
//                 />
//                 <path
//                   className="cls-5"
//                   d="M80.54,4.56C80.54,2,83,0,86.1,0s5.56,2,5.56,4.56V25.77c0,2.51-2.48,4.56-5.56,4.56s-5.56-2-5.56-4.56V4.56Z"
//                 />
//                 <path
//                   className="cls-5"
//                   d="M30.75,4.56C30.75,2,33.24,0,36.31,0s5.56,2,5.56,4.56V25.77c0,2.51-2.48,4.56-5.56,4.56s-5.56-2-5.56-4.56V4.56Z"
//                 />
//                 <path
//                   className="cls-6"
//                   d="M22,85.62H36a1.79,1.79,0,0,1,1.79,1.79v11.7A1.8,1.8,0,0,1,36,100.9H22a1.8,1.8,0,0,1-1.8-1.79V87.41A1.8,1.8,0,0,1,22,85.62Z"
//                 />
//                 <path
//                   className="cls-6"
//                   d="M54.58,85.62H68.64a1.79,1.79,0,0,1,1.79,1.79v11.7a1.8,1.8,0,0,1-1.79,1.79H54.58a1.8,1.8,0,0,1-1.79-1.79V87.41a1.8,1.8,0,0,1,1.79-1.79Z"
//                 />
//                 <path
//                   className="cls-6"
//                   d="M86.87,85.62h14.06a1.8,1.8,0,0,1,1.79,1.79v11.7a1.8,1.8,0,0,1-1.79,1.79H86.87a1.8,1.8,0,0,1-1.79-1.79V87.41a1.79,1.79,0,0,1,1.79-1.79Z"
//                 />
//                 <path
//                   className="cls-6"
//                   d="M22,56.42H36a1.8,1.8,0,0,1,1.79,1.8V69.91A1.8,1.8,0,0,1,36,71.7H22a1.8,1.8,0,0,1-1.8-1.79V58.22a1.81,1.81,0,0,1,1.8-1.8Z"
//                 />
//                 <path
//                   className="cls-6"
//                   d="M54.58,56.42H68.64a1.8,1.8,0,0,1,1.79,1.8V69.91a1.8,1.8,0,0,1-1.79,1.79H54.58a1.79,1.79,0,0,1-1.79-1.79V58.22a1.8,1.8,0,0,1,1.79-1.8Z"
//                 />
//                 <path
//                   className="cls-6"
//                   d="M86.87,56.42h14.06a1.8,1.8,0,0,1,1.79,1.8V69.91a1.8,1.8,0,0,1-1.79,1.79H86.87a1.79,1.79,0,0,1-1.79-1.79V58.22a1.8,1.8,0,0,1,1.79-1.8Z"
//                 />
//               </svg>
//               <h4 className="flex items-center font-medium text-gray-600 mb-4">
//                 {/* Date */}
//                 Date:{" "}
//                 {new Date(prescription.appointmentDate).toLocaleDateString(
//                   "en-GB"
//                 )}
//               </h4>
//             </div>

//             <h4 className=" font-medium text-gray-600 mb-4">
//               Doctor: Dr.{prescription.doctorName}
//             </h4>
//             <div className="mb-4 max-h-60 overflow-y-auto border-t border-gray-200">
//               {prescription.medicines.length > 0 && (
//                 <div>
//                   <div className="grid grid-cols-4 gap-4 text-sm font-semibold mb-2 border-b pb-2 text-gray-500">
//                     <div>Medicine</div>
//                     <div>Dosage</div>
//                     <div>Time</div>
//                     <div>Days</div>
//                   </div>
//                   {prescription.medicines.slice(0, 2).map((medicine, index) => (
//                     <div
//                       key={index}
//                       className="grid grid-cols-4 gap-4 text-sm mb-2"
//                     >
//                       <div className="text-gray-800">{medicine.name}</div>
//                       <div className="text-gray-600">
//                         {medicine.dosage.join(", ")}
//                       </div>
//                       <div className="text-gray-600">{medicine.time}</div>
//                       <div className="text-gray-600">{medicine.days}</div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             {/* View Full Prescription Button */}
//             <button
//               onClick={() => openModal(prescription)}
//               className="text-blue-500 font-medium underline hover:text-blue-700 transition duration-300"
//             >
//               View Full Prescription
//             </button>

//             <button
//               onClick={() => openAddReportModal(prescription)}
//               className="text-blue-500 ml-8 font-medium underline hover:text-blue-700 transition duration-300"
//             >
//               Add Report
//             </button>
//           </div>
//         ))}
//       </div>
//       <Modal
//         open={modalIsOpen}
//         onClose={closeModal}
//         aria-labelledby="modal-title"
//         aria-describedby="modal-description"
//       >
//         <Box sx={modalStyle}>
//           <div className="relative">
//             <div onClick={closeModal} className="flex justify-end">
//               <button>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="#d1001f"
//                   className="w-5 h-5"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <Typography id="modal-title" variant="h6" component="h2">
//               Prescription Details
//             </Typography>
//             {selectedPrescription && (
//               <div className="mt-4">
//                 <Typography variant="body1">
//                   <strong>Patient Name:</strong>{" "}
//                   {selectedPrescription.patientName}
//                 </Typography>
//                 <Typography variant="body1">
//                   <strong>Doctor Name:</strong>{" "}
//                   {selectedPrescription.doctorName}
//                 </Typography>
//                 <Typography variant="body1" className="text-right">
//                   <strong>Date:</strong>{" "}
//                   {new Date(
//                     selectedPrescription.appointmentDate
//                   ).toLocaleDateString("en-GB")}
//                 </Typography>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
//                           <div
//                             style={{ display: "flex", alignItems: "center" }}
//                           >
//                             <svg
//                               data-name="Layer 1"
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 128 128"
//                               width="2em" // Adjusts dynamically with the font size
//                               height="2em"
//                               className="ml-2"
//                               style={{ flexShrink: 0 }} // Prevents the icon from shrinking
//                             >
//                               <path d="M61.748 70.68h-4.914v-4.914a1.749 1.749 0 0 0-1.75-1.75h-8.649a1.75 1.75 0 0 0-1.75 1.75v4.914h-4.913a1.75 1.75 0 0 0-1.75 1.75v8.648a1.75 1.75 0 0 0 1.75 1.75h4.913v4.913a1.75 1.75 0 0 0 1.75 1.75h8.649a1.749 1.749 0 0 0 1.75-1.75v-4.913h4.914a1.75 1.75 0 0 0 1.75-1.75V72.43a1.75 1.75 0 0 0-1.75-1.75zM60 79.328h-4.916a1.75 1.75 0 0 0-1.75 1.75v4.913h-5.149v-4.913a1.75 1.75 0 0 0-1.75-1.75h-4.913V74.18h4.913a1.751 1.751 0 0 0 1.75-1.75v-4.914h5.149v4.914a1.751 1.751 0 0 0 1.75 1.75H60z" />
//                               <path d="M97.694 93.58H82.223V45.986a8.531 8.531 0 0 0-6.712-8.3l-1.93-.414a5.014 5.014 0 0 1-3.945-4.872v-4.633h3.975a1.75 1.75 0 0 0 1.75-1.75V14.146a1.75 1.75 0 0 0-1.75-1.75h-45.7a1.751 1.751 0 0 0-1.75 1.75v11.871a1.751 1.751 0 0 0 1.75 1.75h3.975V32.4a5.013 5.013 0 0 1-3.944 4.877l-1.931.414a8.53 8.53 0 0 0-6.712 8.3v61.129a8.5 8.5 0 0 0 8.488 8.489h45.948a8.483 8.483 0 0 0 3.379-.712 10.919 10.919 0 0 0 3.847.708h16.733a11.01 11.01 0 0 0 0-22.02zM22.8 59.924h55.923v33.66H22.8zM29.658 15.9h42.2v8.371h-42.2zm-2.917 25.208 1.93-.413a8.529 8.529 0 0 0 6.712-8.3v-4.628h30.753V32.4a8.53 8.53 0 0 0 6.713 8.3l1.929.413a5.016 5.016 0 0 1 3.945 4.878v10.433H22.8V45.986a5.015 5.015 0 0 1 3.941-4.878zM22.8 107.115V97.084h50.134a10.942 10.942 0 0 0 0 15.02h-45.15a4.994 4.994 0 0 1-4.984-4.989zm50.655-2.525a7.528 7.528 0 0 1 7.51-7.51h6.622v15.02h-6.626a7.519 7.519 0 0 1-7.51-7.51zm29.563 5.311a7.5 7.5 0 0 1-5.32 2.2h-6.615V97.08h6.611a7.517 7.517 0 0 1 5.32 12.821z" />
//                             </svg>
//                             <span
//                               className="align-middle"
//                               style={{
//                                 verticalAlign: "middle",
//                                 // fontSize: "1rem", // Dynamically scalable font size
//                                 marginLeft: "0.5rem",
//                               }}
//                             >
//                               Medicine
//                             </span>
//                           </div>
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center space-x-2">
//                           <GiOverdose className="text-3xl text-blue-500" />
//                           <span>Dosage</span>
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
//                           <span
//                             className="inline-block align-middle mr-2"
//                             style={{ verticalAlign: "middle" }}
//                           >
//                             <MdAccessTimeFilled className="text-xl text-red-500" />
//                           </span>
//                           <span
//                             className="align-middle"
//                             style={{ verticalAlign: "middle" }}
//                           >
//                             Time
//                           </span>
//                         </th>

//                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
//                           <span
//                             className="inline-block align-middle mr-2"
//                             style={{ verticalAlign: "middle" }}
//                           >
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 64 64"
//                               height={28}
//                               width={28}
//                             >
//                               <path
//                                 style={{ fill: "#bbcaea" }}
//                                 d="M2 63v-6h49l11-11v17H2z"
//                               />
//                               <path
//                                 style={{ fill: "#e6ecff" }}
//                                 d="M2 57V5h60v41L51 57H2z"
//                               />
//                               <path
//                                 style={{ fill: "#f25757" }}
//                                 d="M2 5h60v14H2z"
//                               />
//                               <circle
//                                 cx="11"
//                                 cy="12"
//                                 r="3"
//                                 style={{ fill: "#d63434" }}
//                               />
//                               <circle
//                                 cx="25"
//                                 cy="12"
//                                 r="3"
//                                 style={{ fill: "#d63434" }}
//                               />
//                               <circle
//                                 cx="39"
//                                 cy="12"
//                                 r="3"
//                                 style={{ fill: "#d63434" }}
//                               />
//                               <circle
//                                 cx="53"
//                                 cy="12"
//                                 r="3"
//                                 style={{ fill: "#d63434" }}
//                               />
//                               <path
//                                 style={{ fill: "#f25757" }}
//                                 d="M29 35h6v6h-6zM29 46h6v6h-6zM29 24h6v6h-6zM18 35h6v6h-6zM18 46h6v6h-6zM18 24h6v6h-6zM7 35h6v6H7zM7 46h6v6H7zM7 24h6v6H7zM40 35h6v6h-6zM40 46h6v6h-6zM40 24h6v6h-6zM51 35h6v6h-6zM51 24h6v6h-6z"
//                               />
//                               <path
//                                 style={{ fill: "#d0dbf7" }}
//                                 d="M51 46v11l11-11H51z"
//                               />
//                               <path
//                                 d="M62 4h-8V1a1 1 0 0 0-2 0v3H40V1a1 1 0 0 0-2 0v3H26V1a1 1 0 0 0-2 0v3H12V1a1 1 0 0 0-2 0v3H2a1 1 0 0 0-1 1v58a1 1 0 0 0 1 1h60a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM3 20h58v25H51a1 1 0 0 0-1 1v10H3zm49 27h7.586L52 54.586zM10 6v2.142a4 4 0 1 0 2 0V6h12v2.142a4 4 0 1 0 2 0V6h12v2.142a4 4 0 1 0 2 0V6h12v2.142a4 4 0 1 0 2 0V6h7v12H3V6zm1 7a1 1 0 0 0 1-1v-1.722a2 2 0 1 1-2 0V12a1 1 0 0 0 1 1zm14 0a1 1 0 0 0 1-1v-1.722a2 2 0 1 1-2 0V12a1 1 0 0 0 1 1zm14 0a1 1 0 0 0 1-1v-1.722a2 2 0 1 1-2 0V12a1 1 0 0 0 1 1zm14 0a1 1 0 0 0 1-1v-1.722a2 2 0 1 1-2 0V12a1 1 0 0 0 1 1zM3 62v-4h48a1.003 1.003 0 0 0 .707-.293L61 48.414V62z"
//                                 style={{ fill: "#231e23" }}
//                               />
//                               <path
//                                 d="M35 34h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM35 45h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM35 23h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM24 34h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM24 45h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM24 23h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM13 34H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6H8v-4h4zM13 45H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6H8v-4h4zM13 23H7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6H8v-4h4zM46 34h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM46 45h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM46 23h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM57 34h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4zM57 23h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4z"
//                                 style={{ fill: "#231e23" }}
//                               />
//                             </svg>
//                           </span>

//                           <span
//                             className="align-middle"
//                             style={{ verticalAlign: "middle" }}
//                           >
//                             Days
//                           </span>
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {selectedPrescription.medicines.map((medicine, index) => (
//                         <tr key={index}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {medicine.name}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {medicine.dosage.join(", ")}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {medicine.time}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {medicine.days}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <Typography variant="body1" className="mt-4">
//                   <strong>Note:</strong> {selectedPrescription.note}
//                 </Typography>
//                 <button
//                   onClick={saveAsPDF}
//                   className="btn rounded-3xl  border-slate-500 text-red-600 font-bold py-2 px-4 transition-all duration-300 hover:bg-slate-300 hover:text-red-600 hover:-translate-y-1 mt-3"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     className="w-6 h-6"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M12.5 2.5H6A1.5 1.5 0 004.5 4v16A1.5 1.5 0 006 21.5h12a1.5 1.5 0 001.5-1.5V8.5L12.5 2.5zM12 4.5L18.5 11H12V4.5zM19 20.5H5V5.5h6V10h8v10.5zM12 13h3v1.5h-3V13zM12 15h3v1.5h-3V15z"
//                       clipRule="evenodd"
//                     />
//                   </svg>{" "}
//                   Save as a PDF
//                 </button>
//               </div>
//             )}{" "}
//           </div>
//         </Box>
//       </Modal>
//       <AddReportsToPrescriptionForm
//         prescription={selectedPrescription ? selectedPrescription : undefined}
//         onClose={closeAddReportModal}
//         isOpen={addReportmodalIsOpen}
//       />
//     </div>
//   );
// };

// export default PrescriptionPage;

// pages/patient/prescription/[patientId]/page.tsx\
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Box, Button, Modal, Typography } from "@mui/material";
import { usePrescriptionStore } from "@/store/usePrescriptionStore";
import { FaSearch } from "react-icons/fa";
import { TbReportMedical } from "react-icons/tb";
import AddReportsToPrescriptionForm from "@/app/components/AddReportsToPrescriptionForm";
import { MdAccessTimeFilled } from "react-icons/md";
import { GiOverdose } from "react-icons/gi";
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

const PrescriptionPage = () => {
  const params = useParams();
  const patientId = params.patientId;
  const { prescriptions, fetchPrescriptions } = usePrescriptionStore(
    (state) => ({
      prescriptions: state.prescriptions,
      fetchPrescriptions: state.fetchPrescriptions,
    })
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);

  const handleOpenModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPrescription(null);
  };

  useEffect(() => {
    if (typeof patientId === "string") {
      fetchPrescriptions(patientId)
        .then(() => console.log("Prescription fetching completed"))
        .catch((error) => console.error("Error in useEffect:", error));
    } else {
      console.log("Invalid patientId");
    }
  }, [patientId, fetchPrescriptions]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const openModal = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPrescription(null);
    setIsModalOpen(false);
  };
  // Filter prescriptions based on search term and selected date
  const filteredPrescriptions = prescriptions
    .filter((prescription) =>
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((prescription) => {
      if (!selectedDate) return true;
      const appointmentDate = new Date(
        prescription.appointmentDate
      ).toLocaleDateString("en-GB");
      return (
        appointmentDate === new Date(selectedDate).toLocaleDateString("en-GB")
      );
    });

  // Sort prescriptions by date in descending order
  const sortedPrescriptions = filteredPrescriptions.sort(
    (a, b) =>
      new Date(b.appointmentDate).getTime() -
      new Date(a.appointmentDate).getTime()
  );

  const saveAsPDF = (prescription: Prescription) => {
    const doc = new jsPDF();
    doc.setFont("Baloo 2", "normal");
    doc.setFontSize(16);
    doc.text(`Patient Name: ${prescription.patientName}`, 10, 10);
    doc.text(`Doctor Name: ${prescription.doctorName}`, 10, 20);
    doc.text(
      `Date: ${new Date(prescription.appointmentDate).toLocaleDateString(
        "en-GB"
      )}`,
      190,
      10,
      { align: "right" }
    );

    const tableColumn = ["Medicine", "Dosage", "Time", "Days"];
    const tableRows = prescription.medicines.map((medicine) => [
      medicine.name,
      medicine.dosage.join(", "),
      medicine.time,
      medicine.days,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { font: "Baloo 2", fontSize: 10 },
      headStyles: {
        fillColor: "#05998c",
        textColor: "#FFF",
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: "#f2f2f2" },
    });

    doc.text(`Note: ${prescription.note}`, 10, 90);
    doc.save(`prescription-${prescription.patientId}.pdf`);
  };

  const handlePrint = (prescription: Prescription) => {
    const printWindow = window.open("", "_blank");

    if (printWindow) {
      const htmlContent = `
        <html>
        <head>
          <style>
            body { font-family: "Baloo 2", sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Prescription</h1>
          <p>Patient Name: ${prescription.patientName}</p>
          <p>Doctor Name: ${prescription.doctorName}</p>
          <p>Date: ${new Date(prescription.appointmentDate).toLocaleDateString(
            "en-GB"
          )}</p>
          
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Time</th>
                <th>Days</th>
              </tr>
            </thead>
            <tbody>
              ${prescription.medicines
                .map(
                  (medicine) => `
                <tr>
                  <td>${medicine.name}</td>
                  <td>${medicine.dosage.join(", ")}</td>
                  <td>${medicine.time}</td>
                  <td>${medicine.days}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          
          <p>Note: ${prescription.note}</p>
        </body>
        </html>
      `;

      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="container mx-auto p-4 mt-16">
      {/* Search and Date Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        {/* Search Bar */}
        <div className="flex-1 flex justify-end">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 pl-10 border rounded-lg w-full"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Date Picker */}
        <input
          type="date"
          className="border rounded p-2 ml-4"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      {/* Prescriptions List */}
      {sortedPrescriptions.map((prescription, index) => (
        <div
          key={index}
          className="bg-white shadow-lg hover:shadow-2xl transform transition-transform duration-300 ease-in-out hover:scale-105 rounded-lg p-6 mb-6 flex flex-col sm:flex-row justify-between items-start mt-15"
        >
          {/* Content Section */}
          <div className="w-full sm:w-3/4 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
              <Typography variant="body1">
                Doctor Name: {prescription.doctorName}
              </Typography>
              <Typography variant="body1" className="text-right mt-2 sm:mt-0">
                Date:{" "}
                {new Date(prescription.appointmentDate).toLocaleDateString(
                  "en-GB"
                )}
              </Typography>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      <div style={{ display: "flex", alignItems: "center" }}>
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
                      </span>{" "}
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
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
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
                          <path style={{ fill: "#f25757" }} d="M2 5h60v14H2z" />
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
                        Days
                      </span>{" "}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prescription.medicines.map((medicine, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {medicine.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {medicine.dosage.join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {medicine.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {medicine.days}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Typography variant="body1" className="mt-4">
              Note: {prescription.note}
            </Typography>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 mt-4 sm:mt-0">
            <button
              onClick={() => handlePrint(prescription)}
              className="btn rounded-3xl bg-teal-600 border-slate-500 text-white font-bold py-1.5 px-4 transition-all duration-300 hover:bg-teal-800 hover:text-white hover:-translate-y-1 mt-3"
            >
              Print
            </button>
            <button
              color="secondary"
              onClick={() => saveAsPDF(prescription)}
              className="btn rounded-3xl border-slate-500 text-teal-600 font-bold py-1.5 px-4 transition-all duration-300 hover:bg-slate-300 hover:text-teal-600 hover:-translate-y-1 mt-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-red-600"
              >
                <path
                  fillRule="evenodd"
                  d="M12.5 2.5H6A1.5 1.5 0 004.5 4v16A1.5 1.5 0 006 21.5h12a1.5 1.5 0 001.5-1.5V8.5L12.5 2.5zM12 4.5L18.5 11H12V4.5zM19 20.5H5V5.5h6V10h8v10.5zM12 13h3v1.5h-3V13zM12 15h3v1.5h-3V15z"
                  clipRule="evenodd"
                />
              </svg>
              Save as PDF
            </button>
            <button
              color="secondary"
              onClick={() => openModal(prescription)}
              className="btn rounded-3xl border-slate-500 text-teal-600 font-bold py-1.5 px-4 transition-all duration-300 hover:bg-slate-300 hover:text-teal-600 hover:-translate-y-1 mt-3"
            >
              <TbReportMedical className="text-xl text-green-500" />
              Add Report
            </button>
          </div>
        </div>
      ))}
      <div>
        <AddReportsToPrescriptionForm
          prescription={selectedPrescription ? selectedPrescription : undefined}
          onClose={closeModal}
          isOpen={isModalOpen}
        />
      </div>
    </div>
  );
};

export default PrescriptionPage;
