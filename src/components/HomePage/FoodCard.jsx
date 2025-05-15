// FoodCard.jsx
import React, { useState, memo } from "react";
import { FaStar, FaFire, FaHeart, FaLeaf } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { GiNoodles, GiChickenLeg, GiCupcake } from "react-icons/gi";

// Icon mapping object
const IconMap = {
  FaStar: FaStar,
  FaFire: FaFire,
  FaHeart: FaHeart,
  FaLeaf: FaLeaf,
  MdLocalOffer: MdLocalOffer,
  GiNoodles: GiNoodles,
  GiChickenLeg: GiChickenLeg,
  GiCupcake: GiCupcake,
};

const FoodCard = memo(({ food }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const TagIcon = IconMap[food.tagIcon];

  return (
    <div className="cursor-pointer transition-transform hover:scale-105 w-1/3 px-2 mb-4">
      <div className="rounded-lg shadow-md overflow-hidden">
        {/* Food Image */}
        <div className="h-32 bg-gray-100 relative">
          {/* Placeholder while image loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="animate-pulse">Loading...</div>
            </div>
          )}
          {/* Placeholder image */}
          <img
            src={food.image}
            alt="Placeholder"
            className={`w-full h-full object-cover ${
              imageLoaded ? "hidden" : "block"
            }`}
          />
          {/* Actual image - hidden until loaded */}
          <img
            src={food.image}
            alt={food.name}
            className={`w-full h-full object-cover ${
              imageLoaded ? "block" : "hidden"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              // Show a fallback if image fails to load
              setImageLoaded(true);
            }}
          />

          {/* Tag */}
          <div
            className={`absolute top-2 left-2 ${food.tagBg} px-2 py-1 rounded-full flex items-center`}
          >
            {TagIcon && <TagIcon className={food.tagIconColor} />}
            <span className="ml-1 text-xs font-medium">{food.tag}</span>
          </div>
        </div>

        {/* Food Details */}
        <div className="p-2">
          <h3 className="font-bold text-sm truncate">{food.name}</h3>
          <div className="flex items-center mt-1">
            <FaStar className="text-yellow-500 text-xs" />
            <span className="ml-1 text-xs">{food.rating}</span>
            <span className="mx-1 text-gray-300 text-xs">•</span>
            <span className="text-xs text-gray-600 truncate">
              {food.restaurant}
            </span>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="font-bold text-xs">{food.price}</span>

            <button className="bg-white border border-primary text-primary px-2 py-0.5 rounded-md text-xs hover:bg-primary hover:text-white transition-colors">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FoodCard;
