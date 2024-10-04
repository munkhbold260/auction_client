import Image from "next/image";
import React from "react";
import Slider from "react-slick";

export default function Card({ items }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 items at a time
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Slider {...settings}>
        {items.map((item) => (
          <div className="p-4 w-[150px] h-[200px]">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src={item.images} // Display the first image
                alt={item.name}
                className=" h-full "
              />
              <div className="p-4">
                <h2 className="text-xl font-bold">{item.name}</h2>
                <p className="text-gray-700">{item.description}</p>
                <p className="text-gray-900 font-bold">${item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
