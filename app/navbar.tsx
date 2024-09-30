"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useLoginStore from "@/store/useLoginStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import imageDemo from "../public/images/avatar-icon.png";
import Logo from "../public/images/logooo.png"; // Adjust the path
import { Ellipsis } from "react-css-spinners"; // Import the Ellipsis spinner
import ReviewList from "./components/reviewModel";
import { useArticleStore } from "@/store/useArticleStore";

const Navbar = () => {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const user = useLoginStore((state) => state.user);
  const logout = useLoginStore((state) => state.logout);
  const setEditArticle = useArticleStore((state) => state.setEditArticle);
  const doctor = useLoginStore((state) => state.doctor);
  const patient = useLoginStore((state) => state.patient);
  const fetchUser = useLoginStore((state) => state.fetchUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReviewModelOpen, setIsReviewModelOpen] = useState(false);
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
  const handleReviewModelClose = () => {
    setIsReviewModelOpen(false);
  };
  const handleReviewModelOpen = () => {
    setDropdownOpen(false);
    setIsReviewModelOpen(true);
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
  const patientId = patient?._id;

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
    console.log("User:", user);
    console.log("role", isLoggedIn);
    console.log("user", user);
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
      setDropdownOpen(false);
      if (patient) {
        router.push(`/patient/profile/${user?._doc._id}`);
      } else {
        router.push(`/doctor/profile/${user?._doc._id}`);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const renderNavbarLinks = () => {
    if (!isLoggedIn) {
      return (
        <div className="menu menu-horizontal  ">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/aboutUs">About</Link>
          </li>
          <li>
            <Link href="/dataSecurity">Data Security</Link>
          </li>

          <li>
            <Link href="/contact-us">Contact Us</Link>
          </li>
        </div>
      );
    }

    switch (role) {
      case "admin":
        return (
          <div className="menu menu-horizontal  ">
            <li>
              <Link href="/admin">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </div>
        );
      case "doctor":
        return (
          <div className="menu menu-horizontal ">
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
            <li onClick={() => setEditArticle(null)}>
              <Link href={`/doctor/article`}>Article</Link>
            </li>
          </div>
        );
      case "patient":
        return (
          <div className="menu menu-horizontal">
            <li>
              <Link href="/patient/find-doctor">Find Doctor</Link>
            </li>
            <li>
              <Link href={`/patient/myAppointments`}>Appointments</Link>
            </li>
            <li>
              <Link href={`/patient/prescriptions/${patientId}`}>
                Prescriptions
              </Link>
            </li>
            <li>
              <Link href="/patient/article">Articles</Link>
            </li>
            <li>
              <Link href="/patient/reports">Reports</Link>
            </li>
          </div>
        );
      default:
        return (
          <div className="menu menu-horizontal ">
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
          </div>
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
        <div className="navbar  bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 fixed top-0 left-0 right-0 z-50 text-white shadow-lg h-16">
          <div className="navbar-start flex items-center">
            <Link
              href="/"
              className="flex items-center text-2xl font-bold h-fit hover:bg-teal-500 border-none"
            >
              <img src={Logo.src} alt="Logo" className="h-14 w-14 mr-2" />
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
                <div className="flex items-center space-x-2">
                  <div className="text-sm">
                    {doctor?.name.split(" ")[0] ??
                      patient?.name.split(" ")[0] ??
                      ""}
                  </div>
                  <div className="w-10 h-10">
                    <Image
                      src={
                        doctor && doctor.profilePic
                          ? doctor.profilePic
                          : patient && patient.profilePic
                          ? patient.profilePic
                          : imageDemo
                      }
                      alt="Avatar"
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-white w-10 h-10"
                      onClick={toggleDropdown}
                    />
                  </div>
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {role === "doctor" ||
                      (role === "patient" && (
                        <button
                          onClick={handleProfile}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                        >
                          Edit Profile
                        </button>
                      ))}
                    {role === "doctor" && (
                      <button
                        onClick={handleReviewModelOpen}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        My Reviews
                      </button>
                    )}

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
                    {role === "doctor" ||
                      (role === "patient" && (
                        <button
                          onClick={handleProfile}
                          className="w-full text-gray-700 hover:bg-gray-100 px-4 py-2 text-left"
                        >
                          Manage Profile
                        </button>
                      ))}
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
      <ReviewList
        isOpen={isReviewModelOpen}
        onClose={handleReviewModelClose}
        doctorId={doctorId ? doctorId : ""}
      />
    </div>
  );
};

export default Navbar;
