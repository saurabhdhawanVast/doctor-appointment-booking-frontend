import { FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white  py-2 w-full flex flex-wrap items-center">
      <div className="flex flex-wrap w-full justify-around">
        <div className="flex items-center w-96  gap-4 mt-2">
          <img src="/images/logooo.png" alt="Company Logo" className="w-24" />
          <div className="text-left">
            <p className="text-xl font-bold">Bringing Healthcare</p>
            <p className="text-md">
              to your doorstep, ensuring <br />
              convenience and care for everyone.
            </p>
          </div>
        </div>

        <div className="text-center  w-96 mt-2">
          <h2 className="text-lg font-semibold mb-2">Our Address</h2>
          <p className="text-sm mb-4 flex items-center justify-center">
            <FaMapMarkerAlt className="mr-2" /> 301, Chandravarsha, above SBI,
            Sus Road, Pashan, Pune 411021
          </p>
        </div>

        <div className=" w-96 text-center mt-2">
          <h2 className="text-lg font-semibold mb-2">Reach Out Anytime!</h2>
          <p className="text-sm leading-relaxed mb-1">
            For any concern,feel free to{" "}
            <a
              href="/contact-us"
              className="text-gray-300 underline hover:text-white transition-colors"
            >
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
