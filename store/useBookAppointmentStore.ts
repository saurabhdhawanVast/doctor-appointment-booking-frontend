import axios from "axios";
import { toast } from "react-toastify";
import create from "zustand";
import useLoginStore from "./useLoginStore";

interface Slot {
  id: string;
  time: string;
  status: "available" | "booked" | "unavailable";
}

interface BookAppointmentState {
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

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

const useBookAppointmentStore = create<BookAppointmentState>((set) => ({
  selectedSlotId: null,
  showModal: false,
  bookingError: null,
  bookingSuccess: null,
  setSelectedSlotId: (slotId) => set({ selectedSlotId: slotId }),
  setShowModal: (show) => set({ showModal: show }),
  setBookingError: (error) => set({ bookingError: error }),
  setBookingSuccess: (success) => set({ bookingSuccess: success }),
  bookSlot: async (
    doctorId: string,
    patientId: string,
    slotId: string,
    selectedDate: Date
  ) => {
    try {
      console.log(`${slotId} and type is ${typeof slotId}`);
      const token = useLoginStore.getState().token;
      // Replace this URL with your API endpoint
      const response = await axiosInstance.post("/appointments/bookSlot", {
        doctorId,
        patientId,
        slotId,
        appointmentDate: selectedDate,
      },{
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

export default useBookAppointmentStore;
