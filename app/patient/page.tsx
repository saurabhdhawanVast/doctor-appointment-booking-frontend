// "use client";
// import React from "react";

// const Doctor = () => {
//   return (
//     <div className="relative w-full h-screen overflow-hidden">
//       <div className="carousel w-full h-full">
//         {/* Slide 1 */}
//         <div
//           id="slide1"
//           className="carousel-item relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-in-out"
//         >
//           <img
//             src="/images/doctors1.jpg"
//             alt="Doctor Image 1"
//             className="w-full h-full object-contain"
//           />
//           <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
//             <a
//               href="#slide4"
//               className="btn btn-circle bg-gray-800 text-white hover:bg-gray-600"
//             >
//               ❮
//             </a>
//             <a
//               href="#slide2"
//               className="btn btn-circle bg-gray-800 text-white hover:bg-gray-600"
//             >
//               ❯
//             </a>
//           </div>
//         </div>

//         {/* Slide 2 */}
//         <div
//           id="slide2"
//           className="carousel-item relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-in-out"
//         >
//           <img
//             src="/images/doctors2.png"
//             alt="Doctor Image 2"
//             className="w-full h-full object-contain"
//           />
//           <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
//             <a
//               href="#slide1"
//               className="btn btn-circle bg-gray-800 text-white hover:bg-gray-600"
//             >
//               ❮
//             </a>
//             <a
//               href="#slide3"
//               className="btn btn-circle bg-gray-800 text-white hover:bg-gray-600"
//             >
//               ❯
//             </a>
//           </div>
//         </div>

//         {/* Slide 3 */}
//         <div
//           id="slide3"
//           className="carousel-item relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-in-out"
//         >
//           <img
//             src="/images/doctors3.jpg"
//             alt="Doctor Image 3"
//             className="w-full h-full object-contain"
//           />
//           <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
//             <a
//               href="#slide2"
//               className="btn btn-circle bg-gray-800 text-white hover:bg-gray-600"
//             >
//               ❮
//             </a>
//             <a
//               href="#slide4"
//               className="btn btn-circle bg-gray-800 text-white hover:bg-gray-600"
//             >
//               ❯
//             </a>
//           </div>
//         </div>

//         {/* Slide 4 */}
//         <div
//           id="slide4"
//           className="carousel-item relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-in-out"
//         >
//           <img
//             src="/images/doctors4.jpg"
//             alt="Doctor Image 4"
//             className="w-full h-full object-contain"
//           />
//           <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
//             <a
//               href="#slide3"
//               className="btn btn-circle bg-gray-800 text-white hover:bg-gray-600"
//             >
//               ❮
//             </a>
//             <a
//               href="#slide1"
//               className="btn btn-circle bg-gray-800 text-white hover:bg-gray-600"
//             >
//               ❯
//             </a>
//           </div>
//         </div>
//       </div>

//       {/* Get Appointment Button */}
//       <div className="absolute bottom-20 right-12">
//         <button className="btn rounded-3xl bg-transparent border-2 border-slate-500 text-teal-500 font-bold py-2 px-4 transition-all duration-300 hover:bg-teal-500 hover:text-white hover:-translate-y-2">
//           Get Appointment
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Doctor;

"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";

const Doctor = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("patient/find-doctor"); // Replace '/appointment' with your desired route
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Change this value for different autoplay speeds
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Slider {...settings} className="w-full h-full">
        <div className="w-full h-full">
          <img
            src="/images/doctors1.jpg"
            alt="Doctor Image 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-full">
          <img
            src="/images/doctors2.png"
            alt="Doctor Image 2"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-full">
          <img
            src="/images/doctors3.jpg"
            alt="Doctor Image 3"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-full">
          <img
            src="/images/doctors4.jpg"
            alt="Doctor Image 4"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-full">
          <img
            src="/images/doctors5.png"
            alt="Doctor Image 5"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-full">
          <img
            src="/images/doctors6.jpg"
            alt="Doctor Image 6"
            className="w-full h-full object-cover"
          />
        </div>
      </Slider>

      {/* Get Appointment Button */}
      <div className="absolute bottom-20 right-12">
        <button
          className="btn rounded-3xl bg-transparent border-2 border-slate-500 text-teal-500 font-bold py-2 px-4 transition-all duration-300 hover:bg-teal-500 hover:text-white hover:-translate-y-2"
          onClick={handleButtonClick}
        >
          Get Appointment
        </button>
      </div>
    </div>
  );
};

export default Doctor;
