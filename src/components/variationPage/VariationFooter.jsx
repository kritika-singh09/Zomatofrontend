// src/components/variationPage/VariationFooter.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useAppContext } from "../../context/AppContext";

const VariationFooter = ({ food, onClose }) => {
  const { cart, addToCartWithQuantity } = useAppContext();
  const [quantity, setQuantity] = useState(1);

  // Get current quantity from cart
  useEffect(() => {
    if (food) {
      const cartItem = cart.find((item) => item.id === food.id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      }
    }
  }, [food, cart]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!food) return;

    // Use the addToCartWithQuantity function to handle all cases
    addToCartWithQuantity(food, quantity);

    // Close the modal
    if (typeof onClose === "function") {
      onClose();
    } else {
      console.error("onClose is not a function:", onClose);
    }
  };

  if (!food) return null;

  const price =
    typeof food.price === "number"
      ? food.price
      : parseFloat(food.price?.replace(/[^\d.]/g, "")) || 0;
  const totalPrice = price * quantity;

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
