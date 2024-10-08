
import { toast } from "react-toastify";
import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import { Doctor } from "./useDoctorStore";
import { Patients } from "./usePatientStore";



interface Input {
  email: string;
  password: string;
}

export interface User {
  _doc: {
    _id: string;
    email: string;
    name: string;
    password: string;
    role: string;
    isEmailVerified: boolean;
    is_verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };
  exp: number;
  iat: number;
  $isNew?: boolean;
  $__?: {
    activePaths: any;
    skipId: boolean;
  };
}

export interface Address {
  address: string;
  city: string;
  state: string;
  pinCode: number;
}

// export interface Patient {
//   _id?: string;
//   name: string;
//   gender: string;
//   bloodGroup: string;
//   email: string;
//   profilePic: string;
//   password: string;
//   address: Address;
//   contactNumber: string;
//   city: string;
//   state: string;
//   pinCode: number;
// }



interface LoginState {
  isLoggedIn: boolean;

  token: string | null;
  user: User | null;
  doctor: Doctor | null;
  patient: Patients | null;
  login: (data: Input) => Promise<void>;
  setPatient: (patient: Patients) => Promise<void>;
  //update dr
  setDoctor: (doctor: Doctor) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  initializeState: () => void; // Added method to interface
}

const https = axios.create({
  baseURL: "http://localhost:3000",
});

const useLoginStore = create<LoginState>((set, get) => ({
  isLoggedIn: false,

  token: null,
  user: null,
  doctor: null,
  patient: null,

  login: async (data: Input) => {
    try {
      const response = await https.post(
        "/auth/login",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const accessToken = response.data["access_token"];
      if (!accessToken) {
        throw new Error("Access token not found in the response");
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("token", accessToken);
      }

      // Fetch user profile after login
      await get().fetchUser();

      const user = get().user;
      let role: string;
      if (user) {
        role = user._doc.role;
        console.log(`Loggedin user role is ${role}`);
        // Store role in a cookie
        Cookies.set("role", role, { expires: 7, path: "/" });
        // localStorage.setItem("role", role);

        Cookies.set("authToken", accessToken, { expires: 7, path: "/" }); // Cookie valid for 7 days, available on all paths
      }
      if (user && user._doc.role === "doctor") {
        const doctorResponse = await https.get(
          `/doctors/fetchDoctorByUserId/${user._doc._id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
        );

        const doctor = doctorResponse.data;
        set({ doctor });

        if (doctor.isVerified === false) {
          toast.error("You are yet to be verified by the admin.");
          get().logout();
          return;
        }

        if (typeof window !== "undefined") {
          sessionStorage.setItem("doctor", JSON.stringify(doctor));
        }
      }

      set({ isLoggedIn: true, token: accessToken });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Login failed:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Login failed:", error);
      }
      toast.error("Email or password is incorrect");
    }
  },

  setPatient: async (patient) => {
    set({ patient });
    if (typeof window !== "undefined") {
      sessionStorage.setItem("patient", JSON.stringify(patient));
    }
  },

  //update dr
  setDoctor: async (doctor) => {
    set({ doctor });
    if (typeof window !== "undefined") {
      sessionStorage.setItem("doctor", JSON.stringify(doctor));
    }
  },

  fetchUser: async () => {
    const token =
      typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    if (!token) return;

    try {
      const response = await https.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,

        },
      });

      set({ user: response.data });
      if (typeof window !== "undefined") {
        sessionStorage.setItem("user", JSON.stringify(response.data));
      }

      if (response.data._doc.role === "doctor") {
        const doctorResponse = await https.get(
          `/doctors/fetchDoctorByUserId/${response.data._doc._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },

        );

        set({ doctor: doctorResponse.data });
        if (typeof window !== "undefined") {
          sessionStorage.setItem("doctor", JSON.stringify(doctorResponse.data));
        }
      }

      if (response.data._doc.role === "patient") {
        const patientResponse = await https.get(
          `/patients/fetchPatientByUserId/${response.data._doc._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        set({ patient: patientResponse.data });
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "patient",
            JSON.stringify(patientResponse.data)
          );
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to fetch user:",
          error.response?.data?.message || error.message
        );
      } else {
        console.error("Failed to fetch user:", error);
      }
      set({ token: null, user: null, doctor: null, patient: null });
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("token");
      }
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("doctor");
      sessionStorage.removeItem("patient");
      Cookies.remove("role");
      Cookies.remove("authToken");
    }
    set({
      isLoggedIn: false,
      token: null,
      user: null,
      doctor: null,
      patient: null,
    });
  },

  initializeState: () => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      const user = sessionStorage.getItem("user");
      const doctor = sessionStorage.getItem("doctor");
      const patient = sessionStorage.getItem("patient");
      console.log(patient);
      set({
        isLoggedIn: !!token,
        token,
        user: user ? JSON.parse(user) : null,
        doctor: doctor ? JSON.parse(doctor) : null,
        patient: patient ? JSON.parse(patient) : null,
      });
    }
  },
}));

// Initialize state on store creation
if (typeof window !== "undefined") {
  useLoginStore.getState().initializeState();
}

export default useLoginStore;