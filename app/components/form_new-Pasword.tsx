// "use client"; // Ensure this file is client-side rendered

// import { useForm, SubmitHandler } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useState } from "react";

// // Define the Zod schema for the new password form
// const newPasswordSchema = z
//   .object({
//     password: z.string().min(6, "Password must be at least 6 characters long"),
//     confirmPassword: z
//       .string()
//       .min(6, "Confirm Password must be at least 6 characters long"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// type Inputs = z.infer<typeof newPasswordSchema>;

// interface NewPasswordFormProps {
//   token: string | null; // Accept token as a prop
// }

// const NewPasswordForm: React.FC<NewPasswordFormProps> = ({ token }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<Inputs>({
//     resolver: zodResolver(newPasswordSchema),
//   });

//   const [loading, setLoading] = useState(false);

//   const processForm: SubmitHandler<Inputs> = async (data) => {
//     if (!token) {
//       alert("Token is missing.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(
//         "http://localhost:3000/auth/reset-password",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             newPassword: data.password,
//             resetToken: token, // Include token in the request body
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to reset password");
//       }

//       alert("Password has been successfully reset.");
//       window.location.href = "/login";
//     } catch (error) {
//       console.error(error);
//       alert(
//         "An error occurred while resetting the password. Please try again later."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="py-24">
//       <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-md">
//         <div className="w-full p-8">
//           <h2 className="text-2xl font-semibold text-gray-700 text-center">
//             Create New Password
//           </h2>

//           <form onSubmit={handleSubmit(processForm)}>
//             <div className="mt-4">
//               <label
//                 htmlFor="password"
//                 className="block text-gray-700 text-sm font-bold mb-2"
//               >
//                 New Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 {...register("password")}
//                 autoComplete="new-password"
//                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
//               />
//               {errors.password && (
//                 <p className="mt-2 text-sm text-red-400">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <div className="mt-4">
//               <label
//                 htmlFor="confirmPassword"
//                 className="block text-gray-700 text-sm font-bold mb-2"
//               >
//                 Confirm Password
//               </label>
//               <input
//                 id="confirmPassword"
//                 type="password"
//                 {...register("confirmPassword")}
//                 autoComplete="new-password"
//                 className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
//               />
//               {errors.confirmPassword && (
//                 <p className="mt-2 text-sm text-red-400">
//                   {errors.confirmPassword.message}
//                 </p>
//               )}
//             </div>

//             <div className="mt-8">
//               <button
//                 type="submit"
//                 className={`bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600 ${
//                   loading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 disabled={loading}
//               >
//                 {loading ? "Processing..." : "Reset Password"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewPasswordForm;

"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import useResetPasswordStore from "@/store/useResetPasswordStore";
// import useResetPasswordStore from "@/store/useResetPasswordStore"; // Adjust the import path as necessary

// Define the Zod schema for the new password form
const newPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Inputs = z.infer<typeof newPasswordSchema>;

interface NewPasswordFormProps {
  token: string | null; // Accept token as a prop
}

const NewPasswordForm: React.FC<NewPasswordFormProps> = ({ token }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(newPasswordSchema),
  });

  const { resetPassword, loading } = useResetPasswordStore((state) => ({
    resetPassword: state.resetPassword,
    loading: state.loading,
  }));

  const processForm: SubmitHandler<Inputs> = async (data) => {
    if (!token) {
      alert("Token is missing.");
      return;
    }

    await resetPassword(data.password, token);
  };

  return (
    <div className="py-24">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-md">
        <div className="w-full p-8">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Create New Password
          </h2>

          <form onSubmit={handleSubmit(processForm)}>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                autoComplete="new-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                autoComplete="new-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className={`bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordForm;
