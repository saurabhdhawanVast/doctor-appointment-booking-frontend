"use client";
import React, { useState, useEffect, use } from "react";
import { useForm, Controller, set } from "react-hook-form";
import { Slider } from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { usePatientStore } from "@/store/usePatientStore";
import Link from "next/link";
import useLoginStore from "@/store/useLoginStore";
import { FaStar, FaRegStar, FaStarHalfAlt, FaSearch } from "react-icons/fa";
import { LuFilterX } from "react-icons/lu";
import { toast } from "react-toastify";
import ReviewList from "@/app/components/reviewModel";
import { FaCalendarDays } from "react-icons/fa6";
import { IoTodaySharp } from "react-icons/io5";
import useRegisterDoctorStore from "@/store/useRegisterDoctorStore";
import { MdLocationOff, MdLocationOn } from "react-icons/md";
import Loading from "@/app/loading";

interface Slot {
  time: string;
  status: boolean;
}
export interface Doctor {
  _id: string;
  name: string;
  gender: string;
  email: string;
  profilePic: string;
  password: string;
  speciality: string;
  qualification: string;
  registrationNumber: string;
  yearOfRegistration: string;
  stateMedicalCouncil: string;
  bio: string;
  document: string;
  clinicAddress: string;
  contactNumber: string;
  city: string;
  state: string;
  pinCode: number;
  clinicName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  morningStartTime: string;
  morningEndTime: string;
  eveningStartTime: string;
  eveningEndTime: string;
  slotDuration: number;
  isVerified: boolean;
  avgRating: number;
  availability: [{ date: string; slots: Slot[] }];
}

interface specialityOption {
  label: string;
  value: string;
}

interface City {
  id: number;
  latitude: string;
  longitude: string;
  name: string;
}

