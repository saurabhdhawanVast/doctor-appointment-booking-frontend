// import { create } from "zustand";
// import axios from "axios";

// interface Appointment {
//   _id: string;
//   doctor: Doctor;
//   patient: Patient;
//   appointmentDate: Date;
//   isAppointmentRated?: boolean;
//   slot: Slot;
//   status: string;
// }

// interface Slot {
//   _id: string;
//   time: string;
//   available: string;
// }

// interface Doctor {
//   _id: string;
//   user: string;
//   speciality: string;
//   qualification: string;
//   contactNumber: string;
//   registrationNumber: string;
//   yearOfRegistration: string;
//   stateMedicalCouncil: string;
//   name: string;
//   bio: string;
//   document: string;
//   isVerified: boolean;
//   isEmailVerified: boolean;
//   gender: string;
//   profilePic: string;
//   clinicDetails: ClinicDetails;
//   location: Location;
// }

// interface ClinicDetails {
//   clinicName: string;
//   clinicAddress: string;
//   city: string;
//   state: string;
//   morningStartTime: string;
//   morningEndTime: string;
//   eveningStartTime: string;
//   eveningEndTime: string;
//   slotDuration: number;
// }

// interface Location {
//   type: string;
//   coordinates: [number, number];
// }

// interface Patient {
//   _id: string;
//   user: string;
//   contactNumber: string;
//   address: Address;
//   bloodGroup: string;
//   gender: string;
//   profilePic: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Address {
//   address: string;
//   city: string;
//   pinCode: number;
//   state: string;
// }

// // Define types within the same file
// export interface PatientDetails {
//   name: string;
//   contactNumber?: string;
//   patientId?: string; // Ensure patientId is included
// }

// export interface AppointmentSlot {
//   slotId: string;
//   time: string;
//   patient?: PatientDetails;
// }

// export interface DateWithSlots {
//   date: string;
//   appointmentsBooked: AppointmentSlot[];
//   status: string;
// }

// export interface DoctorDetails {
//   name: string;
//   specialty?: string;
//   contactNumber?: string;
// }

// export interface Prescription {
//   appointmentData: string;
//   slotId: string;
//   patientId: string;
//   doctorId: string;
//   patientName: string;
//   doctorName: string;
//   medicines: {
//     name: string;
//     dosage: string[];
//     time: string;
//     days: number;
//   }[];
// }

// export interface AppointmentStore {
//   appointments: DateWithSlots[];
//   upcomingAppointments: Appointment[]; // Add upcoming appointments to the store for displaying on the dashboard
//   filteredAppointments: DateWithSlots[];
//   doctorDetails: DoctorDetails | null;
//   fetchAppointments: (doctorId: string, initialDate?: Date) => Promise<void>;
//   fetchDoctorDetails: (doctorId: string) => Promise<void>;
//   filterAppointmentsByDate: (selectedDate: Date) => void;
//   savePrescription: (prescription: Prescription) => Promise<void>;
//   getAppointments: (query?: Record<string, any>) => Promise<void>;
// }

// const https = axios.create({
//   baseURL: "http://localhost:3000", // Adjust if necessary
// });

// const useAppointmentStore = create<AppointmentStore>((set) => ({
//   appointments: [],
//   upcomingAppointments: [],
//   filteredAppointments: [],
//   doctorDetails: null,
//   getAppointments: async (query = {}) => {
//     try {
//       const queryString = new URLSearchParams({
//         filter: JSON.stringify(query),
//       }).toString();
//       console.log("Query String is ", queryString);
//       const response = await https.get(`/appointments?${queryString}`);
//       for (let appointment of response.data) {
//         let slots = appointment?.doctor?.availability?.find(
//           (availability: any) =>
//             availability.date ===
//             new Date(appointment.appointmentDate).toISOString().split("T")[0]
//         );
//         if (slots) {
//           console.log(slots);
//           let selectedSlot = slots.slots.find(
//             (slot: any) => slot._id === appointment.slot
//           );
//           if (selectedSlot) {
//             appointment.slot = selectedSlot;
//           }
//         }
//         let ratings = await https.get(
//           `/ratings/appointment/${appointment._id}`
//         );
//         console.log("ratings", ratings);
//         if (ratings && ratings.data && ratings.data.length > 0) {
//           appointment.isAppointmentRated = true;
//         } else {
//           appointment.isAppointmentRated = false;
//         }
//       }
//       console.log(response.data);
//       set({ upcomingAppointments: response.data });
//     } catch (error) {
//       console.error("Error fetching appiontments:", error);
//     }
//   },
//   fetchAppointments: async (doctorId: string, initialDate?: Date) => {
//     try {
//       const response = await https.get(
//         `/appointments/getAppointmentsByDoctorId?doctorId=${doctorId}`
//       );
//       console.log("response.data", response.data);
//       const appointments: DateWithSlots[] = response.data;

//       let filteredAppointments: DateWithSlots[] = [];

