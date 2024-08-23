"use client";
import React, { useState } from "react";

// Mock functions to simulate data fetching
const fetchDoctorDetails = async () => {
  // Simulate fetching doctor details
  return { name: "Dr. John Doe", clinic: "Health Clinic" };
};

const fetchPatientName = async (patientId: string) => {
  // Simulate fetching patient details
  return { name: "Jane Smith" };
};

interface PrescriptionProps {
  doctorName: string;
  clinicName: string;
  patientName: string;
}

// Server-side component for adding prescription
const AddPrescription = async ({
  params,
}: {
  params: { patientId: string };
}) => {
  const doctorDetails = await fetchDoctorDetails();
  const patientDetails = await fetchPatientName(params.patientId);

  const [prescriptions, setPrescriptions] = useState<
    { medicine: string; dosage: string; time: string; days: number }[]
  >([]);
  const [newPrescription, setNewPrescription] = useState({
    medicine: "",
    dosage: "morning",
    time: "before meal",
    days: 1,
  });

  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, newPrescription]);
    setNewPrescription({
      medicine: "",
      dosage: "morning",
      time: "before meal",
      days: 1,
    });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Add Prescription</h1>
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">{doctorDetails.name}</h2>
            <p className="text-gray-600">{doctorDetails.clinic}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Patient:</h2>
            <p className="text-gray-600">{patientDetails.name}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Prescription Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Medicine Name</label>
            <input
              type="text"
              value={newPrescription.medicine}
              onChange={(e) =>
                setNewPrescription({
                  ...newPrescription,
                  medicine: e.target.value,
                })
              }
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4 flex justify-between">
            <div className="w-1/3">
              <label className="block text-gray-700">Dosage</label>
              <select
                value={newPrescription.dosage}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    dosage: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="night">Night</option>
              </select>
            </div>
            <div className="w-1/3">
              <label className="block text-gray-700">Time</label>
              <select
                value={newPrescription.time}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    time: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="before meal">Before Meal</option>
                <option value="after meal">After Meal</option>
              </select>
            </div>
            <div className="w-1/3">
              <label className="block text-gray-700">Days</label>
              <input
                type="number"
                value={newPrescription.days}
                onChange={(e) =>
                  setNewPrescription({
                    ...newPrescription,
                    days: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full p-2 border rounded-md"
                min="1"
              />
            </div>
          </div>

          <button
            onClick={handleAddPrescription}
            className="bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Add Prescription
          </button>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Added Prescriptions</h4>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border p-2">Medicine Name</th>
                  <th className="border p-2">Dosage</th>
                  <th className="border p-2">Time</th>
                  <th className="border p-2">Days</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription, index) => (
                  <tr key={index}>
                    <td className="border p-2">{prescription.medicine}</td>
                    <td className="border p-2">{prescription.dosage}</td>
                    <td className="border p-2">{prescription.time}</td>
                    <td className="border p-2">{prescription.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page component with dynamic route support
export default async function Page({
  params,
}: {
  params: { patientId: string };
}) {
  return <AddPrescription params={params} />;
}
