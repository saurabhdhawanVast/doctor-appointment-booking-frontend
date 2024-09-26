
import { create } from "zustand";
import axios from "axios";
import useLoginStore from "./useLoginStore";
import { Doctor } from "./useDoctorStore";
import { Prescription } from "./usePrescriptionStore";
import { Patients } from "./usePatientStore";

interface Appointment {
  _id: string;
  doctor: Doctor;
  patient: Patients;
  appointmentDate: Date;
  isAppointmentRated?: boolean;
  slot: Slot;
  status: string;
}

interface Slot {
  _id: string;
  time: string;
  available: string;
}

export interface AppointmentSlot {
  slotId: string;
  time: string;
  patient?: Patients;
}

export interface DateWithSlots {
  date: string;
  appointmentsBooked: AppointmentSlot[];
  status: string;
}

export interface DoctorDetails {
  name: string;
  specialty?: string;
  contactNumber?: string;
}



export interface AppointmentStore {
  appointments: DateWithSlots[];
  upcomingAppointments: Appointment[]; // Add upcoming appointments to the store for displaying on the dashboard
  filteredAppointments: DateWithSlots[];
  doctorDetails: DoctorDetails | null;
  fetchAppointments: (doctorId: string, initialDate?: Date) => Promise<void>;
  fetchDoctorDetails: (doctorId: string) => Promise<void>;
  filterAppointmentsByDate: (selectedDate: Date) => void;
  savePrescription: (prescription: Prescription) => Promise<void>;
  getAppointments: (query?: Record<string, any>) => Promise<void>;
  //Book Slot
  selectedSlotId: string | null;
  showModal: boolean;
  bookingError: string | null;
  bookingSuccess: string | null;
  setSelectedSlotId: (slotId: string | null) => void;
  setShowModal: (show: boolean) => void;
  setBookingError: (error: string | null) => void;
  setBookingSuccess: (success: string | null) => void;
  bookSlot: (
    doctorId: string,
    patientId: string,
    slotId: string,
    selectedDate: Date
  ) => Promise<void>;

}

const https = axios.create({
  baseURL: "http://localhost:3000", // Adjust if necessary
});

const token = useLoginStore.getState().token;

const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  upcomingAppointments: [],
  filteredAppointments: [],
  doctorDetails: null,

  //book
  selectedSlotId: null,
  showModal: false,
  bookingError: null,
  bookingSuccess: null,
  setSelectedSlotId: (slotId) => set({ selectedSlotId: slotId }),
  setShowModal: (show) => set({ showModal: show }),
  setBookingError: (error) => set({ bookingError: error }),
  setBookingSuccess: (success) => set({ bookingSuccess: success }),

  getAppointments: async (query = {}) => {
    try {

      const queryString = new URLSearchParams({
        filter: JSON.stringify(query),
      }).toString();
      console.log("Query String is ", queryString);
      const response = await https.get(`/appointments?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      for (let appointment of response.data) {
        let slots = appointment?.doctor?.availability?.find(
          (availability: any) =>
            availability.date ===
            new Date(appointment.appointmentDate).toISOString().split("T")[0]
        );
        if (slots) {
          console.log(slots);
          let selectedSlot = slots.slots.find(
            (slot: any) => slot._id === appointment.slot
          );
          if (selectedSlot) {
            appointment.slot = selectedSlot;
          }
        }
        let ratings = await https.get(
          `/ratings/appointment/${appointment._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("ratings", ratings);
        if (ratings && ratings.data && ratings.data.length > 0) {
          appointment.isAppointmentRated = true;
        } else {
          appointment.isAppointmentRated = false;
        }
      }
      console.log(response.data);
      set({ upcomingAppointments: response.data });
    } catch (error) {
      console.error("Error fetching appiontments:", error);
    }
  },

  fetchAppointments: async (doctorId: string, initialDate?: Date) => {
    try {

      const response = await https.get(
        `/appointments/getAppointmentsByDoctorId?doctorId=${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response.data", response.data);

      let appointments: DateWithSlots[] = response.data;

      // Sort the main appointments array by time
      appointments = appointments.map((appointmentDay) => {
        const sortedAppointmentsBooked = appointmentDay.appointmentsBooked.sort(
          (a, b) => {
            const timeA = a.time.split(":").map(Number);
            const timeB = b.time.split(":").map(Number);

            // Compare hours first, and if equal, compare minutes
            if (timeA[0] !== timeB[0]) {
              return timeA[0] - timeB[0];
            } else {
              return timeA[1] - timeB[1];
            }
          }
        );
        console.log(appointments);
        return {
          ...appointmentDay,
          appointmentsBooked: sortedAppointmentsBooked,
        };
      });

      let filteredAppointments: DateWithSlots[] = [];

      if (initialDate) {
        // Filter appointments based on the provided initialDate
        filteredAppointments = appointments.filter((item) => {
          const appointmentDate = new Date(item.date);
          return (
            appointmentDate.getFullYear() === initialDate.getFullYear() &&
            appointmentDate.getMonth() === initialDate.getMonth() &&
            appointmentDate.getDate() === initialDate.getDate()
          );
        });
      } else {
        // Filter appointments for today's date
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

      // Sort the filteredAppointments array by time
      filteredAppointments = filteredAppointments.map((appointmentDay) => {
        const sortedAppointmentsBooked = appointmentDay.appointmentsBooked.sort(
          (a, b) => {
            const timeA = a.time.split(":").map(Number);
            const timeB = b.time.split(":").map(Number);

            // Compare hours first, and if equal, compare minutes
            if (timeA[0] !== timeB[0]) {
              return timeA[0] - timeB[0];
            } else {
              return timeA[1] - timeB[1];
            }
          }
        );
        return {
          ...appointmentDay,
          appointmentsBooked: sortedAppointmentsBooked,
        };
      });

      console.log("Sorted appointments:", appointments);
      console.log("Filtered and sorted appointments:", filteredAppointments);

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

      const response = await https.get(`/doctors/getDoctorById/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

      await https.post("/prescriptions/savePrescription", prescription, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Prescription saved successfully");
    } catch (error) {
      console.error("Failed to save prescription:", error);
    }
  },

  //Book Slot
  bookSlot: async (
    doctorId: string,
    patientId: string,
    slotId: string,
    selectedDate: Date
  ) => {
    try {
      console.log(`${slotId} and type is ${typeof slotId}`);

      // Replace this URL with your API endpoint
      const response = await https.post("/appointments/bookSlot", {
        doctorId,
        patientId,
        slotId,
        appointmentDate: selectedDate,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.status) {
        throw new Error("Failed to book slot.");
      }


    } catch (error) {
      console.error("Error booking slot:", error);

    }
  },
}));

export default useAppointmentStore;
