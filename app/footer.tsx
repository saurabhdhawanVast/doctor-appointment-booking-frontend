import { FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-teal-500 text-white z-10 py-4 w-full flex items-center">
      <div className="flex w-full justify-around">
        
        <div className="flex items-center w-1/3 space-x-4">
        <img src="/images/logooo.png" alt="Company Logo" className="w-24" />
          <div className="text-left">
            <p className="text-xl font-bold">Bringing Healthcare</p>
            <p className="text-md">
              to your doorstep, ensuring <br />
              convenience and care for everyone.
            </p>
            </div>
        </div>

        <div className="text-center w-1/3">
          <h2 className="text-lg font-semibold mb-2">Our Address</h2>
          <p className="text-sm mb-4 flex items-center justify-center">
            <FaMapMarkerAlt className="mr-2" /> 301, Chandravarsha, above SBI, Sus Road, Pashan, Pune 411021
          </p>
        </div>

        <div className="w-1/3 text-center">
          <h2 className="text-lg font-semibold mb-2">Reach Out Anytime!</h2>
          <p className="text-sm leading-relaxed mb-1">
            For any concern,feel free to {" "}
            <a href="/contact-us" className="text-gray-300 underline hover:text-white transition-colors">
              contact us
            </a>{" "}
            
          </p>
          <p className="text-xs mt-2">© 2024 DABS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
