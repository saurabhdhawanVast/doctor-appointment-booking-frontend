import React from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

const SuccessToast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center space-x-2 z-50">
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
        &#x2715;
      </button>
    </div>
  );
};

export default SuccessToast;
