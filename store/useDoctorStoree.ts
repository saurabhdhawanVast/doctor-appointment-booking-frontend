import { create } from "zustand";
import axios from "axios";
import useLoginStore from "./useLoginStore";

export interface Slot {
  id: string;
  time: string;
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
    morningStartTime?: string;
    morningEndTime?: string;
    eveningStartTime?: string;
    eveningEndTime?: string;
    slotDuration?: number;
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
  slotsByDate: Record<string, Slot[]>;
  loading: boolean;
  error: string | null;

  // Fetch functions
  //update by me
  updateProfile: (doctor: Partial<Doctor>) => void;
  fetchDoctors: (
    status: "all" | "verified" | "unverified",
    page: number,
    pageSize: number
  ) => Promise<void>;
  fetchDoctorProfile: (id: string) => Promise<void>;
  fetchAvailableDates: (id: string) => Promise<void>;
  fetchSlotsByDate: (id: string, date: Date) => Promise<void>;

  // Update functions
  verifyDoctor: (id: string) => Promise<void>;
  updateSlotStatus: (
    doctorId: string,
    date: Date,
    slotId: string,
    status: "available" | "booked" | "cancelled"
  ) => Promise<void>;

  // Cancellation functions
  cancelSlot: (doctorId: string, date: Date, slotId: string) => Promise<void>;
  cancelAllSlots: (doctorId: string, date: Date) => Promise<void>;

  // Add availability function
  addAvailability: (
    doctorId: string,
    dates: string[],
    timePerSlot: number
  ) => Promise<void>;

  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
}

const https = axios.create({
  baseURL: "http://localhost:3000",
});

