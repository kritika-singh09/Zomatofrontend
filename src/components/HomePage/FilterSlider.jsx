import React, { useState } from "react";
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
import { sortItems } from "../../services/api";

const FilterSlider = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterClick = async (filter) => {
    setActiveFilter(filter.id);
    
    let sortBy = 'rating';
    let veg = null;
    
    switch(filter.id) {
      case 1: // Default - Rating High to Low
        sortBy = 'rating';
        break;
      case 2: // Price Low to High
        sortBy = 'price_low';
        break;
      case 3: // Price High to Low
        sortBy = 'price_high';
        break;
      case 4: // Delivery Time
        sortBy = 'delivery';
        break;
      case 5: // Rating 4.0+
        sortBy = 'rating';
        break;
      case 6: // Pure Veg + Rating
        veg = true;
        sortBy = 'rating';
        break;
      case 7: // Non-Veg + Price Low
        veg = false;
        sortBy = 'price_low';
        break;
      default:
        sortBy = 'rating';
    }
    
    try {
      const result = await sortItems(sortBy, veg);
      if (result.success && onFilterChange) {
        onFilterChange(result.data);
      }
    } catch (error) {
      console.error('Filter error:', error);
    }
  };
  const filterBlocks = [
    {
      id: 1,
      title: "Rating High to Low",
      icon: <FaStar />,
      iconColor: "text-yellow-600",
    },
    {
      id: 2,
      title: "Price Low to High",
      icon: <FaRupeeSign />,
      iconColor: "text-blue-600",
    },
    {
      id: 3,
      title: "Price High to Low",
      icon: <FaRupeeSign />,
      iconColor: "text-red-600",
    },
    {
      id: 4,
      title: "Delivery Time",
      icon: <FaClock />,
      iconColor: "text-green-600",
    },
    {
      id: 5,
      title: "Rating 4.0+",
      icon: <FaStar />,
      iconColor: "text-orange-600",
    },
    {
      id: 6,
      title: "Veg + Rating",
      icon: <FaLeaf />,
      iconColor: "text-green-600",
    },
    {
      id: 7,
      title: "Non-Veg + Price",
      icon: <FaHistory />,
      iconColor: "text-red-600",
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
              onClick={() => handleFilterClick(block)}
            >
              <div
                className={`flex items-center px-4 py-3 rounded-lg shadow-md ${
                  activeFilter === block.id ? 'bg-red-100 border-2 border-red-500' : 'bg-white'
                }`}
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
