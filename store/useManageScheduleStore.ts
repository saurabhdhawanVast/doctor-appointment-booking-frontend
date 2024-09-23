// import create from "zustand";
// import axios from "axios";

// export interface Slot {
//   id: string;
//   time: string;
//   status: "available" | "booked" | "cancelled";
// }

// interface DateWithSlots {
//   date: Date;
//   slots: Slot[];
// }
// interface AvailableDate {
//   date: string; // Assuming date is stored as a string (ISO format)
//   slots: any[]; // Adjust the type of slots as needed
// }

// interface ManageScheduleStore {
//   availableDates: DateWithSlots[];
//   slotsByDate: Record<string, Slot[]>;
//   selectedDate: string | null;
//   loading: boolean;
//   error: string | null;
//   fetchAvailableDates: (id: string) => Promise<void>;
//   toggleAvailableDate: (date: string) => void;
//   manageSlots: (date: string) => void;
//   cancelSlot: (doctorId: string, date: Date, slotId: string) => Promise<void>;
//   cancelAllSlots: (doctorId: string, date: Date) => Promise<void>;
//   addAvailability: (
//     doctorId: string,
//     dates: string[],
//     timePerSlot: number
//   ) => Promise<void>;
// }

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3000",
// });

// const useManageScheduleStore = create<ManageScheduleStore>((set) => ({
//   availableDates: [],
//   slotsByDate: {},
//   selectedDate: null,
//   loading: false,
//   error: null,
//   fetchAvailableDates: async (id: string) => {
//     set({ loading: true });
//     try {
//       const response = await axiosInstance.get(
//         `/doctors/getAvailableDates/${id}`
//       );
//       if (Array.isArray(response.data)) {
//         const availableDates: DateWithSlots[] = await response.data.map(
//           (entry: any) => ({
//             date: new Date(entry.date),
//             slots: entry.slots.map((slot: any) => ({
//               id: slot._id,
//               time: slot.time,
//               status: slot.status,
//             })),
//           })
//         );

//         const slotsByDate: Record<string, Slot[]> = availableDates.reduce(
//           (acc: Record<string, Slot[]>, dateWithSlots) => {
//             acc[dateWithSlots.date.toISOString()] = dateWithSlots.slots;
//             return acc;
//           },
//           {}
//         );

//         await set({ availableDates, slotsByDate, loading: false });
//       } else {
//         console.error("Unexpected response format:", response.data);
//         set({ availableDates: [], slotsByDate: {}, loading: false });
//       }
//     } catch (error) {
//       console.error(`Error fetching available dates: ${error}`);
//       set({
//         availableDates: [],
//         slotsByDate: {},
//         loading: false,
//         error: "Failed to fetch available dates.",
//       });
//     }
//   },
//   toggleAvailableDate: (date) =>
//     set((state) => {
//       const dateStr = new Date(date).toISOString();
//       const isAvailable = state.availableDates.some(
//         (avail) => avail.date.toISOString() === dateStr
//       );
//       const newAvailableDates = isAvailable
//         ? state.availableDates.filter(
//             (avail) => avail.date.toISOString() !== dateStr
//           )
//         : [...state.availableDates, { date: new Date(dateStr), slots: [] }];
//       return { availableDates: newAvailableDates };
//     }),
//   manageSlots: (date) => {
//     // Logic to manage slots for the selected date
//   },

//   cancelSlot: async (doctorId: string, date: Date, slotId: string) => {
//     set({ loading: true });
//     try {
//       if (!slotId) {
//         throw new Error("Slot ID is required to cancel a slot.");
//       }

//       // Format date as ISO string to match @IsDateString() in DTO
//       const formattedDate = date.toISOString().split("T")[0]; // Adjust if your backend expects a different date format

//       console.log(
//         `doctorId: ${typeof doctorId}, date: ${typeof formattedDate}, slotId: ${typeof slotId}`
//       );
//       console.log(
//         `doctorId: ${doctorId}, date: ${formattedDate}, slotId: ${slotId}`
//       );

//       const response = await axiosInstance.patch(`/doctors/cancelSlot`, {
//         doctorId,
//         date: formattedDate,
//         slotId,
//       });

//       set((state) => {
//         const dateStr = formattedDate;
//         const updatedSlots: Slot[] =
//           state.slotsByDate[dateStr]?.filter((slot) => slot.id !== slotId) ||
//           [];

//         return {
//           slotsByDate: {
//             ...state.slotsByDate,
//             [dateStr]: updatedSlots,
//           },
//           loading: false,
//         };
//       });
//     } catch (error) {
//       console.error(`Error canceling slot: ${error}`);
//       set({ loading: false, error: "Failed to cancel slot." });
//     }
//   },