const SearchDoctorsPage = () => {
  const { control, handleSubmit, setValue, reset } = useForm();
  const [states, setStates] = useState<
    { name: string; iso2: string; id: string }[]
  >([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");

  const [radius, setRadius] = useState<number>(25);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isReviewModelOpen, setIsReviewModelOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  // const patient = usePatientStore((state) => state.patient);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  //for getting user logged in
  const user = useLoginStore((state) => state.user);
  const patient = useLoginStore((state) => state.patient);
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const fetchUser = useLoginStore((state) => state.fetchUser);

  const searchParams = useSearchParams();
  const speciality = searchParams.get("specialty");

  //for getting user logged in

  const doctorSpecialties = useRegisterDoctorStore(
    (state) => state.doctorSpecialties
  );

  // const { searchDoctors, doctors: storeDoctors } = usePatientStore();
  const { searchDoctors } = usePatientStore();

  const config = {
    cUrl: "https://api.countrystatecity.in/v1/countries",
    ckey: "NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA==",
  };
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };
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
        console.log(states);
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
            {
              headers: { "X-CSCAPI-KEY": config.ckey },
            }
          );
          const data: City[] = await response.json();

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

          setCities(uniqueCities);
        } catch (error) {
          console.error("Failed to fetch cities:", error);
        }
      };

      fetchCities();
    }
  }, [selectedState]);

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (isLoggedIn && patient) {
        const patientState = patient?.address?.state;
        const patientCity = patient?.address?.city;

        if (patientState) {
          const selectedStateObj = states.find(
            (state) => state.name === patientState
          );
          if (selectedStateObj) {
            setSelectedState(selectedStateObj.iso2);
            setValue("state", selectedStateObj.name);
          }
        }

        if (patientCity) {
          setValue("city", patientCity);
        }

        if (speciality) {
          setValue("speciality", speciality);
        }

        //const fetchedDoctors = await searchDoctors(patientState, patientCity,speciality);
        const fetchedDoctors = await searchDoctors(
          patientState,
          patientCity,
          speciality ?? ""
        );
        setDoctors(fetchedDoctors!);
      }
    };

    fetchAndSetData();
  }, [isLoggedIn, patient, states, setValue, searchDoctors, speciality]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn, fetchUser]);

  const handleReviewModelClose = () => {
    setIsReviewModelOpen(false);
    setSelectedDoctor("");
  };
  const handleReviewModelOpen = (doctor: any) => {
    setIsReviewModelOpen(true);
    setSelectedDoctor(doctor);
  };

  const handleBookAppointment = (doctorId: any, patientId: any) => {
    try {
      setIsLoading(true);

      router.push(
        `/patient/book-appointment?doctorId=${doctorId}&patientId=${patientId}`
      );
    } catch (error) {
      toast.error("Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          toast.success("Location obtained successfully.");
        },
        (error) => {
          console.error("Error getting location: ", error);
          toast.error("Failed to obtain location. Please try again.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const onSubmit = async (data: any) => {
    const location: [number, number] | undefined =
      latitude !== null && longitude !== null
        ? ([latitude, longitude] as [number, number])
        : undefined;

    try {
      const fetchedDoctors = await searchDoctors(
        data.state,
        data.city,
        data.speciality,
        data.gender,
        radius,
        location
      );
      setDoctors(fetchedDoctors!); // Update state with the fetched doctors
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  const handleClearFilters = () => {
    reset();
    setSelectedState("");
    setCities([]);
    setRadius(50);
    setLatitude(null);
    setLongitude(null);
    setDoctors([]);
  };

  return (
    <div className="  mt-12 p-4 w-full flex-wrap  h-fit min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="loader">
            <Loading />
          </div>{" "}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap space-x-3 items-center">
          <div className="w-64 ml-4 ">
            <div className="mt-2">
              <Controller
                name="speciality"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select a Speciality</option>
                    {doctorSpecialties.map((speciality) => (
                      <option key={speciality} value={speciality}>
                        {speciality}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>
          <div className="w-64">
            <div className="mt-2">
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
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
          </div>
          {/* -------------------------------------------------------------Updated Code--------------------------- */}
          <div className="w-64">
            <div className="mt-2">
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  >
                    <option value="">Select a city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>
          {/* Gender */}
          <div className="w-64">
            <div className="mt-2">
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Select Gender</option>

                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-wrap space-x-3">
            <button type="submit">
              <div className="bg-teal-600 mt-2 w-10 text-white h-9 rounded-md flex items-center justify-center">
                <FaSearch className="w-6 h-6 hover:cursor-pointer " />
              </div>
            </button>

            <button type="button" onClick={() => handleClearFilters()}>
              <div className="bg-teal-600 mt-2 w-10 text-white h-9 rounded-md flex items-center justify-center">
                <LuFilterX className="w-6 h-6 hover:cursor-pointer " />
              </div>
            </button>

            <button
              type="button"
              onClick={handleGetLocation}
              className="bg-teal-600 mt-2 p-2 text-white h-9 rounded-md flex justify-center items-center hover:cursor-pointer "
            >
              {longitude && latitude ? (
                <MdLocationOn className="w-6 h-6" />
              ) : (
                <MdLocationOff className="w-6 h-6" />
              )}
              Location
            </button>
          </div>
        </div>
        <div className="divider mt-2 mb-2" />

        <input type="hidden" {...control.register("radius")} value={radius} />

        {latitude && longitude && (
          <div className="flex flex-wrap items-center  w-full  ">
            <div className="flex w-1/2 justify-center items-center mr-4 flex-shrink-0">
              <div className="block  text-sm w-48  font-normal text-gray-700 mb-1 mr-4 ml-6">
                <label>Search Radius (km)</label>
              </div>

              <Slider
                value={radius}
                onChange={(event, newValue) => {
                  setRadius(newValue as number);
                  setValue("radius", newValue as number);
                }}
                aria-labelledby="radius-slider"
                min={25}
                max={100}
                step={25} // Sets the step value
                marks={[
                  { value: 25 },
                  { value: 50 },
                  { value: 75 },
                  { value: 100 },
                ]}
                valueLabelDisplay="auto"
                className="h-4 w-full"
                sx={{
                  "& .MuiSlider-thumb": {
                    width: 20, // Adjust thumb size
                    height: 20,
                    color: "#00897B",
                  },
                  "& .MuiSlider-track": {
                    height: 4, // Adjust track height
                    color: "#00897B",
                  },
                  "& .MuiSlider-rail": {
                    height: 4, // Adjust rail height
                  },
                }}
              />
            </div>
          </div>
        )}
      </form>

      {doctors.length > 0 ? (
        <div className="  p-2">
          <ul className="space-y-4">
            {doctors.map((doctor) => {
              const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD"
              const availabilityToday = doctor.availability.find(
                (avail) => avail.date === today
              );
              const nextAvailability = doctor.availability
                .filter(
                  (avail) =>
                    new Date(avail.date).getTime() > new Date().getTime()
                ) // Convert to Date and compare
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )[0]; // Sort by date and get the closest

              return (
                <div
                  key={doctor._id}
                  className="doctor-card p-4 border rounded-lg shadow-lg flex items-start space-x-5 animate-fade-in-up"
                >
                  <div className="relative w-16 h-16">
                    <img
                      src={doctor.profilePic || "/default-profile.png"}
                      alt={doctor.name}
                      className="w-full h-full object-cover rounded-full border-2 border-green-500"
                    />
                    {doctor.isVerified && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6 absolute bottom-0 right-0 bg-white rounded-full text-green-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 flex flex-row items-center justify-between">
                    <div className="flex">
                      <div>
                        <h3 className="text-xl font-normal text-blue-600">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {doctor.speciality || ""}
                        </p>
                        <p className="text-sm text-gray-600">
                          {doctor.yearOfRegistration && (
                            <span>
                              Year of Registration: {doctor.yearOfRegistration}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="flex mt-2">
                          {renderStars(doctor?.avgRating)}
                        </div>{" "}
                        <div
                          className="text-center text-sm underline hover:text-blue-500 cursor-pointer"
                          onClick={() => handleReviewModelOpen(doctor._id)}
                        >
                          Reviews
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <div>
                        {availabilityToday ? (
                          <div className="flex items-center space-x-2">
                            <IoTodaySharp className="text-green-600" />
                            <span className="text-green-600 font-normal">
                              Available Today
                            </span>
                          </div>
                        ) : nextAvailability ? (
                          <div className="flex items-center space-x-2">
                            <IoTodaySharp className="text-gray-600" />
                            <span className="text-gray-600 font-normal">
                              Available on{" "}
                              {new Date(
                                nextAvailability.date
                              ).toLocaleDateString("en-US", {
                                weekday: "long",
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            No Availability
                          </span>
                        )}
                      </div>
                      {/* <Link
                        href={`/patient/book-appointment?doctorId=${doctor._id}&patientId=${patient?._id}`}
                        className="btn text-white rounded-2xl bg-teal-600 mt-2 text-xs px-2 py-1 flex flex-col items-center text-center hover:bg-teal-600 hover:text-white"
                      >
                        <span className="text-sm font-semibold">
                          Book Appointment
                        </span>
                      </Link> */}

                      <button
                        onClick={() =>
                          handleBookAppointment(doctor._id, patient?._id)
                        }
                        // href={`/patient/book-appointment?doctorId=${doctor._id}&patientId=${patient?._id}`}
                        className="btn text-white rounded-2xl bg-teal-600 mt-2 text-xs px-2 py-1 flex flex-col items-center text-center hover:bg-teal-600 hover:text-white"
                      >
                        <span className="text-sm font-semibold">
                          Book Appointment
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col ml-2 mt-2 flex-1 h-full overflow-y-auto overflow-x-hidden">
          <p>No doctors found</p>
        </div>
      )}

      <ReviewList
        isOpen={isReviewModelOpen}
        onClose={handleReviewModelClose}
        doctorId={selectedDoctor}
      />
    </div>
  );
};

export default SearchDoctorsPage;
