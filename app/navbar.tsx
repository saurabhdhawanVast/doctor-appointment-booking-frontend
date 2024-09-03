"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useLoginStore from "@/store/useLoginStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import imageDemo from "../public/images/avatar-icon.png";
import Logo from "../public/images/logooo.png"; // Adjust the path
import { Ellipsis } from "react-css-spinners"; // Import the Ellipsis spinner

const Navbar = () => {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const user = useLoginStore((state) => state.user);
  const logout = useLoginStore((state) => state.logout);
  const doctor = useLoginStore((state) => state.doctor);
  const patient = useLoginStore((state) => state.patient);
  const fetchUser = useLoginStore((state) => state.fetchUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [loading, setLoading] = useState(() => {
  //   return isLoggedIn ? true : false;
  // });
  const [loading, setLoading] = useState(false); // Conditional initialization of loading state // Loading state
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleClickOutside = (event: Event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const router = useRouter();
  const role = user?._doc?.role;
  const doctorId = doctor?._id;

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isLoggedIn) {
          // setLoading(true);

          await fetchUser();
        }
      } finally {
      }
    };
    loadData();
    console.log("loading user", loading);
    console.log("role", isLoggedIn);
  }, [isLoggedIn, fetchUser, setLoading]);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfile = async () => {
    try {
      router.push(`/profile/${user?._doc._id}`);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const renderNavbarLinks = () => {
    if (!isLoggedIn) {
      return (
        <>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/doctors">Doctors</Link>
          </li>
          <li>
            <Link href="/contact">Contact Us</Link>
          </li>
        </>
      );
    }

    switch (role) {
      case "admin":
        return (
          <>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/manage-users">Manage Users</Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
          </>
        );
      case "doctor":
        return (
          <>
            {/* <li>
              <Link href={`/doctor/appointments/${doctorId}`}>
                Appointments
              </Link>
            </li> */}
            <li>
              <Link href={`/doctor`}>Appointments</Link>
            </li>

            <li>
              <Link href={`/doctor/manage-schedule/${doctorId}`}>
                Manage Schedule
              </Link>
            </li>
            <li>
              <Link href="/doctor/myPatients">My Patients</Link>
            </li>
            <li>
              <Link href={`/doctor/article-form/${doctorId}`}>
                Create Article
              </Link>
            </li>
          </>
        );
      case "patient":
        return (
          <>
            <li>
              <Link href={`/patient/myAppointments`}>View Appointments</Link>
            </li>
            <li>
              <Link href="/medical-records">Manage Medical Records</Link>
            </li>
            <li>
              <Link href="patient/prescriptions">View Prescriptions</Link>
            </li>
            <li>
              <Link href="/patient/find-doctor">Find Doctor</Link>
            </li>
            <li>
              <Link href="/article">View Articles</Link>
            </li>
          </>
        );
      default:
        return (
          <>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li>
              <Link href="/doctors">Doctors</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </>
        );
    }
  };

  return (
    <div>
      {loading && !isLoggedIn ? ( // Show loader when loading is true
        <div className="bg-gradient-to-r flex justify-center items-center from-teal-400 via-teal-500 to-teal-600 fixed top-0 left-0 right-0 z-50 text-white shadow-lg h-16">
          <Ellipsis color="#ffffff" />
          {/* <Loader /> */}
        </div>
      ) : (
        <div className="navbar bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 fixed top-0 left-0 right-0 z-50 text-white shadow-lg h-16">
          <div className="navbar-start">
            <Link
              href="/"
              className="btn  text-2xl font-bold bg-teal-500 h-fit hover:bg-teal-500 border-none"
            >
              <img src={Logo.src} alt="Logo" className="h-14 w-14" />{" "}
              {/* Adjust size as needed */}
              DABS
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 space-x-4">
              {renderNavbarLinks()}
            </ul>
          </div>

          <div className="navbar-end hidden lg:flex">
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="btn bg-teal-500 hover:bg-teal-600 text-white border-none"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center w-10 h-6 circle">
                  <Image
                    src={
                      doctor && doctor.profilePic
                        ? doctor.profilePic
                        : patient && patient.profilePic
                        ? patient.profilePic
                        : imageDemo
                    }
                    alt="Avatar"
                    width={100}
                    height={100}
                    className="rounded-full border-2 border-white w-8 h-8"
                    onClick={toggleDropdown}
                  />
                </div>
                <div className="text-sem">
                  {doctor && doctor.name
                    ? doctor.name
                    : patient && patient.name
                    ? patient.name
                    : ""}
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button
                      onClick={handleProfile}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      Manage Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <div className="navbar-end lg:hidden ">
            <button onClick={toggleMobileMenu} className="text-white text-2xl ">
              {/* Hamburger Menu Icon */}
              <div className="relative w-8 h-8">
                <span className="block w-6 h-0.5 bg-white mb-1"></span>
                <span className="block w-6 h-0.5 bg-white mb-1"></span>
                <span className="block w-6 h-0.5 bg-white"></span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-0  z-40 m-16"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className={`fixed top-0 right-0 w-64 h-full bg-white shadow-2xl p-4 mt-16 z-50 transform  ${
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out`}
          >
            <button
              onClick={toggleMobileMenu}
              className="absolute top-4 right-4 text-2xl"
            >
              &times;
            </button>
            <ul className="space-y-4 mt-8">
              {renderNavbarLinks()}
              {!isLoggedIn && (
                <li>
                  <Link
                    href="/login"
                    className="w-full text-gray-700 hover:bg-gray-100 px-4 py-2 text-left"
                  >
                    Login
                  </Link>
                </li>
              )}
              {isLoggedIn && (
                <>
                  <li>
                    <button
                      onClick={handleProfile}
                      className="w-full text-gray-700 hover:bg-gray-100 px-4 py-2 text-left"
                    >
                      Manage Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-gray-700 hover:bg-gray-100 px-4 py-2 text-left"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
