import { create } from 'zustand';
import axios from 'axios';
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

    getUserByEmail: (email: string) => Promise<User>;

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

    getUserByEmail: async (email: string) => {
        try {
            console.log("Fetching user by Store email through frontend ", email);

            const res = await https.get('/users/getUserByEmail', {
                params: {
                    email: email
                }
            });

            console.log(`User fetched by email: ${res}`);
            if (res.data) {
                return res.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }


}));

export default RegisterDoctorStore;
