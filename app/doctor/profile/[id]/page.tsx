"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useLoginStore from "@/store/useLoginStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import useDoctorStore from "@/store/useDoctorStoree";
import { toast } from "react-toastify";
import useRegisterDoctorStore from "@/store/useRegisterDoctorStore";

const config = {
  cUrl: "https://api.countrystatecity.in/v1/countries",
  ckey: "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==",
};

const doctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.string().min(1, "Gender is required"),
  profilePic: z.string().url("Profile picture URL is invalid"),
  speciality: z.string().min(1, "Speciality is required"),
  qualification: z.string().min(1, "Qualification is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  yearOfRegistration: z.string().min(1, "Year of registration is required"),
  stateMedicalCouncil: z.string().min(1, "State Medical Council is required"),
  bio: z.string().min(1, "Bio is required"),
  document: z.string().url("Document URL is invalid"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits long"),
  clinicDetails: z.object({
    clinicName: z.string().optional(),
    clinicAddress: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    morningStartTime: z.string().optional(),
    morningEndTime: z.string().optional(),
    eveningStartTime: z.string().optional(),
    eveningEndTime: z.string().optional(),
    slotDuration: z.number().optional(),
  }),
  slotDuration: z.number().optional(),
});

type DoctorInputs = z.infer<typeof doctorSchema>;

