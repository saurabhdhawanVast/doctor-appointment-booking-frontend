import { create } from "zustand";
import axios from "axios";
// import useLoginStore, { Patient } from "@/store/useLoginStore";
import { toast } from "react-toastify";
import useLoginStore from "./useLoginStore";
import { Doctor } from "./useDoctorStore";
import { Prescription } from "./usePrescriptionStore";

export interface Patients {
  _id: string;
  user: string;
  name: string;
  contactNumber: string;
  address: Address;
  bloodGroup: string;
  gender: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

interface Address {
  address: string;
  city: string;
  pinCode: number;
  state: string;
}

interface PatientState {
  patient: Patients | null;
  patients: Patients[] | null;
  doctors: Doctor[] | null;
  setPatient: (patient: Patients) => void;
  fetchPatient: (id: string) => void;
  updateProfile: (patient: Partial<Patients>) => void;
  deletePatient: (id: string) => void;
  fetchPatientByUserId: (userId: string) => void;
  allPatients: () => Promise<void>;
  prescriptions: Prescription[] | null;
  fetchPrescriptionsByDoctor: (doctorId: string, page: number) => Promise<void>;
  searchDoctors: (
    state: string,
    city: string,
    specialty?: string,
    gender?: string,
    radius?: number,
    location?: [number, number]
  ) => Promise<void>;
}
const https = axios.create({
  baseURL: "http://localhost:3000",
});

const token = useLoginStore.getState().token;
export const usePatientStore = create<PatientState>((set) => ({
  patient: null,
  doctors: null,
  patients: null,
  prescriptions: null,

  setPatient: (patient) => set({ patient }),

  fetchPatient: async (id: string) => {
    try {
      const response = await https.get(`/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ patient: response.data });
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  },
  updateProfile: async (patient) => {
    try {
      let patientId = patient._id;
      delete patient._id;
      console.log("patient", patient);
      let result = await https.patch(`/patients/${patientId}`, patient, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ patient: result.data });
      useLoginStore.getState().setPatient(result.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },

  deletePatient: async (id: string) => {
    try {
      await https.delete(`/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        patients:
          state.patients?.filter((patient) => patient._id !== id) || null,
      }));
      toast.success("Patient deleted successfully");
    } catch (error) {
      toast.error("Error deleting patient");
    }
  },

  fetchPrescriptionsByDoctor: async (doctorId, page) => {
    try {
      const response = await https.get(
        `/prescriptions/findPrescriptionByDoctorId/${doctorId}`,
        {
          params: { page, limit: 10 }, // Implement pagination
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const prescriptions = response.data;
      console.log(prescriptions);

      const uniquePatientIds = Array.from(
        new Set(prescriptions.map((p: Prescription) => p.patientId))
      );
      // Fetch patient details for unique patients
      console.log(uniquePatientIds);
      const patients = await Promise.all(
        uniquePatientIds.map(async (id) => {
          const patientResponse = await axios.get(
            `http://localhost:3000/patients/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return patientResponse.data;
        })
      );

      set({ prescriptions, patients });
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  },
  searchDoctors: async (state, city, specialty, gender, radius, location) => {
    console.log(
      `Patient Store: state: ${state}, city: ${city}, specialty: ${specialty},gender: ${gender}, radius: ${radius}, location: ${location}`
    );
    try {
      const response = await https.get(`/doctors/search`, {
        params: { state, city, specialty, gender, radius, location },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ doctors: response.data }); // Set the doctors in the store
      return response.data; // Return the fetched doctors
    } catch (error) {
      console.error("Error searching for doctors:", error);
      return []; // Return an empty array in case of an error
    }
  },

  fetchPatientByUserId: async (userId: string) => {
    try {
      const response = await https.get(
        `patients/fetchPatientByUserId/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ patient: response.data });
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  },

  allPatients: async () => {
    try {
      const response = await https.get("patients/allPatients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ patients: response.data });
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  },
}));
