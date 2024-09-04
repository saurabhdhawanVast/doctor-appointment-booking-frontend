import create from "zustand";
import axios from "axios";

interface CreateRating {
  doctor: string;
  patient: string;
  comment: string;
  rating: number;
}

interface Rating {
  _id: string;
  doctor: string;
  patient: string;
  comment: string;
  rating: number;
}

interface RatingsState {
  createRating: (article: CreateRating) => Promise<void>;
}

export const useRatingStore = create<RatingsState>((set) => ({
  createRating: async (Rating) => {
    console.log(`creating rating${JSON.stringify(Rating)}`);
    try {
      await axios.post("http://localhost:3000/ratings", Rating);
    } catch (error) {
      console.error("Error creating Rating:", error);
    }
  },
}));

export default useRatingStore;
