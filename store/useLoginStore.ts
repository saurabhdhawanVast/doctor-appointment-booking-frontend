"use client";
import { toast } from "react-toastify";
import { create } from "zustand";

interface Input {
    email: string;
    password: string;
}



export interface User {
    _doc: {
        _id: string; // MongoDB's unique identifier
        email: string;
        name: string;
        password: string;
        role: string;
        isEmailVerified: boolean;
        is_verified: boolean;
        createdAt: Date;
        updatedAt: Date;
        __v: number; // Version key from Mongoose
    };
    exp: number; // Token expiration time
    iat: number; // Token issued at time
    $isNew?: boolean; // Indicates if the document is new
    $__?: {
        activePaths: any; // Additional metadata, can be further typed if needed
        skipId: boolean;
    };
}

interface LoginState {
    isLoggedIn: boolean;
    token: string | null;


    user: User | null;
    login: (data: Input) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

const useLoginStore = create<LoginState>((set, get) => ({


    // isLoggedIn: !!sessionStorage.getItem("token") || false,
    // token: sessionStorage.getItem("token") || null,

    isLoggedIn: false, // Default value
    token: null,       // Default value
    user: null,



    login: async (data: Input) => {
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }

            const resData = await response.json();
            const accessToken = resData["access_token"];
            sessionStorage.setItem("token", accessToken);
            // Update token in state
            set({ isLoggedIn: true, token: accessToken });
            toast.success("Login successful");

            // Fetch user profile after login
            // await get().fetchUser();
        } catch (error) {
            if (error instanceof Error) {
                console.error("Login failed:", error.message);
            } else {
                console.error("Login failed:", error);
            }
            toast.error("Email or password is incorrect");
        }
    },

    fetchUser: async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:3000/auth/profile', {
                method: 'GET',
                headers: {
                    'Authorization': ` ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                console.log(`Store userData is ${userData}`);
                set({ user: userData });
            } else {
                set({ token: "", user: null });
                sessionStorage.removeItem("token");
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error("Failed to fetch user:", error.message);
            } else {
                console.error("Failed to fetch user:", error);
            }
        }
    },

    logout: () => {
        sessionStorage.removeItem("token");
        set({ isLoggedIn: false, token: null });
    },
}));

export default useLoginStore;