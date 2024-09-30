import { useEffect, useState } from "react";
import axios from "axios";
import useRegisterDoctorStore from "@/store/useRegisterDoctorStore";
import useDoctorStore from "@/store/useDoctorStore";
import useLoginStore from "@/store/useLoginStore";
import { useParams } from "next/navigation";
interface UpdateQualificationModelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateQualificationModel({
  isOpen,
  onClose,
}: UpdateQualificationModelProps) {
  const { doctorId } = useParams();
  const [selectedQualification, setSelectedQualification] = useState<any>("");
  const [selectedSpeciality, setSelectedSpeciality] = useState<any>("");
  const doctor = useLoginStore((state) => state.doctor);
  const user = useLoginStore((state) => state.user);
  const updateProfile = useDoctorStore((state) => state.updateProfile);
  const fetchDoctorProfile = useDoctorStore(
    (state) => state.fetchDoctorProfile
  );
  const updateQualificationRequest = useDoctorStore(
    (state) => state.updateQualificationRequest
  );
  const doctorQualifications = useRegisterDoctorStore(
    (state) => state.doctorQualifications
  );
  const doctorSpecialties = useRegisterDoctorStore(
    (state) => state.doctorSpecialties
  );
  const [qualificationError, setQualificationError] = useState<String>("");
  const [specialityError, setSpecialityError] = useState<String>("");
  const [imageError, setImageError] = useState<String>("");
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "doctors-app");
      formData.append("cloud_name", "dicldxhya");
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dicldxhya/image/upload`,
        formData
      );
      setImage(res.data.url);
    }
  };

  const handleFileDelete = () => {
    setImage(null);
  };

  const onSubmit = async () => {
    console.log("onSubmit ..... in the Model Form");
    try {
      console.log("Request sent");
      if (!image) {
        setImageError("please upload the document");
        return;
      }
      if (!selectedQualification) {
        setQualificationError("Please select Qualification");
        return;
      }
      if (!selectedSpeciality) {
        setSpecialityError("Please select Speciality");
        return;
      }
      if (!user) {
        console.error("Please login to update profile");
        return;
      }
      if (user._doc.role === "admin") {
        if (!doctorId) {
          console.error("Please select a doctor");
          return;
        }
        let payload = {
          _id: doctorId as string,
          speciality: selectedSpeciality,
          qualification: selectedQualification,
          document: image,
          isVerifiedUpdatedQulaification: false,
        };
        await updateProfile(payload);
        await fetchDoctorProfile(doctorId as string);
      } else if (doctor) {
        console.log("Doctor : ", doctor);
        console.log("Sending API request with:", {
          _id: doctor._id,
          doctorName: doctor.name,
          email: user._doc.email,
          speciality: selectedSpeciality,
          qualification: selectedQualification,
          documentLink: image,
        });
        await updateQualificationRequest(
          doctor?._id,
          doctor?.name,
          user._doc.email,
          selectedSpeciality,
          selectedQualification,
          image
        );
        console.log("updatedQualification Success");
      }
      setImage(null);
      setSelectedQualification("");
      setImageError("");
      setQualificationError("");
      setSpecialityError("");
      setSelectedSpeciality("");
      onClose();
    } catch (error) {
      console.error("Error uploading report:", error);
      console.log("Upadted Unsuccessful");
    }
  };

  return (
    <div className="flex items-center justify-end">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Update Qualification</h3>
            <div className="sm:col-span-2">
              <label
                htmlFor="qualification"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Qualification
              </label>
              <div className="mt-2">
                <select
                  id="qualification"
                  value={selectedQualification}
                  onChange={(e) => setSelectedQualification(e.target.value)}
                  autoComplete="qualification"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    qualificationError ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Qualification</option>
                  {doctorQualifications.map((qualification) => (
                    <option key={qualification} value={qualification}>
                      {qualification}
                    </option>
                  ))}
                </select>
                {qualificationError && (
                  <p className="mt-2 text-sm text-red-400">
                    {qualificationError}
                  </p>
                )}
              </div>
            </div>
            <div className="my-4">
              <label
                htmlFor="speciality"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Speciality
              </label>
              <select
                id="speciality"
                value={selectedSpeciality}
                onChange={(e) => setSelectedSpeciality(e.target.value)}
                autoComplete="speciality"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  specialityError ? "border-red-500" : ""
                }`}
              >
                <option value="">Select Speciality</option>
                {doctorSpecialties.map((speciality) => (
                  <option key={speciality} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </select>
              {specialityError && (
                <p className="mt-1 text-sm text-red-500">{specialityError}</p>
              )}
            </div>
            <div className="my-4">
              <div className="block text-gray-700 text-sm font-bold mb-2">
                Upload Document
              </div>
              {image && (
                <div className="relative">
                  <img
                    src={image}
                    alt="Selected file"
                    className="max-h-40 mx-auto"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full"
                    onClick={handleFileDelete}
                  >
                    X
                  </button>
                </div>
              )}
              {!image && (
                <div>
                  <label className="flex cursor-pointer flex-col rounded-lg border-2 border-dashed w-full h-48 p-10 group text-center">
                    <div className="h-full w-full text-center flex flex-col justify-center items-center">
                      <p className="pointer-none text-gray-500 ">
                        Select an image from your computer
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e)}
                      accept="image/png, image/jpg, image/jpeg"
                      className="hidden"
                    />
                  </label>
                  {imageError && (
                    <p className="mt-2 text-sm text-red-400">{imageError}</p>
                  )}
                </div>
              )}
            </div>
            <div className="mb-2">
              <p className="mt-2 text-sm text-yellow-500 italic">
                Note : Updated qualification will be sent for verification and
                will be updated on verified
              </p>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => onClose()}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded"
                onClick={() => onSubmit()}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
