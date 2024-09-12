import { profile } from "console";
import { z } from "zod";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const FormDataSchemaPatient = z
  .object({
    // name: z.string().min(1, "Name is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),

    //   lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),

    profilePic: z
      .any()
      .optional()
      .refine(
        (files) =>
          !files ||
          files.length === 0 ||
          ACCEPTED_IMAGE_MIME_TYPES.includes(files[0].type),
        "Only .jpg, .jpeg, and .png formats are supported."
      )
      .refine(
        (files) =>
          !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
        `Max image size is 5MB.`
      ),

    gender: z.string().min(1, "Gender is required"),
    bloodGroup: z.string().min(1, "Blood Group is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must be at most 20 characters long"),
    confirmPassword: z.string(),

    address: z.string().min(1, "Street is required"),

    contactNumber: z
      .string()
      .regex(/^\d{10}$/, "Phone number must be 10 digits"),

    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pinCode: z
      .number({
        invalid_type_error: "Pin code is required", // Custom error when no value is provided
      })
      .int("Ensure it is an integer") // Ensure it is an integer
      .min(100000, "Zip code must be at least 6 digits") // Minimum 6-digit number
      .max(999999, "Zip code can be at most 6 digits") // Maximum 6-digit number
      .transform((value) => Number(value)), // Transform input to number
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of the error message
  });
