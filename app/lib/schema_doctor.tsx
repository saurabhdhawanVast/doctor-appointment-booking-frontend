import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const FormDataSchemaDoctor = z
  .object({
    name: z.string().min(1, "Name is required"),
    //   lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),

    profilePic: z
      .any()
      .refine(
        (files) =>
          !files || ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
        "Only .jpg, .jpeg, and .png formats are supported."
      )
      .refine(
        (files) => !files || files?.[0]?.size <= MAX_FILE_SIZE,
        `Max image size is 5MB.`
      ),

    gender: z.string().min(1, "Gender is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long"),

    speciality: z.string().min(1, "Speciality is required"),
    qualification: z.string().min(1, "Qualification is required"),
    registrationNumber: z.string().min(1, "Registration number is required"),
    yearOfRegistration: z.string().min(1, "Year of registration is required"),
    stateMedicalCouncil: z.string().min(1, "State medical council is required"),
    bio: z.string().min(1, "Bio is required").max(1000, "Bio is too long"),

    document: z
      .any()
      .refine((files) => {
        return files?.[0]?.size <= MAX_FILE_SIZE;
      }, `Max image size is 5MB.`)
      .refine(
        (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),

    clinicAddress: z.string().min(1, "Street is required"),

    contactNumber: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be 10 digits"),

    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pinCode: z
      .number()
      .int() // Ensure it is an integer
      .min(100000, "Zip code must be at least 6 digits") // Minimum 6-digit number
      .max(999999, "Zip code can be at most 6 digits") // Maximum 6-digit number
      .transform((value) => Number(value)),

    clinicName: z.string().min(1, "Clinic name is required"),

    morningStartTime: z.string().min(1, "Start time is required"),
    morningEndTime: z.string().min(1, "End time is required"),
    eveningStartTime: z.string().min(1, "Start time is required"),
    eveningEndTime: z.string().min(1, "End time is required"),

    slotDuration: z.number().min(1, "Slot is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of the error message
  });
