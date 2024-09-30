import axios from "axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import useLoginStore from "./useLoginStore";
import { headers } from "next/headers";

export interface Medicine {
  name: string;
  dosage: string[];
  time: string;
  days: number;
}

export interface Prescription {
  _id?: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  note: string;
  report?: Report[];
  medicines: Medicine[];
  appointmentDate: string;
  slotId: string;
}
export interface Report {
  _id: string;
  reportName: string;
  uploadReport: string;
  type: string;
  doctor?: { _id: string; name: string };
  appointmentDate?: Date;
  date: Date;
  patient: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}
const https = axios.create({
  baseURL: "http://localhost:3000", // Adjust to your backend URL
});

const token = useLoginStore.getState().token;

interface PrescriptionState {
  prescriptions: Prescription[];
  patients: Record<string, any>; // Store patient details

  fetchPrescriptions: (patientId: string) => Promise<void>;
  savePrescription: (prescription: Prescription) => Promise<void>;
  fetchPrescriptionsByDoctor: (doctorId: string) => Promise<void>;
  fetchPatientById: (patientId: string) => Promise<any>; // Add a return type for fetching patient

  fetchPrescriptionsByPatientAndDoctor: (
    patientId: string,
    doctorId: string
  ) => Promise<void>;
  fetchPrescriptionsForSlot: (slotId: string) => Promise<void>; // New method
}

export const usePrescriptionStore = create<PrescriptionState>()(
  devtools((set, get) => ({
    prescriptions: [],
    patients: {},
    fetchPrescriptions: async (patientId) => {
      try {

        console.log(`Fetching prescriptions for patientId ${patientId}`);
        const response = await https.get(`/prescriptions/byPatient`, {
          params: { patientId },
          headers: { Authorization: `Bearer ${token}` },
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

        const response = await https.post("/prescriptions/save", prescription, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        const response = await https.get(
          `/prescriptions/findPrescriptionByDoctorId/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        set({ prescriptions: response.data });
        console.log("Fetched prescriptions successfully:", response.data);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      }
    },
    fetchPatientById: async (patientId) => {
      const { patients } = get();

      // Check if patient data is already available in the store
      if (patients[patientId]) {
        return patients[patientId];
      }

      try {

        const response = await https.get(`/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const patientData = response.data;

        // Store the patient data in the state
        set((state) => ({
          patients: { ...state.patients, [patientId]: patientData },
        }));

        console.log(`Fetched patient details for patientId ${patientId}`);
        return patientData;
      } catch (error) {
        console.error("Failed to fetch patient details:", error);
        throw error;
      }
    },

    fetchPrescriptionsByPatientAndDoctor: async (patientId, doctorId) => {
      try {
        console.log(
          `Fetching prescriptions for patientId ${patientId} and doctorId ${doctorId}`
        );

        const response = await https.get(
          `/prescriptions/findPrescriptionByPatientAndDoctor`,
          {
            params: { patientId, doctorId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        set({ prescriptions: response.data });
        console.log("Fetched prescriptions successfully:", response.data);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      }
    },

    fetchPrescriptionsForSlot: async (slotId) => {
      try {
        const token = useLoginStore.getState().token;
        console.log(`Fetching prescriptions for slotId ${slotId}`);
        const response = await https.get(
          `/prescriptions/findPrescriptionBySlotId/${slotId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }
        );
        set({ prescriptions: response.data });
        console.log(
          "Fetched prescriptions for slot successfully:",
          response.data
        );
        return response.data; // Return the fetched data
      } catch (error) {
        console.error("Failed to fetch prescriptions for slot:", error);
        throw error; // Re-throw the error to handle it in the component
      }
    },
  }))
);
