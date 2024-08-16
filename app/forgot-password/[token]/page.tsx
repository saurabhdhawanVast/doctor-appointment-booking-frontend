"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import NewPasswordForm from "@/app/components/form_new-Pasword";

const NewPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Extract the token from query params

  return (
    <div>
      <NewPasswordForm token={token} />
    </div>
  );
};

export default NewPasswordPage;
