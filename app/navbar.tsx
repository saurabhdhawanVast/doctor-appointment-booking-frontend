"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useLoginStore from "@/store/useLoginStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import imageDemo from "../public/images/avatar-icon.png";

const Navbar = () => {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const user = useLoginStore((state) => state.user);
  const logout = useLoginStore((state) => state.logout);
  const doctor = useLoginStore((state) => state.doctor);
  const patient = useLoginStore((state) => state.patient);
  const fetchUser = useLoginStore((state) => state.fetchUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn, fetchUser]);

  const handleLogout = async () => {
    try {
      logout();
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
            <li>
              <Link href="/appointments">Appointments</Link>
            </li>
            <li>
              <Link href={`/doctor/mark-available/${doctorId}`}>
                Manage Schedule
              </Link>
            </li>
            <li>
              <Link href="/patients">My Patients</Link>
            </li>
          </>
        );
      case "patient":
        return (
          <>
            <li>
              <Link href={`/patient/appointments`}>View Appointments</Link>
            </li>
            <li>
              <Link href="/medical-records">Manage Medical Records</Link>
            </li>
            <li>
              <Link href="/prescriptions">View Prescriptions</Link>
            </li>

            <li>
              <Link href="/patient/find-doctor">Find Doctor</Link>
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
      <div className="navbar bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 fixed top-0 left-0 right-0 z-50 text-white shadow-lg h-16">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-2xl font-bold">
            DABS
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-4">
            {renderNavbarLinks()}
          </ul>
        </div>

        <div className="navbar-end">
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
      </div>
    </div>
  );
};

export default Navbar;
