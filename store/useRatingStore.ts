import create from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useLoginStore from "./useLoginStore";

interface CreateRating {
  doctor: string;
  patient: string;
  comment?: string;
  appointment: string;
  rating: number;
}

interface Rating {
  _id: string;
  doctor: string;
  patient: Patient;
  appointment: string;
  comment?: string;
  createdAt: string;
  rating: number;
}

interface Patient {
  _id: string;
  name: string;
  profilePic: string;
}

interface RatingsState {
  ratings: Rating[];
  createRating: (article: CreateRating) => Promise<void>;
  getRatingsForDoctor: (doctorId: string) => Promise<void>;
}
const https = axios.create({
  baseURL: "http://localhost:3000", // Adjust if necessary
});

const token = useLoginStore.getState().token;

export const useRatingStore = create<RatingsState>((set) => ({
  ratings: [],
  createRating: async (Rating) => {
    console.log(`creating rating${JSON.stringify(Rating)}`);
    try {

      await https.post("/ratings", Rating, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Thank you for providing your feedback!");
    } catch (error) {
      console.error("Error creating Rating:", error);
      toast.error("Error adding rating");
    }
  },
  getRatingsForDoctor: async (doctorId) => {
    try {

      let response = await https.get(
        `/ratings/doctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ ratings: response.data });
    } catch (error) {
      console.error(`Error getting ratings for doctor ${doctorId}: ${error}`);
      set({ ratings: [] });
    }
  },
}));

export default useRatingStore;
