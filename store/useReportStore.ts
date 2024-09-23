import create from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import useLoginStore from "./useLoginStore";
interface CreateReport {
  reportName: string;
  uploadReport: string;
  type: string;
  date: Date;
  doctor?: string;
  appointmentDate?: Date;
}

interface Report {
  _id: string;
  reportName: string;
  uploadReport: string;
  type: string;
  doctor?: { _id: string; name: string };
  appointmentDate?: Date;
  date: Date;
  patient: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

interface ReportsState {
  reports: Report[];
  fetchReports: (query?: Record<string, any>) => Promise<void>;
  removeReport: (id?: string) => Promise<void>;
  createReport: (article: CreateReport) => Promise<void>;
}

export const useReportStore = create<ReportsState>((set) => ({
  reports: [],
  report: null,
  fetchReports: async (query = {}) => {
    try {
      const token = useLoginStore.getState().token;
      const queryString = new URLSearchParams({
        filter: JSON.stringify(query),
      }).toString();
      const response = await axios.get(
        `http://localhost:3000/reports?${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      set({ reports: response.data });
    } catch (error) {
      console.error("Error fetching Reports:", error);
    }
  },

  removeReport: async (id) => {
    try {
      const token = useLoginStore.getState().token;
      const response = await axios.delete(
        `http://localhost:3000/reports/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        reports: state.reports.filter((report) => report._id !== id),
      }));
    } catch (error) {
      console.error("Error fetching Reports:", error);
    }
  },

  createReport: async (Report) => {
    try {
      const token = useLoginStore.getState().token;
      await axios.post("http://localhost:3000/reports", Report, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Report added successfully");
    } catch (error) {
      console.error("Error creating Report:", error);
      toast.error("Error adding report");
    }
  },
}));

export default useReportStore;
