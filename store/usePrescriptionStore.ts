//

import axios from "axios";
import create from "zustand";
import { devtools } from "zustand/middleware";

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
  appointmentDate: string; // Add appointmentDate field
  slotId: string; // Add slotId field
}
const https = axios.create({
  baseURL: "http://localhost:3000", // Adjust if necessary
});

interface PrescriptionState {
  prescriptions: Prescription[];
  savePrescription: (prescription: Prescription) => Promise<void>;
}

export const usePrescriptionStore = create<PrescriptionState>()(
  devtools((set) => ({
    prescriptions: [],
    savePrescription: async (prescription) => {
      console.log(`saving a prescription ${JSON.stringify(prescription)}`);
      try {
        // Assuming you have an API endpoint to save the prescription
        const response = await https.post("/prescriptions/save", prescription);

        set((state) => ({
          prescriptions: [...state.prescriptions, prescription],
        }));

        console.log("Prescription saved successfully:", response.data);
      } catch (error) {
        console.error("Failed to save prescription:", error);
      }
    },
  }))
);
