import create from "zustand";
import axios from "axios";

// Define types within the same file
export interface PatientDetails {
  name: string;
  contactNumber?: string;
  patientId?: string; // Ensure patientId is included
}

export interface AppointmentSlot {
  slotId: string;
  time: string;
  patient?: PatientDetails;
}

export interface DateWithSlots {
  date: string;
  appointmentsBooked: AppointmentSlot[];
}

export interface DoctorDetails {
  name: string;
  specialty?: string;
  contactNumber?: string;
}

export interface Prescription {
  appointmentData: string;
  slotId: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  medicines: {
    name: string;
    dosage: string[];
    time: string;
    days: number;
  }[];
}

export interface AppointmentStore {
  appointments: DateWithSlots[];
  filteredAppointments: DateWithSlots[];
  doctorDetails: DoctorDetails | null;
  fetchAppointments: (doctorId: string, initialDate?: Date) => Promise<void>;
  fetchDoctorDetails: (doctorId: string) => Promise<void>;
  filterAppointmentsByDate: (selectedDate: Date) => void;
  savePrescription: (prescription: Prescription) => Promise<void>;
}

const https = axios.create({
  baseURL: "http://localhost:3000", // Adjust if necessary
});

const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  filteredAppointments: [],
  doctorDetails: null,
  fetchAppointments: async (doctorId: string, initialDate?: Date) => {
    try {
      const response = await https.get(
        `/appointments/getAppointmentsByDoctorId?doctorId=${doctorId}`
      );
      console.log(response);
      const appointments: DateWithSlots[] = response.data;

      let filteredAppointments: DateWithSlots[] = [];

      if (initialDate) {
        filteredAppointments = appointments.filter((item) => {
          const appointmentDate = new Date(item.date);
          return (
            appointmentDate.getFullYear() === initialDate.getFullYear() &&
            appointmentDate.getMonth() === initialDate.getMonth() &&
            appointmentDate.getDate() === initialDate.getDate()
          );
        });
      } else {
        // Filter for today's date
        const today = new Date();
        filteredAppointments = appointments.filter((item) => {
          const appointmentDate = new Date(item.date);
          return (
            appointmentDate.getFullYear() === today.getFullYear() &&
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getDate() === today.getDate()
          );
        });
      }

      set({
        appointments,
        filteredAppointments:
          filteredAppointments.length > 0 ? filteredAppointments : [],
      });
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  },
  fetchDoctorDetails: async (doctorId: string) => {
    try {
      const response = await https.get(`/doctors/getDoctorById/${doctorId}`);
      const doctorDetails: DoctorDetails = response.data;

      set({ doctorDetails });
    } catch (error) {
      console.error("Failed to fetch doctor details:", error);
    }
  },
  filterAppointmentsByDate: (selectedDate: Date) => {
    set((state) => {
      const filteredAppointments = state.appointments.filter((item) => {
        const appointmentDate = new Date(item.date);
        return (
          appointmentDate.getFullYear() === selectedDate.getFullYear() &&
          appointmentDate.getMonth() === selectedDate.getMonth() &&
          appointmentDate.getDate() === selectedDate.getDate()
        );
      });

      return {
        filteredAppointments:
          filteredAppointments.length > 0 ? filteredAppointments : [],
      };
    });
  },
  savePrescription: async (prescription: Prescription) => {
    try {
      await https.post("/prescriptions/savePrescription", prescription);
      console.log("Prescription saved successfully");
    } catch (error) {
      console.error("Failed to save prescription:", error);
    }
  },
}));

export default useAppointmentStore;
