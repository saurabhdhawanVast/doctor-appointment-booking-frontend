
import create from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
interface CreateContact {
    name: string,
    email: string,
    subject: string,
    message: string,
}

interface ContactsState {
  createContact: (article: CreateContact) => Promise<void>;
}

export const useContactStore = create<ContactsState>((set) => ({

  createContact: async (Contact) => {
    try {
      const res = await axios.post("http://localhost:3000/contact", Contact);
      toast.success("Contact added successfully");
    } catch (error) {
      console.error("Error creating Contact:", error);
      toast.error("Error adding contact");
    }
  },
}));

export default useContactStore;
