import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useReportsStore from "@/store/useReportStore";
import { FaFilePrescription } from "react-icons/fa";
import { TbReportMedical } from "react-icons/tb";
import { RiBillLine } from "react-icons/ri";
import useLoginStore from "@/store/useLoginStore";

interface ReportFormInputs {
  reportName: string;
  comment?: string;
  date: Date;
}
interface Medicine {
  name: string;
  dosage: string[];
  time: string;
  days: number;
}
interface Prescription {
  patientId: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  note: string;
  medicines: Medicine[];
  appointmentDate: string;
}
interface AddReportsToPrescriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportAdded: boolean;
  setReportAdded: (reportAdded: boolean) => void;
  prescription?: Prescription;
}
export default function AddReportsToPrescriptionForm({
  isOpen,
  onClose,
  prescription,
  reportAdded,
  setReportAdded,
}: AddReportsToPrescriptionFormModalProps) {
  const { register, handleSubmit, reset, setValue } =
    useForm<ReportFormInputs>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [image, setImage] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const patient = useLoginStore((state) => state.patient);
  const addReport = useReportsStore((state) => state.createReport);

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

  const onSubmit = async (data: ReportFormInputs) => {
    try {
      if (!image) {
        console.error("No report uploaded");
        return;
      }
      if (!patient) {
        console.error("please login");
        return;
      }
      if (!prescription) {
        console.error("No prescription provided");
        return;
      }
      const report = {
        reportName: data.reportName,
        uploadReport: image,
        type: "Report",
        date: selectedDate,
        doctor: prescription.doctorId,
        appointmentDate: new Date(prescription.appointmentDate),
        patient: patient._id,
      };

      await addReport(report);
      reset();
      setReportAdded(!reportAdded);
      onClose();
      setImage(null);
    } catch (error) {
      console.error("Error uploading report:", error);
    }
  };

  return (
    <div className="flex items-center justify-end">
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Upload Report</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  {...register("reportName", { required: true })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Enter report name"
                />
              </div>

              <div className="mb-4">
                <div className="block text-gray-700 text-sm font-bold mb-2">
                  Upload Report
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
                )}
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date
                </label>
                <DatePicker
                  maxDate={new Date()}
                  selected={selectedDate}
                  dateFormat={"dd-MMM-yyyy"}
                  onChange={(date: Date | null) => {
                    if (date) setSelectedDate(date);
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                />
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
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
