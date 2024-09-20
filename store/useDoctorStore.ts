import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

export interface DoctorStoreState {
  // isReviewModelOpen: any;
  doctors: Doctor[];
  doctor: Doctor;
  fetchDoctors: () => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
}

export interface Doctor {
  _id: string;
  name: string;
  gender: string;
  email: string;
  profilePic: string;
  password: string;
  speciality: string;
  avgRating: number;
  qualification: string;
  registrationNumber: string;
  yearOfRegistration: string;
  stateMedicalCouncil: string;
  bio: string;
  document: string;
  clinicAddress: string;
  contactNumber: string;
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

const https = axios.create({
  baseURL: "http://localhost:3000",
});

const useDoctorStore = create<DoctorStoreState>((set) => ({
  doctors: [],
  doctor: {
    _id: "",
    name: "",
    gender: "",
    email: "",
    profilePic: "",
    password: "",
    speciality: "",
    qualification: "",
    registrationNumber: "",
    yearOfRegistration: "",
    stateMedicalCouncil: "",
    bio: "",
    document: "",
    clinicAddress: "",
    contactNumber: "",
    city: "",
    state: "",
    pinCode: 0,
    clinicName: "",
    coordinates: {
      latitude: 0,
      longitude: 0,
    },
    morningStartTime: "",
    morningEndTime: "",
    eveningStartTime: "",
    eveningEndTime: "",
    slotDuration: 0,
    isVerified: false,
    avgRating: 0,
  },

  fetchDoctors: async () => {
    try {
      console.log("fetching doctors");
      const response = await https.get("/doctors");
      set({ doctors: response.data });
    } catch (error: any) {
      console.error(`Error fetching doctors: ${error.message}`);
    }
  },

  deleteDoctor: async (id: string) => {
    try {
      await https.delete(`/doctors/${id}`);
      set((state) => ({
        doctors: state.doctors.filter((doctor) => doctor._id !== id),
      }));
      toast.success(`Doctor deleted successfully`);
    } catch (error: any) {
      toast.error(`Error deleting doctor`);
    }
  },

}));

export default useDoctorStore;
