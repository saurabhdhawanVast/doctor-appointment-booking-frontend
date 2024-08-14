import { create } from 'zustand';
import axios from 'axios';

export interface RegisterStoreState {

    signup: (data: {
        name: string;
        gender: string;
        bloodGroup: string;
        email: string;
        profilePic: string
        password: string;
        address: string;
        contactNumber: string;
        city: string;
        state: string;
        pinCode: number;


    }) => Promise<boolean>
}


const https = axios.create({
    baseURL: 'http://localhost:3000'
});


const RegisterPatientStore = create<RegisterStoreState>((set) => ({
    signup: async (data) => {
        try {
            console.log("sending request through frontend ")
            console.log("From signup", data)
            const res = await https.post('/users/patient', data);
            set(() => ({ signup: res.data }));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
}));

export default RegisterPatientStore;