//   cancelAllSlots: async (doctorId: string, date: Date) => {
//     set({ loading: true });
//     try {
//       await axiosInstance.patch(`/doctors/cancelAllSlots`, {
//         doctorId,
//         date: date.toISOString(),
//       });

//       set((state) => {
//         const dateStr = date.toISOString();
//         return {
//           slotsByDate: {
//             ...state.slotsByDate,
//             [dateStr]: [],
//           },
//           loading: false,
//         };
//       });
//     } catch (error) {
//       console.error(`Error canceling all slots: ${error}`);
//       set({ loading: false, error: "Failed to cancel all slots." });
//     }
//   },
//   addAvailability: async (
//     doctorId: string,
//     dates: string[],
//     timePerSlot: number
//   ) => {
//     set({ loading: true });
//     try {
//       console.log(`Dates to be mark as available are:${dates}`);
//       const response = await axiosInstance.post(`/doctors/addAvailability`, {
//         doctorId,
//         dates,
//         timePerSlot,
//       });

//       console.log("API Response:", response.data);

//       if (response.status === 200 || response.status === 201) {
//         // Check if response.data.availability is defined and an array
//         if (Array.isArray(response.data.availability)) {
//           const newAvailableDates: DateWithSlots[] =
//             response.data.availability.map((entry: any) => ({
//               date: new Date(entry.date),
//               slots: entry.slots.map((slot: any) => ({
//                 id: slot._id,
//                 time: slot.time,
//                 status: slot.status,
//               })),
//             }));

//           const newSlotsByDate: Record<string, Slot[]> =
//             newAvailableDates.reduce(
//               (acc: Record<string, Slot[]>, dateWithSlots) => {
//                 acc[dateWithSlots.date.toISOString()] = dateWithSlots.slots;
//                 return acc;
//               },
//               {}
//             );

//           set((state) => ({
//             availableDates: [...state.availableDates, ...newAvailableDates],
//             slotsByDate: { ...state.slotsByDate, ...newSlotsByDate },
//             loading: false,
//           }));
//         } else {
//           console.error(
//             "Invalid format for availability:",
//             response.data.availability
//           );
//           set({
//             loading: false,
//             error: "Invalid format for availability in response.",
//           });
//         }
//       } else {
//         console.error("Failed to add availability. Server response:", response);
//         set({ loading: false, error: "Failed to add availability." });
//       }
//     } catch (error) {
//       console.error(`Error adding availability: ${error}`);
//       set({ loading: false, error: "Failed to add availability." });
//     }
//   },
// }));

// export default useManageScheduleStore;

import create from "zustand";
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
  toggleAvailableDate: (date: string) => void;
  manageSlots: (date: string) => void;
  cancelSlot: (doctorId: string, date: Date, slotId: string) => Promise<void>;
  cancelAllSlots: (doctorId: string, date: Date) => Promise<void>;
  addAvailability: (
    doctorId: string,
    dates: string[],
    timePerSlot: number
  ) => Promise<void>;
}

const axiosInstance = axios.create({
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
      const token = useLoginStore.getState().token;
      const response = await axiosInstance.get(
        `/doctors/getAvailableDates/${id}`,{
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (Array.isArray(response.data)) {
        const availableDates: DateWithSlots[] = await response.data.map(
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

        await set({ availableDates, slotsByDate, loading: false });
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
  toggleAvailableDate: (date) =>
    set((state) => {
      const dateStr = new Date(date).toISOString();
      const isAvailable = state.availableDates.some(
        (avail) => avail.date.toISOString() === dateStr
      );
      const newAvailableDates = isAvailable
        ? state.availableDates.filter(
            (avail) => avail.date.toISOString() !== dateStr
          )
        : [...state.availableDates, { date: new Date(dateStr), slots: [] }];
      return { availableDates: newAvailableDates };
    }),
  manageSlots: (date) => {
    // Logic to manage slots for the selected date
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
      const token = useLoginStore.getState().token;
      const response = await axiosInstance.patch(`/doctors/cancelSlot`, {
        doctorId,
        date: formattedDate,
        slotId,
      },{
        headers: {
          'Authorization': `Bearer ${token}`,
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
      const token = useLoginStore.getState().token;
      await axiosInstance.patch(`/doctors/cancelAllSlots`, {
        doctorId,
        date: formattedDate,
      },{
        headers: {
          'Authorization': `Bearer ${token}`,
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
      const token = useLoginStore.getState().token;
      const response = await axiosInstance.post(`/doctors/addAvailability`, {
        doctorId,
        dates,
        timePerSlot,
      },{
        headers: {
          'Authorization': `Bearer ${token}`,
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
