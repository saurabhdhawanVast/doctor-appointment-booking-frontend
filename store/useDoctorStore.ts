import { create } from "zustand";
import axios from "axios";

export interface DoctorStoreState {
  doctors: Doctor[];
  doctor: Doctor;
  fetchDoctors: () => Promise<void>;
}

export interface Doctor {
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
}


const https = axios.create({
  baseURL: "http://localhost:3000",
});

const useDoctorStore = create<DoctorStoreState>((set) => ({
  doctors: [],
  doctor: {
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
}));

export default useDoctorStore;










