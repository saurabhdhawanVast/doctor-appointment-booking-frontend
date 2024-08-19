import { create } from "zustand";
import axios from "axios";

export interface Doctor {
  _id: string;
  name: string;
  gender: string;
  email: string;
  profilePic: string;
  password: string;
  speciality: string;
  qualification: string;
  registrationNumber: string;
  yearOfRegistration: string;
  stateMedicalCouncil: string;
  bio: string;
  document: string;
  clinicAddress: string;
  contactNumber: string;
  clinicDetails?: {
    clinicName?: string;
    clinicAddress?: string;
    city?: string;
    state?: string;
  };
  city: string;
  state: string;
  pinCode: number;
  clinicName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  morningStartTime: string;
  morningEndTime: string;
  eveningStartTime: string;
  eveningEndTime: string;
  slotDuration: number;
  isVerified: boolean;
}

interface DoctorStoreState {
  doctors: Doctor[];
  totalDoctors: number;
  doctor: Doctor | null;
  currentPage: number;
  totalPages: number;
  fetchDoctors: (
    status: "all" | "verified" | "unverified",
    page: number,
    pageSize: number
  ) => Promise<void>;
  fetchDoctorProfile: (id: string) => Promise<void>;
  verifyDoctor: (id: string) => Promise<void>;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

const useDoctorStore = create<DoctorStoreState>((set) => ({
  doctors: [],
  totalDoctors: 0,
  doctor: null,
  currentPage: 1,
  totalPages: 1,

  fetchDoctors: async (
    status: "all" | "verified" | "unverified",
    page: number,
    pageSize: number
  ) => {
    try {
      const response = await axiosInstance.get("/doctors/getAllDoctors-Admin", {
        params: {
          status,
          page,
          pageSize,
        },
      });

      set({
        doctors: response.data.doctors,
        totalDoctors: response.data.total,
        currentPage: page,
        totalPages: Math.ceil(response.data.total / pageSize),
      });
    } catch (error) {
      console.error(`Error fetching doctors: ${error}`);
    }
  },

  fetchDoctorProfile: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/doctors/getDoctorById/${id}`);
      set({ doctor: response.data });
    } catch (error) {
      console.error(`Error fetching doctor profile: ${error}`);
    }
  },

  verifyDoctor: async (id: string) => {
    try {
      console.log("inside verify doctor");
      await axiosInstance.post(`/doctors/${id}/verify`);
      set((state) => ({
        doctors: state.doctors.map((doc) =>
          doc._id === id ? { ...doc, isVerified: true } : doc
        ),
        doctor:
          state.doctor && state.doctor._id === id
            ? { ...state.doctor, isVerified: true }
            : state.doctor,
      }));
    } catch (error) {
      console.error(`Error verifying doctor: ${error}`);
    }
  },
}));

export default useDoctorStore;
