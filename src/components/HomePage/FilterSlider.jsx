import React from "react";
import {
  FaRupeeSign,
  FaClock,
  FaPercent,
  FaStar,
  FaHistory,
  FaLeaf,
} from "react-icons/fa";
import { MdFiberNew } from "react-icons/md";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const FilterSlider = () => {
  // Filter blocks data
  const filterBlocks = [
    {
      id: 1,
      title: "Filter",
      icon: <IoIosArrowDropdownCircle />,
      iconColor: "text-black-600",
    },
    {
      id: 2,
      title: "Under Rs.150",
      icon: <FaRupeeSign />,
      iconColor: "text-blue-600",
    },
    {
      id: 3,
      title: "New on Swiggy",
      icon: <MdFiberNew />,
      iconColor: "text-orange-600",
    },
    {
      id: 4,
      title: "Under 30 min",
      icon: <FaClock />,
      iconColor: "text-green-600",
    },
    {
      id: 5,
      title: "Great Offers",
      icon: <FaPercent />,
      iconColor: "text-purple-600",
    },
    {
      id: 6,
      title: "Rating 4.0+",
      icon: <FaStar />,
      iconColor: "text-yellow-600",
    },
    {
      id: 7,
      title: "Previously Ordered",
      icon: <FaHistory />,
      iconColor: "text-red-600",
    },
    {
      id: 8,
      title: "Pure Veg",
      icon: <FaLeaf />,
      iconColor: "text-green-600",
    },
  ];
  return (
    // Filter Blocks Horizontal Slider Section
    <div className="mt-8 px-4">
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {filterBlocks.map((block) => (
            <div
              key={block.id}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <div
                className={`flex items-center px-4 py-3 rounded-lg shadow-md`}
              >
                <div className={`mr-2 ${block.iconColor}`}>{block.icon}</div>
                <p className="font-medium text-gray-800">{block.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSlider;
