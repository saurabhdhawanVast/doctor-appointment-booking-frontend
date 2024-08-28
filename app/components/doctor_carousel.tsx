"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface CarouselProps {
  data: {
    image: string;
  }[];
  onButtonClick: () => void; // Callback for the button click
}

const Carousel: React.FC<CarouselProps> = ({ data, onButtonClick }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const [carouselSize, setCarouselSize] = useState({ width: 0, height: 0 });
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCarouselSize = () => {
      if (carouselRef.current) {
        const { width, height } = carouselRef.current.getBoundingClientRect();
        setCarouselSize({ width, height });
      }
    };

    updateCarouselSize();
    window.addEventListener("resize", updateCarouselSize);

    return () => {
      window.removeEventListener("resize", updateCarouselSize);
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative h-60 w-full overflow-hidden rounded-md">
        <div
          ref={carouselRef}
          style={{
            transform: `translateX(-${currentImg * carouselSize.width}px)`,
          }}
          className="absolute flex h-full w-full transition-transform duration-500"
        >
          {data.map((v, i) => (
            <div key={i} className="relative w-full h-full shrink-0">
              <Image
                className="object-cover"
                alt={`carousel-image-${i}`}
                fill
                src={v.image}
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Button on images */}
        <button
          onClick={onButtonClick}
          className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg transition hover:bg-blue-600"
        >
          Get Appointment
        </button>
      </div>

      <div className="mt-3 flex justify-center space-x-2">
        <button
          disabled={currentImg === 0}
          onClick={() => setCurrentImg((prev) => Math.max(prev - 1, 0))}
          className={`border px-4 py-2 font-bold ${
            currentImg === 0 && "opacity-50"
          }`}
        >
          {"<"}
        </button>
        <button
          disabled={currentImg === data.length - 1}
          onClick={() =>
            setCurrentImg((prev) => Math.min(prev + 1, data.length - 1))
          }
          className={`border px-4 py-2 font-bold ${
            currentImg === data.length - 1 && "opacity-50"
          }`}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Carousel;
