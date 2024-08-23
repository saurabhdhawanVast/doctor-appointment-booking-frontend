import create from "zustand";
import axios from "axios";

// Define types within the same file
export interface PatientDetails {
  name: string;
  contactNumber?: string;
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

export interface AppointmentStore {
  appointments: DateWithSlots[];
  filteredAppointments: DateWithSlots[];
  fetchAppointments: (doctorId: string, initialDate?: Date) => Promise<void>;
  filterAppointmentsByDate: (selectedDate: Date) => void;
}

const https = axios.create({
  baseURL: "http://localhost:3000", // Adjust if necessary
});

const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  filteredAppointments: [],
  fetchAppointments: async (doctorId: string, initialDate?: Date) => {
    try {
      console.log("Making API call to fetch appointments");
      const response = await https.get(
        `/appointments/getAppointmentsByDoctorId?doctorId=${doctorId}`
      );
      console.log("API response:", response.data);

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
      }

      // If no appointments on the initial date (today), return an empty array
      set({
        appointments,
        filteredAppointments:
          filteredAppointments.length > 0 ? filteredAppointments : [],
      });
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
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

      // If no appointments on the selected date, return an empty array
      return {
        filteredAppointments:
          filteredAppointments.length > 0 ? filteredAppointments : [],
      };
    });
  },
}));

export default useAppointmentStore;
