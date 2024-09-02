"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useLoginStore from "@/store/useLoginStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { usePatientStore } from "@/store/usePatientStore";

const patientSchema = z.object({
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits long"),
  address: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    pinCode: z.number().min(1, "Pin code is required"),
    state: z.string().min(1, "State is required"),
  }),
  bloodGroup: z.string().min(1, "Blood group is required"),
  gender: z.string().min(1, "Gender is required"),
  profilePic: z.string().url("Profile picture URL is invalid"),
});

type PatientInputs = z.infer<typeof patientSchema>;

const EditProfile = () => {
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientInputs>({
    resolver: zodResolver(patientSchema),
  });

  const { id } = useParams();
  const { patient, user } = useLoginStore();
  const { updateProfile } = usePatientStore();
  const role = user?._doc?.role;
  const router = useRouter();

  useEffect(() => {
    if (patient) {
      setValue("contactNumber", patient.contactNumber);
      setValue("address.address", patient?.address?.address);
      setValue("address.city", patient?.address?.city);
      setValue("address.pinCode", patient?.address?.pinCode);
      setValue("address.state", patient?.address?.state);
      setValue("bloodGroup", patient.bloodGroup);
      setValue("gender", patient.gender);
      setValue("profilePic", patient.profilePic);
      setProfilePicPreview(patient.profilePic);
    }
  }, [patient, setValue]);

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "doctors-app");
      uploadData.append("cloud_name", "dicldxhya");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dicldxhya/image/upload",
          {
            method: "post",
            body: uploadData,
          }
        );
        const data = await response.json();
        setValue("profilePic", data.url);
        setProfilePicPreview(data.url);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleUpdate: SubmitHandler<PatientInputs> = (data) => {
    if (patient) {
      updateProfile({ ...data, _id: patient?._id });
      handleCancel();
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderProfile = () => {
    switch (role) {
      case "doctor":
        return <></>; // Add specific form fields for doctors if needed
      case "patient":
        return (
          <>
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
              <div className="relative flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="relative">
                  <img
                    src={profilePicPreview || "/default-profile-pic.png"}
                    alt="Profile Picture"
                    className="w-24 h-24 rounded-full object-cover cursor-pointer md:w-32 md:h-32"
                    onClick={handleImageClick}
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer">
                    <input
                      type="file"
                      onChange={uploadImage}
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                      <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                    </svg>
                  </label>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Profile Picture
                  </h3>
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="contactNumber"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  type="text"
                  {...register("contactNumber")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                {errors.contactNumber && (
                  <p className="mt-2 text-sm text-red-400">
                    {(errors.contactNumber as { message: string }).message ||
                      "Contact number error"}
                  </p>
                )}
              </div>

              {[
                "address.address",
                "address.city",
                "address.pinCode",
                "address.state",
              ].map((field) => {
                const [base, sub] = field.split(".");
                return (
                  <div key={field} className="mt-4">
                    <label
                      htmlFor={field}
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      {sub
                        ? sub.charAt(0).toUpperCase() + sub.slice(1)
                        : base.charAt(0).toUpperCase() + base.slice(1)}
                    </label>
                    <input
                      id={field}
                      type="text"
                      {...register(field as keyof PatientInputs)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.address &&
                      errors.address[sub as keyof typeof errors.address] && (
                        <p className="mt-2 text-sm text-red-400">
                          {(
                            errors.address[
                              sub as keyof typeof errors.address
                            ] as { message: string }
                          ).message || "Address error"}
                        </p>
                      )}
                  </div>
                );
              })}

              <div className="mt-4">
                <label
                  htmlFor="bloodGroup"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Blood Group
                </label>
                <input
                  id="bloodGroup"
                  type="text"
                  {...register("bloodGroup")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                {errors.bloodGroup && (
                  <p className="mt-2 text-sm text-red-400">
                    {(errors.bloodGroup as { message: string }).message ||
                      "Blood group error"}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label
                  htmlFor="gender"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Gender
                </label>
                <input
                  id="gender"
                  type="text"
                  {...register("gender")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
                {errors.gender && (
                  <p className="mt-2 text-sm text-red-400">
                    {(errors.gender as { message: string }).message ||
                      "Gender error"}
                  </p>
                )}
              </div>

              <div className="flex flex-col md:flex-row justify-end mt-6 space-y-2 md:space-y-0 md:space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn rounded-3xl bg-red-500 text-white font-bold py-2 px-4 hover:bg-red-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-transparent border-2 border-blue-500 rounded-3xl text-black font-light hover:bg-blue-400 hover:-translate-y-1"
                >
                  <svg
                    className="feather feather-edit"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Update
                </button>
              </div>
            </form>

            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg relative max-w-md w-full">
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-3 right-3 bg-gray-800 p-2 rounded-full text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <img
                    src={profilePicPreview || "/default-profile-pic.png"}
                    alt="Profile Picture"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="container mx-auto py-10 mt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Edit Profile
      </h2>
      {renderProfile()}
    </div>
  );
};

export default EditProfile;
