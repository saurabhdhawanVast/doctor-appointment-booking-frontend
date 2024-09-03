import create from "zustand";
import axios from "axios";

interface CreateReport {
  reportName: string;
  uploadReport: string;
  type: string;
  date: Date;
}

interface Report {
  _id: string;
  reportName: string;
  uploadReport: string;
  type: string;
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
      const queryString = new URLSearchParams({
        filter: JSON.stringify(query),
      }).toString();
      const response = await axios.get(
        `http://localhost:3000/reports?${queryString}`
      );
      console.log(response.data);
      set({ reports: response.data });
    } catch (error) {
      console.error("Error fetching Reports:", error);
    }
  },

  removeReport: async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/reports/${id}`
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
      await axios.post("http://localhost:3000/reports", Report);
    } catch (error) {
      console.error("Error creating Report:", error);
    }
  },
}));

export default useReportStore;
