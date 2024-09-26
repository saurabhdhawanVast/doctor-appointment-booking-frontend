"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useLoginStore from "@/store/useLoginStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { usePatientStore } from "@/store/usePatientStore";
import { toast } from "react-toastify";

const config = {
  cUrl: "https://api.countrystatecity.in/v1/countries",
  ckey: "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==",
};

const patientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits long"),
  address: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    pinCode: z.number(),
    state: z.string().min(1, "State is required"),
  }),
  bloodGroup: z.string().min(1, "Blood group is required"),
  gender: z.string().min(1, "Gender is required"),
  profilePic: z.string().url("Profile picture URL is invalid"),
});

type PatientInputs = z.infer<typeof patientSchema>;

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const EditProfile = () => {
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [states, setStates] = useState<{ name: string; iso2: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

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
    const fetchStates = async () => {
      try {
        const response = await fetch(`${config.cUrl}/IN/states`, {
          headers: { "X-CSCAPI-KEY": config.ckey },
        });
        const data = await response.json();
        setStates(
          data.map((state: { name: string; iso2: string }) => ({
            name: state.name,
            iso2: state.iso2,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch states:", error);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        try {
          const response = await fetch(
            `${config.cUrl}/IN/states/${selectedState}/cities`,
            { headers: { "X-CSCAPI-KEY": config.ckey } }
          );
          const data = await response.json();
          const seenNames = new Set<string>();
          const uniqueCities = data
            .filter((city: { name: string }) => {
              if (seenNames.has(city.name)) {
                return false;
              } else {
                seenNames.add(city.name);
                return true;
              }
            })
            .map((city: { name: string }) => city.name);

          setCities(uniqueCities);
        } catch (error) {
          console.error("Failed to fetch cities:", error);
        }
      };

      fetchCities();
    }
  }, [selectedState]);

  useEffect(() => {
    if (patient) {
      setValue("name", patient.name);
      setValue("contactNumber", patient.contactNumber);
      setValue("address.address", patient?.address?.address);
      setValue("address.city", patient?.address?.city);
      if (patient?.address?.pinCode) {
        console.log(typeof patient?.address?.pinCode);
        setValue(
          "address.pinCode",
          parseInt(patient.address.pinCode.toString())
        );
      }
      setValue("address.state", patient?.address?.state);
      setValue("bloodGroup", patient.bloodGroup);
      setValue("gender", patient.gender);
      setValue("profilePic", patient.profilePic);
      setProfilePicPreview(patient.profilePic);
      setSelectedState(patient?.address?.state);
      setSelectedCity(patient?.address?.city);
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
        setValue("profilePic", data.secure_url);
        console.log(data);
        setProfilePicPreview(data.secure_url);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleUpdate: SubmitHandler<PatientInputs> = (data) => {
    if (patient) {
      updateProfile({ ...data, _id: patient?._id });
      toast.success("Profile updated successfully");
      handleCancel();
    }
  };
  useEffect(() => {
    console.log("updateProfile", profilePicPreview);
  }, [profilePicPreview]);
  const handleCancel = () => {
    router.back();
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  // const renderProfile = () => {
  //       switch (role) {
  //         case "doctor":
  //           return <></>; // Add specific form fields for doctors if needed
  //         case "patient":

  return (
    <>
      <form
        onSubmit={handleSubmit(handleUpdate)}
        className="space-y-6 mt-20 p-6"
      >
        <div className="relative flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0 ">
          <div className="relative">
            <img
              src={profilePicPreview || "/images/default.jpg"}
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
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic">{errors.name.message}</p>
          )}
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
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.contactNumber ? "border-red-500" : ""
            }`}
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-xs italic">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            {...register("address.address")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.address?.address ? "border-red-500" : ""
            }`}
          />
          {errors.address?.address && (
            <p className="text-red-500 text-xs italic">
              {errors.address.address.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="state"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            State
          </label>
          <select
            id="state"
            {...register("address.state")}
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.address?.state ? "border-red-500" : ""
            }`}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.iso2} value={state.iso2}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.address?.state && (
            <p className="text-red-500 text-xs italic">
              {errors.address.state.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="city"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            City
          </label>
          <select
            id="city"
            {...register("address.city")}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.address?.city ? "border-red-500" : ""
            }`}
          >
            <option value="">Select City</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.address?.city && (
            <p className="text-red-500 text-xs italic">
              {errors.address.city.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="pinCode"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Pin Code
          </label>
          <input
            id="pinCode"
            type="number"
            {...register("address.pinCode", {
              setValueAs: (value) =>
                value === "" ? undefined : parseInt(value, 10),
            })}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.address?.pinCode ? "border-red-500" : ""
            }`}
          />
          {errors.address?.pinCode && (
            <p className="text-red-500 text-xs italic">
              {errors.address.pinCode.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label
            htmlFor="bloodGroup"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Blood Group
          </label>
          <select
            id="bloodGroup"
            {...register("bloodGroup")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.bloodGroup ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {errors.bloodGroup && (
            <p className="text-red-500 text-xs italic">
              {errors.bloodGroup.message}
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
          <select
            id="gender"
            {...register("gender")}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.gender ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs italic">
              {errors.gender.message}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9.293l5.646-5.647a.5.5 0 0 1 .708.708L10.707 10l5.647 5.646a.5.5 0 0 1-.708.708L10 10.707l-5.646 5.647a.5.5 0 1 1-.708-.708L9.293 10 3.646 4.354a.5.5 0 0 1 .708-.708L10 9.293Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <img
              src={profilePicPreview || "/default-profile-pic.png"}
              alt="Profile Picture"
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
