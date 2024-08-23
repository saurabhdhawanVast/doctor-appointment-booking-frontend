import { create } from "zustand";
import axios from "axios";

export interface Slot {
  id: string;
  time: string; // Adjust based on your slot time format
  status: "available" | "booked" | "cancelled";
}

export interface DateWithSlots {
  date: Date;
  slots: Slot[];
}

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
  availableDates: DateWithSlots[];
  slotsByDate: Record<string, Slot[]>; // Maintain slots by date
  fetchDoctors: (
    status: "all" | "verified" | "unverified",
    page: number,
    pageSize: number
  ) => Promise<void>;
  fetchDoctorProfile: (id: string) => Promise<void>;
  verifyDoctor: (id: string) => Promise<void>;
  fetchAvailableDates: (id: string) => Promise<void>;
  cancelSlot: (doctorId: string, date: Date, slotId: string) => Promise<void>;
  cancelAllSlots: (doctorId: string, date: Date) => Promise<void>;
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
  availableDates: [],
  slotsByDate: {} as Record<string, Slot[]>, // Initialize as an empty object

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

  fetchAvailableDates: async (id: string) => {
    try {
      const response = await axiosInstance.get(
        `/doctors/getAvailableDates/${id}`
      );

      if (Array.isArray(response.data)) {
        const availableDates = response.data.map((entry: any) => ({
          date: new Date(entry.date),
          slots: entry.slots.map((slot: any) => ({
            id: slot._id,
            time: slot.time,
            status: slot.status,
          })),
        }));

        const slotsByDate = availableDates.reduce(
          (acc: Record<string, Slot[]>, dateWithSlots) => {
            acc[dateWithSlots.date.toISOString()] = dateWithSlots.slots;
            return acc;
          },
          {}
        );

        set({ availableDates, slotsByDate });
      } else {
        console.error("Unexpected response format:", response.data);
        set({ availableDates: [], slotsByDate: {} });
      }
    } catch (error) {
      console.error(`Error fetching available dates: ${error}`);
      set({ availableDates: [], slotsByDate: {} });
    }
  },

  cancelSlot: async (doctorId: string, date: Date, slotId: string) => {
    try {
      if (!slotId) {
        throw new Error("Slot ID is undefined");
      }

      console.log(
        `Cancelling slot with ID ${slotId} for doctor ${doctorId} on ${date.toISOString()}`
      );

      const response = await axiosInstance.patch(`/doctors/cancelSlot`, {
        doctorId,
        date: date.toISOString(),
        slotId,
      });

      if (response.status === 200) {
        console.log("Slot canceled successfully");

        set((state) => {
          const dateStr = date.toISOString();
          const updatedSlots =
            state.slotsByDate[dateStr]?.filter((slot) => slot.id !== slotId) ||
            [];

          return {
            slotsByDate: {
              ...state.slotsByDate,
              [dateStr]: updatedSlots,
            },
          };
        });
      } else {
        console.error("Failed to cancel slot. Server response:", response);
      }
    } catch (error) {
      console.error(`Error canceling slot with ID ${slotId}:`, error);
    }
  },

  cancelAllSlots: async (doctorId: string, date: Date) => {
    try {
      const response = await axiosInstance.patch(`/doctors/cancelAllSlots`, {
        doctorId,
        date: date.toISOString().split("T")[0], // Ensure date is in YYYY-MM-DD format
      });

      if (response.status === 200) {
        set((state) => {
          const updatedAvailableDates = state.availableDates.filter(
            (entry) => entry.date.toISOString() !== date.toISOString()
          );

          const updatedSlotsByDate = { ...state.slotsByDate };
          delete updatedSlotsByDate[date.toISOString()];

          return {
            availableDates: updatedAvailableDates,
            slotsByDate: updatedSlotsByDate,
          };
        });
      } else {
        console.error("Failed to cancel all slots");
      }
    } catch (error) {
      console.error(`Error canceling all slots: ${error}`);
    }
  },
}));

export default useDoctorStore;
