import axios from "axios";
import create from "zustand";

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
            // Replace this URL with your API endpoint
            const response = await axiosInstance.post("/appointments/bookSlot", {
                // method: "POST",
                // headers: {
                //   "Content-Type": "application/json",
                // },
                // body: JSON.stringify({ doctorId, patientId, slotId }),
                doctorId,
                patientId,
                slotId,
                appointmentDate: selectedDate,
            });

            if (!response.status) {
                throw new Error("Failed to book slot.");
            }

            set({ bookingSuccess: "Slot booked successfully!", bookingError: null });
        } catch (error) {
            set({ bookingError: "Failed to book slot.", bookingSuccess: null });
        }
    },
}));

export default useBookAppointmentStore;