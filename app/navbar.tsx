"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useLoginStore from "@/store/useLoginStore";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const Navbar = () => {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  const logout = useLoginStore((state) => state.logout);

  useEffect(() => {
    // Effect to update isLoggedIn based on sessionStorage
    useLoginStore.setState({ isLoggedIn: !!sessionStorage.getItem("token") });
  }, []);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();

      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <div className="navbar bg-slate-400">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">DABS</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
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
          </ul>
        </div>

        {/* {!isLoggedIn ? (
          <div>
            <Link href="/login">
              <button className="w-24 h-10 hover:font-black btn-ghost rounded-lg ">
                Login
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <button
              className="w-24 h-10 hover:font-black btn-ghost rounded-lg"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )} */}

        <div className="navbar-end">
          {!isLoggedIn ? (
            <Link href="/login" className="btn">
              Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="btn ml-2">
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
