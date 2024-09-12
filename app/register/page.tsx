import React from "react";
import Link from "next/link";
import Image from "next/image";

const Register = () => {
  return (
    <div className="flex mt-24 h-[75vh] p-10 gap-4 justify-between ">
      {/* Doctor card */}
      <div
        className="flex-1 w-1/2  p-6 bg-blue-100 rounded-lg shadow-lg  bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/doctorRegister.png')", // Replace with the doctor image path
        }}
      >
        <h2 className="text-xl font-semibold">Doctor</h2>

        <p className="mt-2 text-gray-700">
          Information about the doctor goes here.
        </p>
        <Link
          href="/register/registerdoctor"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 btn btn-ghost"
        >
          Register
        </Link>
      </div>

      {/* Patient card */}
      <div
        className="flex-1 p-6 bg-orange-100 rounded-lg shadow-lg bg-cover bg-center"
        style={{
          backgroundImage: "url('/path-to-your-patient-image.jpg')", // Replace with the patient image path
        }}
      >
        <h2 className="text-xl font-semibold">Patient</h2>
        <p className="mt-2 text-gray-700">
          Information about the patient goes here.
        </p>
        <Link
          href="/register/registerpatient"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 btn btn-ghost"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Register;
