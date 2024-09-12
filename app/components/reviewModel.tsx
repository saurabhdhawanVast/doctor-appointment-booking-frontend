"use client";

import React, { useEffect } from "react";
import useRatingStore from "@/store/useRatingStore";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5"; // Import close icon

interface Patient {
  _id: string;
  name: string;
  profilePic: string;
}

interface Review {
  _id: string;
  doctor: string;
  patient: Patient;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewListProps {
  doctorId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  doctorId,
  isOpen,
  onClose,
}) => {
  const reviews = useRatingStore((state) => state.ratings);
  const getRatingsForDoctor = useRatingStore(
    (state) => state.getRatingsForDoctor
  );

  useEffect(() => {
    const fetch = async () => {
      if (doctorId) {
        await getRatingsForDoctor(doctorId);
      }
    };
    fetch();
  }, [doctorId]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500" />);
      }
    }
    return stars;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 mt-16 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white py-8 rounded shadow-md w-full max-w-lg">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <IoCloseSharp size={24} />
        </button>
        <h2 className="text-2xl px-8 font-semibold mb-4">Patient Stories</h2>
        <div className="max-h-[28rem] px-2 overflow-y-scroll">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="mb-6 p-4 bg-white rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  className="w-12 h-12 rounded-full"
                  src={review.patient.profilePic}
                  alt={`${review.patient.name}'s profile`}
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {review.patient.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Reviewed on{" "}
                    {new Date(review.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-yellow-500 flex">
                  <span className="text-lg font-bold">Rating:</span>
                  <div className="flex mt-1.5 ml-2">
                    {renderStars(review.rating)}
                  </div>
                </p>
                <p className="mt-2 text-gray-700">
                  {review.comment || "No comment provided"}
                </p>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="text-center">No Feedback Provided Yet!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
