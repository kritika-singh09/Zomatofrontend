// src/components/variationPage/VariationFooter.jsx
import React, { useState, useEffect, useRef } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useAppContext } from "../../context/AppContext";

const VariationFooter = ({
  food,
  onClose,
  basePrice,
  addonPrice,
  onAddToCart,
  quantity,
  onQuantityChange,
}) => {
  const { cart, addToCartWithQuantity, removeFromCart } = useAppContext();
  // const [quantity, setQuantity] = useState(1);
  // // const initialRender = useRef(true);
  // const baseItemId = useRef(food?.id?.split("-")[0] || food?.id);

  // // Get current quantity from cart
  // useEffect(() => {
  //   if (food && food.id) {
  //     // Check for exact match of this specific variation
  //     const exactMatch = cart.find((item) => item.id === food.id);
  //     if (exactMatch) {
  //       setQuantity(exactMatch.quantity);
  //     } else {
  //       // Check if there's a match with the base item ID (without variations)
  //       const baseId = food.id.split("-")[0] || food.id;
  //       const baseMatch = cart.find(
  //         (item) => (item.id.split("-")[0] || item.id) === baseId
  //       );

  //       if (baseMatch) {
  //         // Keep the quantity from the base item
  //         setQuantity(baseMatch.quantity);
  //       }
  //       // Only set to 1 if it's a completely new item
  //     }
  //   }
  // }, [food?.id, cart]);

  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    } else if (quantity === 1) {
      // Remove item from cart when quantity is 1
      if (food && food.id) {
        removeFromCart(food.id);
        if (typeof onClose === "function") {
          onClose();
        }
      }
    }
  };

  const handleAddToCart = () => {
    if (!food) return;
    addToCartWithQuantity(food, quantity);
    if (typeof onAddToCart === "function") {
      onAddToCart(quantity);
    }
    if (typeof onClose === "function") {
      onClose();
    }
  };

  if (!food) return null;

  // Calculate total price: (base price × quantity) + addon price
  const itemBasePrice =
    basePrice || parseFloat(food.basePrice || food.price || 0);
  const itemAddonPrice = addonPrice || parseFloat(food.addonPrice || 0);
  const totalPrice = itemBasePrice * quantity + itemAddonPrice;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 flex justify-between">
      {/* Left side - Counter */}
      <div className="flex items-center border rounded-md overflow-hidden">
        <button
          className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700"
          onClick={handleDecrement}
        >
          <AiOutlineMinus size={16} />
        </button>
        <span className="w-10 h-10 flex items-center justify-center bg-white">
          {quantity}
        </span>
        <button
          className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700"
          onClick={handleIncrement}
        >
          <AiOutlinePlus size={16} />
        </button>
      </div>

      {/* Right side - Add to Cart button with total */}
      <button
        className="bg-red-800 text-white px-6 py-2 rounded-md flex-grow ml-4 flex items-center justify-center"
        onClick={handleAddToCart}
      >
        <span>Add to Cart</span>
        <span className="ml-2 font-bold">₹{totalPrice.toFixed(2)}</span>
      </button>
    </div>
  );
};

export default VariationFooter;
