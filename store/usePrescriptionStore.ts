import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Medicine {
  name: string;
  dosage: string[];
  time: string;
  days: number;
}

interface Prescription {
  _id?: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  note: string;
  medicines: Medicine[];
  appointmentDate: string;
  slotId: string;
}

const https = axios.create({
  baseURL: "http://localhost:3000", // Adjust to your backend URL
});

interface PrescriptionState {
  prescriptions: Prescription[];
  fetchPrescriptions: (patientId: string) => Promise<void>;
  savePrescription: (prescription: Prescription) => Promise<void>;
  fetchPrescriptionsByDoctor: (doctorId: string) => Promise<void>;

}

export const usePrescriptionStore = create<PrescriptionState>()(
  devtools((set) => ({
    prescriptions: [],
    fetchPrescriptions: async (patientId) => {
      try {
        console.log(`Fetching prescriptions for patientId ${patientId}`);
        const response = await https.get(`/prescriptions/byPatient`, {
          params: { patientId },
        });
        set({ prescriptions: response.data });
        console.log("Fetched prescriptions successfully:", response.data);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      }
    },
    savePrescription: async (prescription) => {
      console.log(`Saving prescription: ${JSON.stringify(prescription)}`);
      console.log("Store Date", prescription.appointmentDate);
      try {
        const response = await https.post("/prescriptions/save", prescription);
        set((state) => ({
          prescriptions: [...state.prescriptions, response.data],
        }));
        console.log("Prescription saved successfully:", response.data);
      } catch (error) {
        console.error("Failed to save prescription:", error);
      }
    },

    fetchPrescriptionsByDoctor: async (doctorId) => {
      try {
        console.log(`Fetching prescriptions for doctorId ${doctorId}`);
        const response = await https.get(`/prescriptions/findPrescriptionByDoctorId/${doctorId}`, {
          params: { doctorId },
        });
        set({ prescriptions: response.data });
        console.log("Fetched prescriptions successfully:", response.data);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      }
    },


  }))

  //fetch prescriptions by doctorId


);
