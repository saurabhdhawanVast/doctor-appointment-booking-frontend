"use client";
import React, { Suspense } from "react";
import Form_Doctor from "../../components/form_doctor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../loading";

const RegisterDoctor = () => {
  return (
    <div>
      <Form_Doctor />

      <ToastContainer />
    </div>
  );
};

export default RegisterDoctor;
