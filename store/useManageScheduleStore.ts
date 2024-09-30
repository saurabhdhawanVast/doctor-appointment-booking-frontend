
import { create } from "zustand";
import axios from "axios";
import { format, toZonedTime } from "date-fns-tz";
import useLoginStore from "./useLoginStore";

export interface Slot {
  id: string;
  time: string;
  status: "available" | "booked" | "cancelled";
}

interface DateWithSlots {
  date: Date;
  slots: Slot[];
}

interface ManageScheduleStore {
  availableDates: DateWithSlots[];
  slotsByDate: Record<string, Slot[]>;
  selectedDate: string | null;
  loading: boolean;
  error: string | null;
  fetchAvailableDates: (id: string) => Promise<void>;
  // manageSlots: (date: string) => void;
  cancelSlot: (doctorId: string, date: Date, slotId: string) => Promise<void>;
  cancelAllSlots: (doctorId: string, date: Date) => Promise<void>;
  addAvailability: (
    doctorId: string,
    dates: string[],
    timePerSlot: number
  ) => Promise<void>;
}

const https = axios.create({
  baseURL: "http://localhost:3000",
});

const useManageScheduleStore = create<ManageScheduleStore>((set) => ({
  availableDates: [],
  slotsByDate: {},
  selectedDate: null,
  loading: false,
  error: null,


  fetchAvailableDates: async (id: string) => {
    set({ loading: true });

    try {
      const response = await https.get(`/doctors/getAvailableDates/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.token}`,
        },
      });

      // Check if the response is an array
      if (Array.isArray(response.data)) {
        const availableDates: DateWithSlots[] = response.data.map((entry: any) => ({
          date: new Date(entry.date),
          slots: entry.slots.map((slot: any) => ({
            id: slot._id,
            time: slot.time,
            status: slot.status,
          })),
        }));

        // Create slotsByDate object for easier lookup
        const slotsByDate: Record<string, Slot[]> = availableDates.reduce(
          (acc: Record<string, Slot[]>, dateWithSlots) => {
            acc[dateWithSlots.date.toISOString()] = dateWithSlots.slots;
            return acc;
          },
          {}
        );

        // Update the state
        set({ availableDates, slotsByDate, loading: false });
      } else {
        console.error("Unexpected response format:", response.data);
        set({ availableDates: [], slotsByDate: {}, loading: false });
      }
    } catch (error) {
      console.error(`Error fetching available dates:`, error);
      set({
        availableDates: [],
        slotsByDate: {},
        loading: false,
        error: "Failed to fetch available dates.",
      });
    }
  },



  cancelSlot: async (doctorId: string, date: Date, slotId: string) => {
    set({ loading: true });
    try {
      if (!slotId) {
        throw new Error("Slot ID is required to cancel a slot.");
      }

      const timeZone = "Asia/Kolkata"; // Correct time zone
      // Convert the UTC date to the specified time zone
      const zonedDate = toZonedTime(date, timeZone);

      // Format the zoned date in the desired format (yyyy-MM-dd)
      const formattedDate = format(zonedDate, "yyyy-MM-dd");

      console.log(
        `doctorId: ${typeof doctorId}, date: ${typeof formattedDate}, slotId: ${typeof slotId}`
      );
      console.log(
        `doctorId: ${doctorId}, date: ${formattedDate}, slotId: ${slotId}`
      );

      const response = await https.patch(`/doctors/cancelSlot`, {
        doctorId,
        date: formattedDate,
        slotId,
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.token}`,
        },
      });

      set((state) => {
        const dateStr = formattedDate;
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
      const timeZone = "Asia/Kolkata"; // Correct time zone
      // Convert the UTC date to the specified time zone
      const zonedDate = toZonedTime(date, timeZone);

      // Format the zoned date in the desired format (yyyy-MM-dd)
      const formattedDate = format(zonedDate, "yyyy-MM-dd");
      console.log(formattedDate);

      await https.patch(`/doctors/cancelAllSlots`, {
        doctorId,
        date: formattedDate,
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.token}`,
        },
      });

      set((state) => {
        const dateStr = date.toISOString();
        return {
          slotsByDate: {
            ...state.slotsByDate,
            [dateStr]: [],
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
      console.log(`Dates to be mark as available are:${dates}`);

      const response = await https.post(`/doctors/addAvailability`, {
        doctorId,
        dates,
        timePerSlot,
      }, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.token}`,
        },
      });

      console.log("API Response:", response.data);

      if (response.status === 200 || response.status === 201) {
        if (Array.isArray(response.data.availability)) {
          const newAvailableDates: DateWithSlots[] =
            response.data.availability.map((entry: any) => ({
              date: new Date(entry.date),
              slots: entry.slots.map((slot: any) => ({
                id: slot._id,
                time: slot.time,
                status: slot.status,
              })),
            }));

          const newSlotsByDate: Record<string, Slot[]> =
            newAvailableDates.reduce(
              (acc: Record<string, Slot[]>, dateWithSlots) => {
                acc[dateWithSlots.date.toISOString()] = dateWithSlots.slots;
                return acc;
              },
              {}
            );

          set((state) => ({
            availableDates: [...state.availableDates, ...newAvailableDates],
            slotsByDate: { ...state.slotsByDate, ...newSlotsByDate },
            loading: false,
          }));
        } else {
          console.error(
            "Invalid format for availability:",
            response.data.availability
          );
          set({
            loading: false,
            error: "Invalid format for availability in response.",
          });
        }
      } else {
        console.error("Failed to add availability. Server response:", response);
        set({ loading: false, error: "Failed to add availability." });
      }
    } catch (error) {
      console.error(`Error adding availability: ${error}`);
      set({ loading: false, error: "Failed to add availability." });
    }
  },
}));

export default useManageScheduleStore;