const useDoctorStore = create<DoctorStoreState>((set) => ({
  doctors: [],
  totalDoctors: 0,
  doctor: null,
  currentPage: 1,
  totalPages: 1,
  availableDates: [],
  slotsByDate: {},
  loading: false,
  error: null,

  fetchSlotsByDate: async (id: string, date: Date) => {
    set({ loading: true });
    try {
      const token = useLoginStore.getState().token;
      const response = await https.get(`/doctors/getSlotsByDate`, {
        params: {
          id,
          date: date.toISOString().split("T")[0],
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const slots: Slot[] = response.data.slots.map((slot: any) => ({
          id: slot._id,
          time: slot.time,
          status: slot.status,
        }));

        set((state) => ({
          slotsByDate: {
            ...state.slotsByDate,
            [date.toISOString()]: slots,
          },
          loading: false,
        }));
      } else {
        console.error(
          "Failed to fetch slots by date. Server response:",
          response
        );
        set({ loading: false, error: "Failed to fetch slots by date." });
      }
    } catch (error) {
      console.error(`Error fetching slots by date: ${error}`);
      set({ loading: false, error: "Failed to fetch slots by date." });
    }
  },

  fetchDoctors: async (
    status: "all" | "verified" | "unverified",
    page: number,
    pageSize: number
  ) => {
    set({ loading: true });
    try {
      const token = useLoginStore.getState().token

      const response = await https.get("/doctors/getAllDoctors-Admin", {
        params: {
          status,
          page,
          pageSize,
        },
        headers: { Authorization: `Bearer ${token}` },

      });

      set({
        doctors: response.data.doctors,
        totalDoctors: response.data.total,
        currentPage: page,
        totalPages: Math.ceil(response.data.total / pageSize),
        loading: false,
      });
    } catch (error) {
      console.error(`Error fetching doctors: ${error}`);
      set({ loading: false, error: "Failed to fetch doctors." });
    }
  },

  fetchDoctorProfile: async (id: string) => {
    set({ loading: true });
    try {
      const token = useLoginStore.getState().token;
      const response = await https.get(`/doctors/getDoctorById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ doctor: response.data, loading: false });
    } catch (error) {
      console.error(`Error fetching doctor profile: ${error}`);
    }
  },
  //update ...
  updateProfile: async (doctor) => {
    try {
      let doctorId = doctor._id;
      delete doctor._id;
      const token = useLoginStore.getState().token;
      let result = await https.patch(
        `/doctors/${doctorId}`,
        doctor, {
        headers: { Authorization: `Bearer ${token}` },
      }
      );
      set({ doctor: result.data });
      useLoginStore.getState().setDoctor(result.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  },


  fetchAvailableDates: async (id: string) => {
    set({ loading: true });
    try {
      const token = useLoginStore.getState().token;
      const response = await https.get(
        `/doctors/getAvailableDates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }
      );

      if (Array.isArray(response.data)) {
        const availableDates: DateWithSlots[] = response.data.map(
          (entry: any) => ({
            date: new Date(entry.date),
            slots: entry.slots.map((slot: any) => ({
              id: slot._id,
              time: slot.time,
              status: slot.status,
            })),
          })
        );

        const slotsByDate: Record<string, Slot[]> = availableDates.reduce(
          (acc: Record<string, Slot[]>, dateWithSlots) => {
            acc[dateWithSlots.date.toISOString()] = dateWithSlots.slots;
            return acc;
          },
          {}
        );

        set({ availableDates, slotsByDate, loading: false });
      } else {
        console.error("Unexpected response format:", response.data);
        set({ availableDates: [], slotsByDate: {}, loading: false });
      }
    } catch (error) {
      console.error(`Error fetching available dates: ${error}`);
      set({
        availableDates: [],
        slotsByDate: {},
        loading: false,
        error: "Failed to fetch available dates.",
      });
    }
  },

  verifyDoctor: async (id: string) => {
    set({ loading: true });
    try {
      console.log(id);
      await https.post(`/admin/verifyDoctor/${id}`);
      set((state) => ({
        doctors: state.doctors.map((doc) =>
          doc._id === id ? { ...doc, isVerified: true } : doc
        ),
        doctor:
          state.doctor && state.doctor._id === id
            ? { ...state.doctor, isVerified: true }
            : state.doctor,
        loading: false,
      }));
    } catch (error) {
      console.error(`Error verifying doctor: ${error}`);
      set({ loading: false, error: "Failed to verify doctor." });
    }
  },

  updateSlotStatus: async (
    doctorId: string,
    date: Date,
    slotId: string,
    status: "available" | "booked" | "cancelled"
  ) => {
    set({ loading: true });
    try {
      const token = useLoginStore.getState().token;
      const response = await https.patch(`/doctors/updateSlotStatus`, {
        doctorId,
        date: date.toISOString(),
        slotId,
        status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        set((state) => {
          const dateStr = date.toISOString();
          const updatedSlots: Slot[] =
            state.slotsByDate[dateStr]?.map((slot) =>
              slot.id === slotId ? { ...slot, status } : slot
            ) || [];

          return {
            slotsByDate: {
              ...state.slotsByDate,
              [dateStr]: updatedSlots,
            },
            loading: false,
          };
        });
      } else {
        console.error(
          "Failed to update slot status. Server response:",
          response
        );
        set({ loading: false, error: "Failed to update slot status." });
      }
    } catch (error) {
      console.error(`Error updating slot status: ${error}`);
      set({ loading: false, error: "Failed to update slot status." });
    }
  },

  cancelSlot: async (doctorId: string, date: Date, slotId: string) => {
    set({ loading: true });
    try {
      if (!slotId) {
        throw new Error("Slot ID is required to cancel a slot.");
      }
      const token = useLoginStore.getState().token;
      await https.post(`/doctors/cancelSlot`, {
        doctorId,
        date: date.toISOString(),
        slotId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => {
        const dateStr = date.toISOString();
        const updatedSlots: Slot[] =
          state.slotsByDate[dateStr]?.filter((slot) => slot.id !== slotId) ||
          [];

        return {
          slotsByDate: {
            ...state.slotsByDate,
            [dateStr]: updatedSlots,
          },
          loading: false,
        };
      });
    } catch (error) {
      console.error(`Error canceling slot: ${error}`);
      set({ loading: false, error: "Failed to cancel slot." });
    }
  },

  cancelAllSlots: async (doctorId: string, date: Date) => {
    set({ loading: true });
    try {
      const token = useLoginStore.getState().token;
      await https.post(`/doctors/cancelAllSlots`, {
        doctorId,
        date: date.toISOString(),
      }, { headers: { Authorization: "Bearer " + token } });

      set((state) => {
        const dateStr = date.toISOString();
        const updatedSlots: Slot[] = [];

        return {
          slotsByDate: {
            ...state.slotsByDate,
            [dateStr]: updatedSlots,
          },
          loading: false,
        };
      });
    } catch (error) {
      console.error(`Error canceling all slots: ${error}`);
      set({ loading: false, error: "Failed to cancel all slots." });
    }
  },

  addAvailability: async (
    doctorId: string,
    dates: string[],
    timePerSlot: number
  ) => {
    set({ loading: true });
    try {
      const token = useLoginStore.getState().token;
      const response = await https.post(`/doctors/addAvailability`, {
        doctorId,
        dates,
        timePerSlot,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        set((state) => {
          const newAvailableDates: DateWithSlots[] = response.data.dates.map(
            (entry: any) => ({
              date: new Date(entry.date),
              slots: entry.slots.map((slot: any) => ({
                id: slot._id,
                time: slot.time,
                status: slot.status,
              })),
            })
          );

          const newSlotsByDate: Record<string, Slot[]> =
            newAvailableDates.reduce(
              (acc: Record<string, Slot[]>, dateWithSlots) => {
                acc[dateWithSlots.date.toISOString()] = dateWithSlots.slots;
                return acc;
              },
              {}
            );

          return {
            availableDates: [...state.availableDates, ...newAvailableDates],
            slotsByDate: { ...state.slotsByDate, ...newSlotsByDate },
            loading: false,
          };
        });
      } else {
        console.error("Failed to add availability. Server response:", response);
        set({ loading: false, error: "Failed to add availability." });
      }
    } catch (error) {
      console.error(`Error adding availability: ${error}`);
      set({ loading: false, error: "Failed to add availability." });
    }
  },

  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useDoctorStore;
