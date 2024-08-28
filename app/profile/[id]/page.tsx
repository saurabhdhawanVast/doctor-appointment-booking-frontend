"use client";

import React, { ChangeEvent, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import useLoginStore from '@/store/useLoginStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { usePatientStore } from '@/store/usePatientStore';

const patientSchema = z.object({
  contactNumber: z
    .string()
    .min(10, 'Contact number must be at least 10 digits long'),
  address: z.object({
    address: z.string().min(1, 'address is required'),
    city: z.string().min(1, 'City is required'),
    pinCode: z.number().min(1, 'Pin code is required'),
    state: z.string().min(1, 'State is required'),
  }),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  gender: z.string().min(1, 'Gender is required'),
  profilePic: z.string().url('Profile picture URL is invalid'),
});

type PatientInputs = z.infer<typeof patientSchema>;

const EditProfile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientInputs>({
    resolver: zodResolver(patientSchema),
  });
  const { id } = useParams(); 
  const { patient, doctor, user} = useLoginStore();
  const {updateProfile} = usePatientStore();
  const role = user?._doc?.role;
  const router = useRouter();
  useEffect(() => {
    if (patient) {
      setValue('contactNumber', patient.contactNumber);
      setValue('address.address', patient?.address?.address);
      setValue('address.city', patient?.address?.city);
      setValue('address.pinCode', patient?.address?.pinCode);
      setValue('address.state', patient?.address?.state);
      setValue('bloodGroup', patient.bloodGroup);
      setValue('gender', patient.gender);
      setValue('profilePic', patient.profilePic);
    }
  }, [patient, setValue]);
  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if(file){
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "doctors-app");
      uploadData.append("cloud_name", "dicldxhya");
      // console.log(uploadData);
      await fetch("https://api.cloudinary.com/v1_1/dicldxhya/image/upload", {
        method: "post",
        body: uploadData,
      })
        .then((res) => res.json())
        .then((data) => {
          setValue('profilePic', data.url); })
        .catch((err) => {
          console.log(err);
        });
      }
  }
  const handleUpdate:SubmitHandler<PatientInputs> = (data) => {

    if (patient) {
      console.log(data);
      
       updateProfile({...data,_id: patient?._id});
      handleCancel();
    }
  };
  const handleCancel = () => {
    router.back();
  };
  const renderProfile = () => {
    switch (role) {
      case "doctor":
        return (
          <>

          </>
        );
      case "patient":
        return (
          <>
             <form onSubmit={handleSubmit(handleUpdate)}>
            <div className="mt-4">
              <label
                htmlFor="contactNumber"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Contact Number
              </label>
              <input
                id="contactNumber"
                type="text"
                {...register('contactNumber')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.contactNumber && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="address"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                {...register('address.address')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.address?.address && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.address.address.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="city"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                {...register('address.city')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.address?.city && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.address.city.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="pinCode"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Pin Code
              </label>
              <input
                id="pinCode"
                type="number"
                {...register('address.pinCode')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors?.address?.pinCode && (
                <p className="mt-2 text-sm text-red-400">
                  {errors?.address?.pinCode.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="state"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                State
              </label>
              <input
                id="state"
                type="text"
                {...register('address.state')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.address?.state && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.address.state.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="bloodGroup"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Blood Group
              </label>
              <input
                id="bloodGroup"
                type="text"
                {...register('bloodGroup')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.bloodGroup && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.bloodGroup.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="gender"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Gender
              </label>
              <input
                id="gender"
                type="text"
                {...register('gender')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
              {errors.gender && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-4">
                    <label
                      htmlFor="profilePic"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Upload Profile Picture (.jpg, .jpeg, and .png)
                    </label>
                    <div className="mt-2">
                      <input
                        id="profilePic"
                        type="file"
                        onChange={uploadImage}
                        accept=".jpg,.jpeg,.png"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      ></input>
                      {errors.profilePic?.message && (
                        <p className="mt-2 text-sm text-red-400">
                          {errors.profilePic.message as React.ReactNode}
                        </p>
                      )}
                    </div>
                  </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500"
              >
                Update
              </button>
            </div>
          </form>
          </>
        );
      default:
        return (
          <></>
        );
    }
  }
  return (
      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Edit Profile
        </h2>
        {renderProfile()}
      </div>
    );
};

export default EditProfile;


