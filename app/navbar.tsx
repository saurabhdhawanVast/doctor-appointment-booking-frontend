"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import useLoginStore from "@/store/useLoginStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

import imageDemo from "../public/images/avatar-icon.png";
const Navbar = () => {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const user = useLoginStore((state) => state.user);
  const logout = useLoginStore((state) => state.logout);
  const fetchUser = useLoginStore((state) => state.fetchUser);
  const router = useRouter();
  const role = user?._doc?.role;

  useEffect(() => {
    // Fetch user details if logged in
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
              <Link href="/schedule">Manage Schedule</Link>
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
              <Link href="/my-appointments">My Appointments</Link>
            </li>
            <li>
              <Link href="/find-doctor">Find a Doctor</Link>
            </li>
            <li>
              <Link href="/profile">Profile</Link>
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
      <div className="navbar bg-slate-400 fixed top-0 left-0 right-0">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">DABS</a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{renderNavbarLinks()}</ul>
        </div>

        <div className="navbar-end">
          {!isLoggedIn ? (
            <Link href="/login" className="btn">
              Login
            </Link>
          ) : (
            <div className="flex items-center">
              <Image
                src={imageDemo}
                alt="Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <button onClick={handleLogout} className="btn ml-2">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
