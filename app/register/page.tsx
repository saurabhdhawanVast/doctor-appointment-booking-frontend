import React from "react";
import Link from "next/link";

const Register = () => {
  return (
    <div className="p-20">
      <div className="flex m-16 justify-between gap-4 p-4 ">
        <div className="flex-1 p-6 bg-blue-100 rounded-lg shadow-lg h-fit ">
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
        <div className="flex-1 p-6 bg-orange-100 rounded-lg shadow-lg">
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
    </div>
  );
};

export default Register;
