import { create } from 'zustand';
import axios from 'axios';

export interface RegisterStoreState {

    signup: (data: {
        name: string;
        gender: string;
        email: string;
        profilePic: string
        password: string;
        speciality: string;
        qualification: string;
        registrationNumber: string;
        yearOfRegistration: string;
        stateMedicalCouncil: string;
        bio: string;
        document: string
        clinicAddress: string;
        contactNumber: string;
        city: string;
        state: string;
        pinCode: number;
        clinicName: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        morningStartTime: string;
        morningEndTime: string;
        eveningStartTime: string;
        eveningEndTime: string;
        slotDuration: number;
    }) => Promise<boolean>
}


const https = axios.create({
    baseURL: 'http://localhost:3000'
});


const RegisterDoctorStore = create<RegisterStoreState>((set) => ({
    signup: async (data) => {
        try {
            console.log("sending request through frontend ")
            console.log(data)
            const res = await https.post('/users/doctor', data);
            set(() => ({ signup: res.data }));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
}));

export default RegisterDoctorStore;
