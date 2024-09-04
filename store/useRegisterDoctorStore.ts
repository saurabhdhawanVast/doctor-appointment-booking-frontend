import { create } from "zustand";
import axios from "axios";

export interface User {
  _doc: {
    _id: string;
    email: string;
    name: string;
    password: string;
    role: string;
    isEmailVerified: boolean;
    is_verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };
  exp: number;
  iat: number;
  $isNew?: boolean;
  $__?: {
    activePaths: any;
    skipId: boolean;
  };
}

export interface RegisterStoreState {
  signup: (data: {
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
    morningStartTime?: string;
    morningEndTime?: string;
    eveningStartTime?: string;
    eveningEndTime?: string;
    slotDuration: number;
  }) => Promise<boolean>;

  getUserByEmail: (email: string) => Promise<User>;

  stateMedicalCouncilsList: string[]; // Add this
  doctorSpecialties: string[];
  doctorQualifications: string[];
}

const https = axios.create({
  baseURL: "http://localhost:3000",
});

const stateMedicalCouncilsList = [
  "Andhra Pradesh Medical Council",
  "Arunachal Pradesh Medical Council",
  "Assam Medical Council",
  "Bihar Medical Council",
  "Chattisgarh Medical Council",
  "Delhi Medical Council",
  "Goa Medical Council",
  "Gujarat Medical Council",
  "Haryana State Dental & Medical Council",
  "Himachal Pradesh Medical Council",
  "Jammu & Kashmir Medical Council",
  "Jharkhand Medical Council",
  "Karnataka Medical Council",
  "Kerala Medical Council",
  "Madhya Pradesh Medical Council",
  "Maharashtra Medical Council",
  "Manipur Medical Council",
  "Meghalya Medical Council",
  "Mizoram Medical Council",
  "Nagaland Medical Council",
  "Orissa Medical Council",
  "Punjab Medical Council",
  "Rajasthan Medical Council",
  "Sikkim Medical Council",
  "Tamil Nadu Medical Council",
  "Telangana Medical Council",
  "Tripura Medical Council",
  "Uttarnchal Medical Council",
  "Uttar Pradesh Medical Council",
  "West Bengal Medical Council",
];

const doctorSpecialties = [
  "Cardiologist", // Heart specialist
  "Dermatologist", // Skin specialist
  "Endocrinologist", // Hormones and metabolism specialist
  "Gastroenterologist", // Digestive system specialist
  "Neurologist", // Nervous system specialist
  "Oncologist", // Cancer specialist
  "Ophthalmologist", // Eye specialist
  "Orthopedic Surgeon", // Bone and joint specialist
  "Pediatrician", // Child specialist
  "Psychiatrist", // Mental health specialist
  "Pulmonologist", // Lung specialist
  "Rheumatologist", // Joint and autoimmune disease specialist
  "Surgeon", // General surgeon
  "Urologist", // Urinary tract specialist
  "Dentist", // Oral health specialist
];

const doctorQualifications = [
  "MBBS", // Bachelor of Medicine, Bachelor of Surgery
  "MD", // Doctor of Medicine
  "MS", // Master of Surgery
  "DM", // Doctorate of Medicine (super-specialization)
  "MCh", // Master of Chirurgie (super-specialization in surgery)
  "DNB", // Diplomate of National Board
  "BDS", // Bachelor of Dental Surgery
  "MDS", // Master of Dental Surgery
  "BHMS", // Bachelor of Homeopathic Medicine and Surgery
  "MD(Hom)", // Doctor of Medicine in Homeopathy
  "BAMS", // Bachelor of Ayurvedic Medicine and Surgery
  "MD(Ayurveda)", // Doctor of Medicine in Ayurveda
  "DGO", // Diploma in Obstetrics and Gynaecology
  "DCH", // Diploma in Child Health
  "DNB Pediatrics", // Diplomate of National Board in Pediatrics
  "FRCS", // Fellow of the Royal College of Surgeons (can be recognized for Indian practice if from a recognized institution)
  "FAMS", // Fellow of the Academy of Medical Sciences (can be recognized for Indian practice if from a recognized institution)
];

const RegisterDoctorStore = create<RegisterStoreState>((set) => ({
  signup: async (data) => {
    try {
      console.log("sending request through frontend ");
      console.log(data);
      const res = await https.post("/users/doctor", data);
      set(() => ({ signup: res.data }));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      console.log("Fetching user by Store email through frontend ", email);
      const res = await https.get("/users/getUserByEmail", {
        params: {
          email: email,
        },
      });
      console.log(`User fetched by email: ${res}`);
      if (res.data) {
        return res.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  stateMedicalCouncilsList, // Add this to the store state
  doctorSpecialties,
  doctorQualifications,
}));

export default RegisterDoctorStore;
