import Form_Patient from "@/app/components/form_patient";
import React from "react";
import { ToastContainer } from "react-toastify";

const RegisterPatient = () => {
  return (
    <div>
      <Form_Patient />
      <ToastContainer />
    </div>
  );
};

export default RegisterPatient;