const EditDoctorProfile = () => {
  const { patient, doctor, user } = useLoginStore();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DoctorInputs>({
    resolver: zodResolver(doctorSchema),
  });

  const { id } = useParams();
  const [image, setImage] = useState<string>(
    doctor && doctor.profilePic ? doctor.profilePic : ""
  );
  const [uploadeddocument, setUploadedDocument] = useState<string>(
    doctor && doctor.document ? doctor.document : ""
  );
  const [states, setStates] = useState<{ name: string; iso2: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const { updateProfile } = useDoctorStore();
  const role = user?._doc?.role;
  const state = doctor?.clinicDetails?.state;
  const city = doctor?.clinicDetails?.city;
  const [selectedState, setSelectedState] = useState<string | undefined>("");
  // const [selectedState, setSelectedState] = useState<string | undefined>(state);
  const [selectedCity, setSelectedCity] = useState<string | undefined>("");
  const router = useRouter();

  const doctorSpecialties = useRegisterDoctorStore(
    (state) => state.doctorSpecialties
  );
  const doctorQualifications = useRegisterDoctorStore(
    (state) => state.doctorQualifications
  );

  useEffect(() => {
    if (doctor) {
      setValue("name", doctor.name);
      setValue("gender", doctor.gender);
      setValue("profilePic", doctor.profilePic);
      setValue("speciality", doctor.speciality);
      setValue("qualification", doctor.qualification);
      setValue("registrationNumber", doctor.registrationNumber);
      setValue("yearOfRegistration", doctor.yearOfRegistration);
      setValue("stateMedicalCouncil", doctor.stateMedicalCouncil);
      setValue("bio", doctor.bio);
      setValue("document", doctor.document);
      setValue("contactNumber", doctor.contactNumber);
      setValue("clinicDetails.clinicName", doctor.clinicDetails?.clinicName);
      setValue(
        "clinicDetails.clinicAddress",
        doctor.clinicDetails?.clinicAddress
      );
      setValue("clinicDetails.state", doctor.clinicDetails?.state);
      setValue("clinicDetails.city", doctor.clinicDetails?.city);

      setValue(
        "clinicDetails.morningStartTime",
        doctor.clinicDetails?.morningStartTime
      );
      setValue(
        "clinicDetails.morningEndTime",
        doctor.clinicDetails?.morningEndTime
      );
      setValue(
        "clinicDetails.eveningStartTime",
        doctor.clinicDetails?.eveningStartTime
      );
      setValue(
        "clinicDetails.eveningEndTime",
        doctor.clinicDetails?.eveningEndTime
      );
      setValue("clinicDetails.slotDuration", 15);
      setImage(doctor.profilePic);
      setUploadedDocument(doctor.document);
      setSelectedState(doctor.clinicDetails?.state);
      setSelectedCity(doctor.clinicDetails?.city);
    }
    console.log("name", doctor?.name);
    console.log("state", doctor?.clinicDetails?.state);
    console.log(doctor?.clinicDetails?.city);
  }, [doctor, setValue]);

  useEffect(() => {
    // When selectedState or selectedCity changes, update the form values
    setValue("clinicDetails.state", selectedState);
  }, [selectedState, setValue]);

  useEffect(() => {
    setValue("clinicDetails.city", selectedCity);
  }, [selectedCity, setValue]);

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "doctors-app");
      uploadData.append("cloud_name", "dicldxhya");

      await fetch("https://api.cloudinary.com/v1_1/dicldxhya/image/upload", {
        method: "post",
        body: uploadData,
      })
        .then((res) => res.json())
        .then((data) => {
          setValue("profilePic", data.url);
          setImage(data.url);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

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

  const handleUpdate: SubmitHandler<DoctorInputs> = (data) => {
    if (doctor) {
      console.log("Data is : ", data);
      updateProfile({ ...data, _id: doctor?._id });
      toast.success("Profile updated successfully");
      handleCancel();
    }
  };
  //document upload
  const uploadDocument = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const file = files?.[0];

    if (file) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "doctors-app");
      uploadData.append("cloud_name", "dicldxhya");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dicldxhya/image/upload",
          {
            method: "POST",
            body: uploadData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload document");
        }

        const data = await response.json();
        setValue("document", data.url);
        setUploadedDocument(data.url);
        console.log("Document uploaded:", data.url);
      } catch (error) {
        console.error("Error uploading document:", error);
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const renderProfile = () => {
    switch (role) {
      case "doctor":
        return (
          <div className="container mx-auto px-4 max-w-screen-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
              Edit Doctor Profile
            </h2>
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
              <div className="">
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <img
                      src={image}
                      alt="Profile Picture"
                      className="w-full h-full object-cover rounded-full border border-gray-300"
                    />
                    <label
                      htmlFor="profilePic"
                      className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer"
                    >
                      <input
                        id="profilePic"
                        type="file"
                        onChange={uploadImage}
                        accept=".jpg,.jpeg,.png"
                        className="sr-only"
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
                </div>
                <div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-gray-700  text-md font-semibold"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        {...register("name")}
                        className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-600 sm:text-md"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Repeat for other text fields */}
                    <div className="mb-4">
                      <label
                        htmlFor="gender"
                        className="block text-gray-700 text-md font-semibold"
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
                        <p className="mt-1 text-sm text-red-500">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>

                    {/* Continue with the rest of the fields */}
                    <div className="mb-4">
                      <label
                        htmlFor="speciality"
                        className="block text-gray-700 text-md font-semibold"
                      >
                        Speciality
                      </label>
                      <select
                        id="speciality"
                        {...register("speciality")}
                        autoComplete="speciality"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                          errors.speciality ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Select Speciality</option>
                        {doctorSpecialties.map((speciality) => (
                          <option key={speciality} value={speciality}>
                            {speciality}
                          </option>
                        ))}
                      </select>
                      {errors.speciality && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.speciality.message}
                        </p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="qualification"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Qualification
                      </label>
                      <div className="mt-2">
                        <select
                          id="qualification"
                          {...register("qualification")}
                          autoComplete="qualification"
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.speciality ? "border-red-500" : ""
                          }`}
                        >
                          <option value="">Select Qualification</option>
                          {doctorQualifications.map((qualification) => (
                            <option key={qualification} value={qualification}>
                              {qualification}
                            </option>
                          ))}
                        </select>
                        {errors.qualification?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.qualification.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Include additional fields similarly */}

                    {/* Clinic Details */}
                    <div className="mt-4">
                      <div className="mb-4">
                        <label
                          htmlFor="clinicDetails.clinicName"
                          className="block text-gray-700 text-md font-semibold"
                        >
                          Clinic Name
                        </label>
                        <input
                          id="clinicDetails.clinicName"
                          type="text"
                          {...register(
                            "clinicDetails.clinicName" as keyof DoctorInputs
                          )}
                          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-600 sm:text-md"
                        />
                        {errors.clinicDetails?.clinicName && (
                          <p className="mt-1 text-sm text-red-500">
                            {
                              (
                                errors.clinicDetails?.clinicName as {
                                  message: string;
                                }
                              ).message
                            }
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="clinicDetails.clinicAddress"
                          className="block text-gray-700 text-md font-semibold"
                        >
                          Clinic Address
                        </label>
                        <input
                          id="clinicDetails.clinicAddress"
                          type="text"
                          {...register(
                            "clinicDetails.clinicAddress" as keyof DoctorInputs
                          )}
                          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-600 sm:text-md"
                        />
                        {errors.clinicDetails?.clinicAddress && (
                          <p className="mt-1 text-sm text-red-500">
                            {
                              (
                                errors.clinicDetails?.clinicAddress as {
                                  message: string;
                                }
                              ).message
                            }
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="clinicDetails.state"
                          className="block text-gray-700 text-md font-semibold"
                        >
                          State
                        </label>

                        <select
                          id="state"
                          {...register(
                            "clinicDetails.state" as keyof DoctorInputs
                          )}
                          defaultValue={state}
                          value={selectedState}
                          onChange={(e) => {
                            setSelectedState(e.target.value);
                            // Perform any other actions you need when the state is changed
                          }}
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.clinicDetails?.state ? "border-red-500" : ""
                          }`}
                        >
                          <option value="">Select a state</option>
                          {states.map((state) => (
                            <option key={state.iso2} value={state.iso2}>
                              {state.name}
                            </option>
                          ))}
                        </select>

                        {errors.clinicDetails?.state && (
                          <p className="mt-1 text-sm text-red-500">
                            {
                              (
                                errors.clinicDetails?.state as {
                                  message: string;
                                }
                              ).message
                            }
                          </p>
                        )}
                      </div>

                      {/* <div className="sm:col-span-2 w-1/3 mr-3">
                        <label
                          htmlFor="state"
                          className="block text-sm font-normal leading-6 text-gray-900"
                        >
                          State
                        </label>
                        <div className="mt-2">
                          <Controller
                            name="clinicDetails.state"
                            control={control}
                            render={({ field }) => (
                              <select
                                {...field}
                                value={
                                  selectedState
                                    ? states.find(
                                        (state) => state.iso2 === selectedState
                                      )?.name
                                    : ""
                                }
                                onChange={(e) => {
                                  const selectedStateObj = states.find(
                                    (state) => state.name === e.target.value
                                  );
                                  setSelectedState(
                                    selectedStateObj?.iso2 || ""
                                  );
                                  field.onChange(e); // Call field.onChange with the event
                                }}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                              >
                                <option value="">Select a state</option>
                                {states.map((state) => (
                                  <option key={state.name} value={state.name}>
                                    {state.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                        </div>
                      </div> */}

                      <div className="mb-4">
                        <label
                          htmlFor="clinicDetails.city"
                          className="block text-gray-700 text-md font-semibold"
                        >
                          City
                        </label>
                        <select
                          id="city"
                          {...register(
                            "clinicDetails.city" as keyof DoctorInputs
                          )}
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            errors.clinicDetails?.city ? "border-red-500" : ""
                          }`}
                        >
                          <option value="">Select City</option>
                          {cities.map((city, index) => (
                            <option key={index} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        {errors.clinicDetails?.city && (
                          <p className="mt-1 text-sm text-red-500">
                            {
                              (
                                errors.clinicDetails?.city as {
                                  message: string;
                                }
                              ).message
                            }
                          </p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="clinicDetails.morningStartTime"
                          className="block text-gray-700 text-md font-semibold"
                        >
                          Morning Start Time
                        </label>
                        <input
                          id="clinicDetails.morningStartTime"
                          type="time"
                          {...register(
                            "clinicDetails.morningStartTime" as keyof DoctorInputs
                          )}
                          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-600 sm:text-sm"
                        />
                        {errors.clinicDetails?.morningStartTime && (
                          <p className="mt-1 text-sm text-red-500">
                            {
                              (
                                errors.clinicDetails?.morningStartTime as {
                                  message: string;
                                }
                              ).message
                            }
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="clinicDetails.morningEndTime"
                          className="block text-gray-700 text-md font-semibold"
                        >
                          Morning End Time
                        </label>
                        <input
                          id="clinicDetails.morningEndTime"
                          type="time"
                          {...register(
                            "clinicDetails.morningEndTime" as keyof DoctorInputs
                          )}
                          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-600 sm:text-sm"
                        />
                        {errors.clinicDetails?.morningEndTime && (
                          <p className="mt-1 text-sm text-red-500">
                            {
                              (
                                errors.clinicDetails?.morningEndTime as {
                                  message: string;
                                }
                              ).message
                            }
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="clinicDetails.eveningStartTime"
                          className="block text-gray-700 text-md font-semibold"
                        >
                          Evening Start Time
                        </label>
                        <input
                          id="clinicDetails.eveningStartTime"
                          type="time"
                          {...register(
                            "clinicDetails.eveningStartTime" as keyof DoctorInputs
                          )}
                          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-600 sm:text-sm"
                        />
                        {errors.clinicDetails?.eveningStartTime && (
                          <p className="mt-1 text-sm text-red-500">
                            {
                              (
                                errors.clinicDetails?.eveningStartTime as {
                                  message: string;
                                }
                              ).message
                            }
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="clinicDetails.eveningEndTime"
                          className="block text-gray-700 text-md font-semibold"
                        >
                          Evening End Time
                        </label>
                        <input
                          id="clinicDetails.eveningEndTime"
                          type="time"
                          {...register(
                            "clinicDetails.eveningEndTime" as keyof DoctorInputs
                          )}
                          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-600 sm:text-sm"
                        />
                        {errors.clinicDetails?.eveningEndTime && (
                          <p className="mt-1 text-sm text-red-500">
                            {
                              (
                                errors.clinicDetails?.eveningEndTime as {
                                  message: string;
                                }
                              ).message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-48 h-48">
                      <img
                        src={uploadeddocument} // Placeholder image
                        alt="Document"
                        className="w-full h-full object-cover border border-gray-300"
                      />
                      <label
                        htmlFor="document"
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 cursor-pointer"
                      >
                        <input
                          id="document"
                          type="file"
                          onChange={uploadDocument}
                          accept=".jpg,.jpeg,.png"
                          className="sr-only"
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
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        );
      case "patient":
        return <></>;
      default:
        return <></>;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Edit Doctor Profile
      </h2>
      {renderProfile()}
    </div>
  );
};

export default EditDoctorProfile;
