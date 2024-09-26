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
const https = axios.create({
  baseURL: "http://localhost:3000", // Adjust if necessary
});
const token = useLoginStore.getState().token;

export const useReportStore = create<ReportsState>((set) => ({
  reports: [],
  report: null,
  fetchReports: async (query = {}) => {
    try {

      const queryString = new URLSearchParams({
        filter: JSON.stringify(query),
      }).toString();
      const response = await https.get(
        `/reports?${queryString}`,
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

      const response = await https.delete(
        `/reports/${id}`,
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

      await https.post("/reports", Report, {
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
