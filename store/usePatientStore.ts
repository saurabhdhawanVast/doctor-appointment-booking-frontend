
import { create } from "zustand";
import axios from "axios";
import useLoginStore, { Patient } from "@/store/useLoginStore";


// import { Doctor } from "./useDoctorStore";

// Define Doctor type as used in the component
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

interface PatientState {
    patient: Patient | null;
    doctors: Doctor[] | null;
    setPatient: (patient: Patient) => void;
    fetchPatient: (id: string) => void;
    updateProfile: (patient: Partial<Patient>) => void;
    fetchPatientByUserId: (userId: string) => void;
    searchDoctors: (
        state: string,
        city: string,
        specialty?: string,
        gender?: string,
        radius?: number,
        location?: [number, number]
    ) => Promise<void>;
}

export const usePatientStore = create<PatientState>((set) => ({
    patient: null,
    doctors: null,
    setPatient: (patient) => set({ patient }),
    fetchPatient: async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:3000/patients/${id}`);
            set({ patient: response.data });
        } catch (error) {
            console.error("Error fetching patient data:", error);
        }
    },
    updateProfile: async (patient) => {
        try {
            let patientId = patient._id;
            delete patient._id;
            let result = await axios.patch(
                `http://localhost:3000/patients/${patientId}`,
                patient
            );
            set({ patient: result.data });
            useLoginStore.getState().setPatient(result.data);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    },

    searchDoctors: async (state, city, specialty, gender, radius, location) => {
        console.log(`Patient Store: state: ${state}, city: ${city}, specialty: ${specialty},gender: ${gender}, radius: ${radius}, location: ${location}`);
        try {
            const response = await axios.get(`http://localhost:3000/doctors/search`, {
                params: { state, city, specialty, gender, radius, location }
            });
            set({ doctors: response.data });  // Set the doctors in the store
            return response.data;  // Return the fetched doctors
        } catch (error) {
            console.error("Error searching for doctors:", error);
            return [];  // Return an empty array in case of an error
        }
    },

    fetchPatientByUserId: async (userId: string) => {
        try {
            const response = await axios.get(`http://localhost:3000/patients//fetchPatientByUserId/${userId}`);
            set({ patient: response.data });
        } catch (error) {
            console.error("Error fetching patient data:", error);
        }
    }

}));