//       if (initialDate) {
//         filteredAppointments = appointments.filter((item) => {
//           const appointmentDate = new Date(item.date);
//           return (
//             appointmentDate.getFullYear() === initialDate.getFullYear() &&
//             appointmentDate.getMonth() === initialDate.getMonth() &&
//             appointmentDate.getDate() === initialDate.getDate()
//           );
//         });
//       } else {
//         // Filter for today's date
//         const today = new Date();
//         filteredAppointments = appointments.filter((item) => {
//           const appointmentDate = new Date(item.date);
//           return (
//             appointmentDate.getFullYear() === today.getFullYear() &&
//             appointmentDate.getMonth() === today.getMonth() &&
//             appointmentDate.getDate() === today.getDate()
//           );
//         });
//       }
//       // console.log("filteredAppointments", filteredAppointments);
//       // console.log("appointments", appointments);
//       set({
//         appointments,
//         filteredAppointments:
//           filteredAppointments.length > 0 ? filteredAppointments : [],
//       });
//     } catch (error) {
//       console.error("Failed to fetch appointments:", error);
//     }
//   },

//   fetchDoctorDetails: async (doctorId: string) => {
//     try {
//       const response = await https.get(`/doctors/getDoctorById/${doctorId}`);
//       const doctorDetails: DoctorDetails = response.data;

//       set({ doctorDetails });
//     } catch (error) {
//       console.error("Failed to fetch doctor details:", error);
//     }
//   },
//   filterAppointmentsByDate: (selectedDate: Date) => {
//     set((state) => {
//       const filteredAppointments = state.appointments.filter((item) => {
//         const appointmentDate = new Date(item.date);
//         return (
//           appointmentDate.getFullYear() === selectedDate.getFullYear() &&
//           appointmentDate.getMonth() === selectedDate.getMonth() &&
//           appointmentDate.getDate() === selectedDate.getDate()
//         );
//       });

//       return {
//         filteredAppointments:
//           filteredAppointments.length > 0 ? filteredAppointments : [],
//       };
//     });
//   },
//   savePrescription: async (prescription: Prescription) => {
//     try {
//       await https.post("/prescriptions/savePrescription", prescription);
//       console.log("Prescription saved successfully");
//     } catch (error) {
//       console.error("Failed to save prescription:", error);
//     }
//   },
// }));

// export default useAppointmentStore;

import { create } from "zustand";
import axios from "axios";

interface Appointment {
  _id: string;
  doctor: Doctor;
  patient: Patient;
  appointmentDate: Date;
  isAppointmentRated?: boolean;
  slot: Slot;
  status: string;
}

interface Slot {
  _id: string;
  time: string;
  available: string;
}

interface Doctor {
  _id: string;
  user: string;
  speciality: string;
  qualification: string;
  contactNumber: string;
  registrationNumber: string;
  yearOfRegistration: string;
  stateMedicalCouncil: string;
  name: string;
  bio: string;
  document: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  gender: string;
  profilePic: string;
  clinicDetails: ClinicDetails;
  location: Location;
}

interface ClinicDetails {
  clinicName: string;
  clinicAddress: string;
  city: string;
  state: string;
  morningStartTime: string;
  morningEndTime: string;
  eveningStartTime: string;
  eveningEndTime: string;
  slotDuration: number;
}

interface Location {
  type: string;
  coordinates: [number, number];
}

