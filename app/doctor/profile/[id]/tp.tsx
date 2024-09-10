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
  clinicDetails: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
  }),
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
      setValue("clinicDetails.state", doctor.clinicDetails?.state);
      setValue("clinicDetails.city", doctor.clinicDetails?.city);

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
      updateProfile({ ...data, _id: doctor?._id });
      toast.success("Profile updated successfully");
      handleCancel();
    }
  };
  //document upload

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
                <div className="flex justify-center"></div>
                <div>
                  <div className="flex-1">
                    {/* Clinic Details */}
                    <div className="mt-4">
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
