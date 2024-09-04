"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { z } from "zod";

import { FormDataSchemaPatient } from "../lib/schema_patient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import Loading from "../loading";

import useRegisterPatientStore from "@/store/useRegisterPatientStore";

type Inputs = z.infer<typeof FormDataSchemaPatient>;

const steps = [
  {
    id: "Step 1",
    name: "Personal Information",
    fields: [
      "firstName",
      "lastName",
      "email",
      "profilePic",
      "gender",
      "bloodGroup",
      "password",
      "confirmPassword",
    ],
  },
  {
    id: "Step 2",
    name: "Address",
    fields: ["address", "contactNumber", "city", "state", "pinCode"],
  },

  {
    id: "Step 3",
    name: "Thank you",
  },
];

interface City {
  id: number;
  latitude: string;
  longitude: string;
  name: string;
}

const Form_Patient = () => {
  const router = useRouter();
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;

  //store sign up
  const signup = useRegisterPatientStore((state) => state.signup);
  const getUserByEmail = useRegisterPatientStore(
    (state) => state.getUserByEmail
  );

  //City state
  const [states, setStates] = useState<
    { name: string; iso2: string; id: string }[]
  >([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  //url profile pic
  const url: string[] = [];

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchemaPatient),
  });

  //Submit form
  const processForm: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    console.log("ProcessFrom", data);
    toast.info("Please wait, form is being processed...");
    try {
      //getUrl
      const profilePicPatient = data.profilePic[0];

      //profilePic
      const uploadDataArray = [profilePicPatient];
      for (const uploadDataElement of uploadDataArray) {
        // console.log(uploadDataElement);
        const uploadData = new FormData();
        uploadData.append("file", uploadDataElement);
        uploadData.append("upload_preset", "doctors-app");
        uploadData.append("cloud_name", "dicldxhya");
        // console.log(uploadData);
        await fetch(`https://api.cloudinary.com/v1_1/dicldxhya/image/upload`, {
          method: "post",
          body: uploadData,
        })
          .then((res) => res.json())
          .then((data) => {
            url.push(data.url);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      //remove Confirm password field
      const { confirmPassword, firstName, lastName, ...dataWithoutPassword } =
        data;

      //add role and coordinates.
      const formData = {
        name: `${firstName} ${lastName}`,
        ...dataWithoutPassword,
        role: "patient",
        profilePic: url[0] || "/images/avatar.png",
      };

      console.log("formData Before Sending", formData);

      await signup(formData);

      toast.success("Form submitted successfully.");
      router.push("/login");
    } catch (error) {
      toast.error("There was an error processing the form.");
      console.log(error);
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (currentStep === 0) {
      const user = await getUserByEmail(watch("email"));

      if (user) {
        toast.error("User already exists");
        return;
      }

      const password = watch("password");
      const confirmPassword = watch("confirmPassword");

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    if (!output) return;

    if (currentStep < steps.length) {
      if (currentStep === steps.length - 1) {
        await handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  // API configuration
  const config = {
    cUrl: "https://api.countrystatecity.in/v1/countries",
    ckey: "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==",
  };

  //apis for cities state online fetching
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(`${config.cUrl}/IN/states`, {
          headers: { "X-CSCAPI-KEY": config.ckey },
        });
        const data = await response.json();
        setStates(
          data.map((state: { name: string; iso2: string; id: string }) => ({
            name: state.name,
            iso2: state.iso2,
            id: state.id,
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
          console.log(selectedState);
          const response = await fetch(
            `${config.cUrl}/IN/states/${selectedState}/cities`,
            { headers: { "X-CSCAPI-KEY": config.ckey } }
          );
          const data: City[] = await response.json();

          // Remove duplicates based on city names
          const seenNames = new Set<string>();
          const uniqueCities = data
            .filter((city) => {
              if (seenNames.has(city.name)) {
                return false;
              } else {
                seenNames.add(city.name);
                return true;
              }
            })
            .map((city) => city.name);

          console.log(uniqueCities);
          setCities(uniqueCities);
        } catch (error) {
          console.error("Failed to fetch cities:", error);
        }
      };

      fetchCities();
    }
  }, [selectedState]);

  return (
    <div className="flex h- items-center justify-center py-12 px-4 sm:px-2 lg:px-4">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="loader">
            <Loading />
          </div>{" "}
          {/* Customize your loader */}
        </div>
      )}
      <section className=" w-full max-w-12xl h-screen inset-0 flex flex-col justify-between p-12">
        {/* steps */}

        <nav aria-label="Progress ">
          <ol
            role="list"
            className="space-y-4 md:flex md:space-x-8 md:space-y-0"
          >
            {steps.map((step, index) => (
              <li key={step.name} className="md:flex-1">
                {currentStep > index ? (
                  <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-sky-600 transition-colors ">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ) : currentStep === index ? (
                  <div
                    className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                    aria-current="step"
                  >
                    <span className="text-sm font-medium text-sky-600">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ) : (
                  <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-gray-500 transition-colors">
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Form div */}
        <div className="bg-blue-50 p-5 rounded-2xl w-94 ">
          {/* Form */}
          <form className="mt-5 py-5" onSubmit={handleSubmit(processForm)}>
            {currentStep === 0 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Resitration Details
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Provide your registration details.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      First Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="firstName"
                        {...register("firstName")}
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.firstName?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Last Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="lastName"
                        {...register("lastName")}
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.lastName?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        type="email"
                        {...register("email")}
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.email?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Profile*/}
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="profilePic"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Upload Profile Picture (.jpg, .jpeg, and .png)
                    </label>
                    <div className="mt-2">
                      <input
                        id="profilePic"
                        type="file"
                        {...register("profilePic")}
                        accept=".jpg,.jpeg,.png"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      ></input>
                      {errors.profilePic?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.profilePic.message as React.ReactNode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Gender */}

                  <div className="sm:col-span-1">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Gender
                    </label>
                    <div className="mt-2">
                      <select
                        id="gender"
                        {...register("gender", {
                          required: "Gender is required",
                        })}
                        autoComplete="gender"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Blood Group */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="bloodGroup"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Blood Group
                    </label>
                    <div className="mt-2">
                      <select
                        id="bloodGroup"
                        {...register("bloodGroup", {
                          required: "Blood Group is required",
                        })}
                        autoComplete="bloodGroup"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                      {errors.bloodGroup?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.bloodGroup.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Password */}

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        type="password"
                        id="password"
                        {...register("password")}
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.password?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/*Confirm  Password */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-2">
                      <input
                        type="password"
                        id="confirmPassword"
                        {...register("confirmPassword")}
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.confirmPassword?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {currentStep === 1 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Address
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Add your Address
                </p>
                {/* Address */}

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Address
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="address"
                        {...register("address")}
                        autoComplete="address"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.address?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* contactNumber */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="contactNumber"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Contact Number
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      id="contactNumber"
                      {...register("contactNumber")}
                      autoComplete="contactNumber"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.contactNumber?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.contactNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* State */}

                {/* State */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    State
                  </label>
                  <div className="mt-2">
                    <select
                      id="state"
                      {...register("state", {
                        onChange: (e) => {
                          setSelectedState(e.target.value);
                        },
                      })}
                      value={
                        selectedState
                          ? states.find((state) => state.iso2 === selectedState)
                              ?.name
                          : ""
                      }
                      onChange={(e) => {
                        const selectedStateObj = states.find(
                          (state) => state.name === e.target.value
                        );
                        setSelectedState(selectedStateObj?.iso2 || "");
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
                    {errors.state?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* City */}
                <div className="sm:col-span-2 sm:col-start-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    City
                  </label>
                  <div className="mt-2">
                    <select
                      id="city"
                      {...register("city")}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Zip */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="pinCode"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Zip Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      id="pinCode"
                      {...register("pinCode", { valueAsNumber: true })}
                      autoComplete="pinCode"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.pinCode?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.pinCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Complete
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Thank you Please Submit the form.
                </p>
              </>
            )}
          </form>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={prev}
              className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={next}
            className="inline-flex justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            {currentStep < steps.length - 1 ? "Next" : "Submit"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Form_Patient;
