// FoodCard.jsx
import React, { useState, memo } from "react";
import { FaStar, FaFire, FaHeart, FaLeaf } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { GiNoodles, GiChickenLeg, GiCupcake } from "react-icons/gi";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useAppContext } from "../../context/AppContext";
import AddToCartButton from "../AddToCart";
import { VscDiffModified } from "react-icons/vsc";

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

const FoodCard = memo(({ food, onFoodClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { cart, addToCart, removeFromCart, updateCartItemQuantity, navigate } =
    useAppContext();
  const TagIcon = IconMap[food.tagIcon];

  // const handleClick = () => {
  //   navigate("/variation", { state: { food } });
  // };

  // Get item quantity in cart
  const getItemQuantityInCart = (itemId) => {
    const cartItem = cart.find((item) => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const itemQuantity = getItemQuantityInCart(food.id);

  return (
    <div
      onClick={() => onFoodClick && onFoodClick(food)}
      className="cursor-pointer transition-transform hover:scale-105 w-1/3 px-2 mb-4"
    >
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
          {/* <div
            className={`absolute top-2 left-2 ${food.tagBg} px-2 py-1 rounded-full flex items-center`}
          >
            {TagIcon && <TagIcon className={food.tagIconColor} />}
            <span className="ml-1 text-xs font-medium">{food.tag}</span>
          </div> */}
        </div>

        {/* Food Details */}
        <div className="p-2">
          <div className="flex items-center">
            <h3 className="font-bold text-sm truncate">{food.name}</h3>
            <div className="ml-1">
              {food.veg ? (
                <VscDiffModified className="text-green-600" />
              ) : (
                <VscDiffModified className="text-red-600" />
              )}
            </div>
          </div>
          <div className="flex mb-1 items-center mt-1">
            <FaStar className="text-yellow-500 text-xs" />
            <span className="ml-1 text-xs">{food.rating}</span>
            <span className="mx-1 text-gray-300 text-xs">•</span>
          </div>
          <div className="item-actions">
            <AddToCartButton item={food} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default FoodCard;
