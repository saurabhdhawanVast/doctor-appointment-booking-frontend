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
  report?: Report[];
  medicines: Medicine[];
  appointmentDate: string;
  slotId: string;
}
interface Report {
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

interface PrescriptionState {
  prescriptions: Prescription[];
  fetchPrescriptions: (patientId: string) => Promise<void>;
  savePrescription: (prescription: Prescription) => Promise<void>;
  fetchPrescriptionsByDoctor: (doctorId: string) => Promise<void>;
  fetchPrescriptionsByPatientAndDoctor: (
    patientId: string,
    doctorId: string
  ) => Promise<void>;
  fetchPrescriptionsForSlot: (slotId: string) => Promise<void>; // New method
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
        const prescriptions = response.data;
        const reportsData = [];
        for (const prescription of prescriptions) {
          const query = {
            patient: prescription.patientId,
            doctor: prescription.doctorId,
            appointmentDate: prescription.appointmentDate,
          };
          const queryString = new URLSearchParams({
            filter: JSON.stringify(query),
          }).toString();

          try {
            const reportResponse = await axios.get(
              `http://localhost:3000/reports?${queryString}`
            );
            console.log("reportResponse", reportResponse.data);
            prescription.report = reportResponse.data;
          } catch (reportError) {
            console.error(
              `Failed to fetch report for prescription ${prescription._id}:`,
              reportError
            );
          }
        }
        set({ prescriptions: prescriptions });
        console.log("Fetched prescriptions successfully:", prescriptions);
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
        const response = await https.get(
          `/prescriptions/findPrescriptionByDoctorId/${doctorId}`
        );
        set({ prescriptions: response.data });
        console.log("Fetched prescriptions successfully:", response.data);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
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
        console.log(`Fetching prescriptions for slotId ${slotId}`);
        const response = await https.get(
          `/prescriptions/findPrescriptionBySlotId/${slotId}`
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
