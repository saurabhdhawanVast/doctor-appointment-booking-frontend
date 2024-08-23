"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { z } from "zod";

import { FormDataSchemaDoctor } from "../lib/schema_doctor";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

import useRegisterDoctorStore from "@/store/useRegisterDoctorStore";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loading from "../loading";

type Inputs = z.infer<typeof FormDataSchemaDoctor>;

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
      "password",
      "confirmPassword",
    ],
  },
  {
    id: "Step 2",
    name: "Qualification Details",
    fields: [
      "speciality",
      "qualification",
      "registrationNumber",
      "yearOfRegistration",
      "stateMedicalCouncil",
      "upload_document",
      "bio",
    ],
  },
  {
    id: "Step 3",
    name: "Clinic Address",
    fields: [
      "clinicName",
      "clinicAddress",
      "contactNumber",
      "city",
      "state",
      "pinCode",
    ],
  },
  {
    id: "Step 4",
    name: "Clinic Timing",
    fields: [
      "morningStartTime",
      "morningEndTime",
      "eveningStartTime",
      "eveningEndTime",
      "slotDuration",
    ],
  },
  {
    id: "Step 5",
    name: "Thank you",
  },
];

interface City {
  id: number;
  latitude: string;
  longitude: string;
  name: string;
}

export default function Form_Doctor() {
  const router = useRouter();
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;

  //loading state
  const [isLoading, setIsLoading] = useState(false);

  //signup User and Doctor
  const signup = useRegisterDoctorStore((state) => state.signup);
  const getUserByEmail = useRegisterDoctorStore(
    (state) => state.getUserByEmail
  );

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  //cities state
  const [states, setStates] = useState<
    { name: string; iso2: string; id: string }[]
  >([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const url: string[] = [];

  //getlocation
  const setLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      toast.success("Location set successfully");
    });
  };

  // Remove duplicates Cities

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchemaDoctor),
  });

  //chat
  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      toast.info("Please wait, form is being processed...");
      console.log("Processing form...");
      const profilePic = data.profilePic[0];
      const document = data.document[0];
      const uploadDataArray = [profilePic, document];
      const url: string[] = [];

      for (const uploadDataElement of uploadDataArray) {
        const uploadData = new FormData();
        uploadData.append("file", uploadDataElement);
        uploadData.append("upload_preset", "doctors-app");
        uploadData.append("cloud_name", "dicldxhya");

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
      console.log("after cloudinary");

      const { confirmPassword, firstName, lastName, ...dataWithoutPassword } =
        data;

      const formData = {
        name: `${firstName} ${lastName}`,
        ...dataWithoutPassword,
        role: "doctor",
        coordinates: {
          latitude: latitude,
          longitude: longitude,
        },
        profilePic: url[0] || "/images/avatar.png",
        document: url[1],
      };

      await signup(formData); // Assuming signup is an async function
      reset();

      toast.success("Form submitted successfully.");

      router.push("/login");
    } catch (error) {
      console.error("Error processing form:", error);
      toast.error("There was an error processing the form.");
    } finally {
      setIsLoading(false);
    }
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (currentStep === 0) {
      // console.log("from next email", watch("email"));
      const email = watch("email");
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

    if (currentStep === 2) {
      if (latitude === 0 && longitude === 0) {
        toast.error("Please enable your location");
        return;
      }
    }

    if (currentStep === 3) {
      const morningStartTime = watch("morningStartTime");
      const morningEndTime = watch("morningEndTime");
      const eveningStartTime = watch("eveningStartTime");
      const eveningEndTime = watch("eveningEndTime");
      if (
        morningStartTime > morningEndTime ||
        eveningStartTime > eveningEndTime
      ) {
        toast.error("Start time must be Less than end time");
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

  // yearOfRegistration
  const currentYear = new Date().getFullYear();
  // Generate an array of years from 1950 to the current year
  const years = [];
  for (let year = 1950; year <= currentYear; year++) {
    years.push(year);
  }

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

  //Council
  const stateMedicalCouncilsList = [
    "Andhra Pradesh Medical Council",
    "Arunachal Pradesh Medical Council",
    "Assam Medical Council",
    "Bihar Medical Council",
    "Chattisgarh Medical Council",
    "Delhi Medical Council",
    "Goa Medical Council",
    "Gujarat Medical Council",
    "Haryana State Dental & Medical Council",
    "Himachal Pradesh Medical Council",
    "Jammu & Kashmir Medical Council",
    "Jharkhand Medical Council",
    "Karnataka Medical Council",
    "Kerala Medical Council",
    "Madhya Pradesh Medical Council",
    "Maharashtra Medical Council",
    "Manipur Medical Council",
    "Meghalya Medical Council",
    "Mizoram Medical Council",
    "Nagaland Medical Council",
    "Orissa Medical Council",
    "Punjab Medical Council",
    "Rajasthan Medical Council",
    "Sikkim Medical Council",
    "Tamil Nadu Medical Council",
    "Telangana Medical Council",
    "Tripura Medical Council",
    "Uttarnchal Medical Council",
    "Uttar Pradesh Medical Council",
    "West Bengal Medical Council",
  ];

  // Specialties
  const doctorSpecialties = [
    "Cardiologist", // Heart specialist
    "Dermatologist", // Skin specialist
    "Endocrinologist", // Hormones and metabolism specialist
    "Gastroenterologist", // Digestive system specialist
    "Neurologist", // Nervous system specialist
    "Oncologist", // Cancer specialist
    "Ophthalmologist", // Eye specialist
    "Orthopedic Surgeon", // Bone and joint specialist
    "Pediatrician", // Child specialist
    "Psychiatrist", // Mental health specialist
    "Pulmonologist", // Lung specialist
    "Rheumatologist", // Joint and autoimmune disease specialist
    "Surgeon", // General surgeon
    "Urologist", // Urinary tract specialist
    "Dentist", // Oral health specialist
  ];

  const doctorQualifications = [
    "MBBS", // Bachelor of Medicine, Bachelor of Surgery
    "MD", // Doctor of Medicine
    "MS", // Master of Surgery
    "DM", // Doctorate of Medicine (super-specialization)
    "MCh", // Master of Chirurgie (super-specialization in surgery)
    "DNB", // Diplomate of National Board
    "BDS", // Bachelor of Dental Surgery
    "MDS", // Master of Dental Surgery
    "BHMS", // Bachelor of Homeopathic Medicine and Surgery
    "MD(Hom)", // Doctor of Medicine in Homeopathy
    "BAMS", // Bachelor of Ayurvedic Medicine and Surgery
    "MD(Ayurveda)", // Doctor of Medicine in Ayurveda
    "DGO", // Diploma in Obstetrics and Gynaecology
    "DCH", // Diploma in Child Health
    "DNB Pediatrics", // Diplomate of National Board in Pediatrics
    "FRCS", // Fellow of the Royal College of Surgeons (can be recognized for Indian practice if from a recognized institution)
    "FAMS", // Fellow of the Academy of Medical Sciences (can be recognized for Indian practice if from a recognized institution)
  ];

  // const doctorQualifications = [
  //   "MBBS - Bachelor of Medicine, Bachelor of Surgery",
  //   "MD - Doctor of Medicine",
  //   "MS - Master of Surgery",
  //   "DM - Doctorate of Medicine",
  //   "MCh - Master of Chirurgiae",
  //   "BDS - Bachelor of Dental Surgery",
  //   "MDS - Master of Dental Surgery",
  //   "BHMS - Bachelor of Homeopathic Medicine and Surgery",
  //   "MD (Homeopathy) - Doctor of Medicine in Homeopathy",
  //   "BUMS - Bachelor of Unani Medicine and Surgery",
  //   "MD (Unani) - Doctor of Medicine in Unani",
  //   "BAMS - Bachelor of Ayurvedic Medicine and Surgery",
  //   "MD (Ayurveda) - Doctor of Medicine in Ayurveda",
  //   "NDDY - Naturopathy and Yogic Sciences",
  //   "MS (Yoga and Naturopathy) - Master of Science in Yoga and Naturopathy",
  // ];

  return (
    <div className="flex  items-center justify-center py-12 px-4 sm:px-2 lg:px-4">
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

                  <div className="sm:col-span-2">
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
                  Qualification Details
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Add your qualification details
                </p>

                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="speciality"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      speciality
                    </label>
                    <div className="mt-2">
                      <select
                        id="speciality"
                        {...register("speciality")}
                        autoComplete="speciality"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Speciality</option>
                        {doctorSpecialties.map((speciality) => (
                          <option key={speciality} value={speciality}>
                            {speciality}
                          </option>
                        ))}
                      </select>
                      {errors.speciality?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.speciality.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Qualification */}

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
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
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

                  {/* RegistrationNumber */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="registrationNumber"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Registration Number
                    </label>
                    <div className="mt-2">
                      <input
                        id="registrationNumber"
                        type="text"
                        {...register("registrationNumber")}
                        autoComplete="registrationNumber"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />

                      {errors.registrationNumber?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.registrationNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Year of Registration */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="yearOfRegistration"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Year of Registration
                    </label>
                    <div className="mt-2">
                      <select
                        id="yearOfRegistration"
                        {...register("yearOfRegistration")}
                        autoComplete="yearOfRegistration"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Year of Registration</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      {errors.yearOfRegistration?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.yearOfRegistration.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* StateMedicalCouncil */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="stateMedicalCouncil"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      State Medical Council
                    </label>
                    <div className="mt-2">
                      <select
                        id="stateMedicalCouncil"
                        {...register("stateMedicalCouncil")}
                        autoComplete="stateMedicalCouncil"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option value="">State Medical Council</option>
                        {stateMedicalCouncilsList.map((stateCouncil) => (
                          <option key={stateCouncil} value={stateCouncil}>
                            {stateCouncil}
                          </option>
                        ))}
                      </select>
                      {errors.stateMedicalCouncil?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.stateMedicalCouncil.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="document"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Upload Document (.jpg, .jpeg, and .png)
                    </label>
                    <div className="mt-2">
                      <input
                        id="document"
                        type="file"
                        {...register("document")}
                        accept=".jpg,.jpeg,.png"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      ></input>
                      {errors.document?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.document.message as React.ReactNode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Bio
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="bio"
                        {...register("bio")}
                        autoComplete="bio"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.bio?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.bio.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Clinic Address
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Add your Clinic Address
                </p>
                {/* Address */}

                <div className="sm:col-span-4">
                  <label
                    htmlFor="clinicName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Clinic Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="clinicName"
                      type="text"
                      {...register("clinicName")}
                      autoComplete="clinicName"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    />
                    {errors.clinicName?.message && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.clinicName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="clinicAddress"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Clinic Address
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        id="clinicAddress"
                        {...register("clinicAddress")}
                        autoComplete="clinicAddress"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                      />
                      {errors.clinicAddress?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.clinicAddress.message}
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
                    Clinic Contact Number
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
                      {...register("state")}
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select a state</option>
                      {states.map((state) => (
                        <option key={state.name} value={state.iso2}>
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

                <button
                  type="button"
                  onClick={setLocation}
                  className="inline-flex mt-6 justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  Set Your Clinic Location
                </button>
              </motion.div>
            )}

            {currentStep === 3 && (
              <>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Timings
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Please Add Clinic Timing
                </p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Morning Timings */}
                  <div className="col-span-1 sm:col-span-2">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      Morning
                    </h3>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="w-1/3">
                        <label
                          htmlFor="morningStartTime"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Start Time
                        </label>
                        <input
                          type="time"
                          // defaultValue={"06:00"}
                          id="morningStartTime"
                          {...register("morningStartTime")}
                          autoComplete="morningStartTime"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                        {errors.morningStartTime?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.morningStartTime.message}
                          </p>
                        )}
                      </div>
                      <div className="w-1/3">
                        <label
                          htmlFor="morningEndTime"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          End Time
                        </label>
                        <input
                          type="time"
                          // defaultValue={"12:00"}
                          id="morningEndTime"
                          {...register("morningEndTime")}
                          autoComplete="morningEndTime"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                        {errors.morningEndTime?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.morningEndTime.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Evening Timings */}
                  <div className="col-span-1 sm:col-span-2">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      Evening
                    </h3>
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="w-1/3">
                        <label
                          htmlFor="eveningStartTime"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Start Time
                        </label>
                        <input
                          type="time"
                          // defaultValue={"16:00"}
                          id="eveningStartTime"
                          {...register("eveningStartTime")}
                          autoComplete="eveningStartTime"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                        {errors.eveningStartTime?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.eveningStartTime.message}
                          </p>
                        )}
                      </div>
                      <div className="w-1/3">
                        <label
                          htmlFor="eveningEndTime"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          End Time
                        </label>
                        <input
                          type="time"
                          // defaultValue={"21:00"}
                          id="eveningEndTime"
                          {...register("eveningEndTime")}
                          autoComplete="eveningEndTime"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                        {errors.eveningEndTime?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.eveningEndTime.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* slot */}
                  <div className="col-span-1 sm:col-span-2">
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      Evening
                    </h3>
                    <div className="sm:col-span-1">
                      <label
                        htmlFor="slotDuration"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Slot Duration
                      </label>
                      <div className="mt-2">
                        <select
                          id="slotDuration"
                          {...register("slotDuration", {
                            required: "Slot duration is required",
                            valueAsNumber: true, // Ensures the value is treated as a number
                          })}
                          autoComplete="slotDuration"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value="">Select Slot Duration</option>
                          <option value={15}>15 minutes</option>
                          <option value={20}>20 minutes</option>
                          <option value={30}>30 minutes</option>
                        </select>
                        {errors.slotDuration?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.slotDuration.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === 4 && (
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
}