interface Patient {
  _id: string;
  user: string;
  contactNumber: string;
  address: Address;
  bloodGroup: string;
  gender: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

interface Address {
  address: string;
  city: string;
  pinCode: number;
  state: string;
}

// Define types within the same file
export interface PatientDetails {
  name: string;
  contactNumber?: string;
  patientId?: string; // Ensure patientId is included
}

export interface AppointmentSlot {
  slotId: string;
  time: string;
  patient?: PatientDetails;
}

export interface DateWithSlots {
  date: string;
  appointmentsBooked: AppointmentSlot[];
  status: string;
}

export interface DoctorDetails {
  name: string;
  specialty?: string;
  contactNumber?: string;
}

export interface Prescription {
  appointmentData: string;
  slotId: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  medicines: {
    name: string;
    dosage: string[];
    time: string;
    days: number;
  }[];
}

export interface AppointmentStore {
  appointments: DateWithSlots[];
  upcomingAppointments: Appointment[]; // Add upcoming appointments to the store for displaying on the dashboard
  filteredAppointments: DateWithSlots[];
  doctorDetails: DoctorDetails | null;
  fetchAppointments: (doctorId: string, initialDate?: Date) => Promise<void>;
  fetchDoctorDetails: (doctorId: string) => Promise<void>;
  filterAppointmentsByDate: (selectedDate: Date) => void;
  savePrescription: (prescription: Prescription) => Promise<void>;
  getAppointments: (query?: Record<string, any>) => Promise<void>;
}

const https = axios.create({
  baseURL: "http://localhost:3000", // Adjust if necessary
});

const useAppointmentStore = create<AppointmentStore>((set) => ({
  appointments: [],
  upcomingAppointments: [],
  filteredAppointments: [],
  doctorDetails: null,
  getAppointments: async (query = {}) => {
    try {
      const queryString = new URLSearchParams({
        filter: JSON.stringify(query),
      }).toString();
      console.log("Query String is ", queryString);
      const response = await https.get(`/appointments?${queryString}`);
      for (let appointment of response.data) {
        let slots = appointment?.doctor?.availability?.find(
          (availability: any) =>
            availability.date ===
            new Date(appointment.appointmentDate).toISOString().split("T")[0]
        );
        if (slots) {
          console.log(slots);
          let selectedSlot = slots.slots.find(
            (slot: any) => slot._id === appointment.slot
          );
          if (selectedSlot) {
            appointment.slot = selectedSlot;
          }
        }
        let ratings = await https.get(
          `/ratings/appointment/${appointment._id}`
        );
        console.log("ratings", ratings);
        if (ratings && ratings.data && ratings.data.length > 0) {
          appointment.isAppointmentRated = true;
        } else {
          appointment.isAppointmentRated = false;
        }
      }
      console.log(response.data);
      set({ upcomingAppointments: response.data });
    } catch (error) {
      console.error("Error fetching appiontments:", error);
    }
  },

  fetchAppointments: async (doctorId: string, initialDate?: Date) => {
    try {
      const response = await https.get(
        `/appointments/getAppointmentsByDoctorId?doctorId=${doctorId}`
      );
      console.log("response.data", response.data);

      let appointments: DateWithSlots[] = response.data;

      // Sort the main appointments array by time
      appointments = appointments.map((appointmentDay) => {
        const sortedAppointmentsBooked = appointmentDay.appointmentsBooked.sort(
          (a, b) => {
            const timeA = a.time.split(":").map(Number);
            const timeB = b.time.split(":").map(Number);

            // Compare hours first, and if equal, compare minutes
            if (timeA[0] !== timeB[0]) {
              return timeA[0] - timeB[0];
            } else {
              return timeA[1] - timeB[1];
            }
          }
        );
        console.log(appointments);
        return {
          ...appointmentDay,
          appointmentsBooked: sortedAppointmentsBooked,
        };
      });

      let filteredAppointments: DateWithSlots[] = [];

      if (initialDate) {
        // Filter appointments based on the provided initialDate
        filteredAppointments = appointments.filter((item) => {
          const appointmentDate = new Date(item.date);
          return (
            appointmentDate.getFullYear() === initialDate.getFullYear() &&
            appointmentDate.getMonth() === initialDate.getMonth() &&
            appointmentDate.getDate() === initialDate.getDate()
          );
        });
      } else {
        // Filter appointments for today's date
        const today = new Date();
        filteredAppointments = appointments.filter((item) => {
          const appointmentDate = new Date(item.date);
          return (
            appointmentDate.getFullYear() === today.getFullYear() &&
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getDate() === today.getDate()
          );
        });
      }

      // Sort the filteredAppointments array by time
      filteredAppointments = filteredAppointments.map((appointmentDay) => {
        const sortedAppointmentsBooked = appointmentDay.appointmentsBooked.sort(
          (a, b) => {
            const timeA = a.time.split(":").map(Number);
            const timeB = b.time.split(":").map(Number);

            // Compare hours first, and if equal, compare minutes
            if (timeA[0] !== timeB[0]) {
              return timeA[0] - timeB[0];
            } else {
              return timeA[1] - timeB[1];
            }
          }
        );
        return {
          ...appointmentDay,
          appointmentsBooked: sortedAppointmentsBooked,
        };
      });

      console.log("Sorted appointments:", appointments);
      console.log("Filtered and sorted appointments:", filteredAppointments);

      set({
        appointments,
        filteredAppointments:
          filteredAppointments.length > 0 ? filteredAppointments : [],
      });
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  },

  fetchDoctorDetails: async (doctorId: string) => {
    try {
      const response = await https.get(`/doctors/getDoctorById/${doctorId}`);
      const doctorDetails: DoctorDetails = response.data;

      set({ doctorDetails });
    } catch (error) {
      console.error("Failed to fetch doctor details:", error);
    }
  },
  filterAppointmentsByDate: (selectedDate: Date) => {
    set((state) => {
      const filteredAppointments = state.appointments.filter((item) => {
        const appointmentDate = new Date(item.date);
        return (
          appointmentDate.getFullYear() === selectedDate.getFullYear() &&
          appointmentDate.getMonth() === selectedDate.getMonth() &&
          appointmentDate.getDate() === selectedDate.getDate()
        );
      });

      return {
        filteredAppointments:
          filteredAppointments.length > 0 ? filteredAppointments : [],
      };
    });
  },
  savePrescription: async (prescription: Prescription) => {
    try {
      await https.post("/prescriptions/savePrescription", prescription);
      console.log("Prescription saved successfully");
    } catch (error) {
      console.error("Failed to save prescription:", error);
    }
  },
}));

export default useAppointmentStore;
