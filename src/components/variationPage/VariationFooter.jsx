// src/components/variationPage/VariationFooter.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useAppContext } from "../../context/AppContext";

const VariationFooter = ({ food }) => {
  const { addToCart, cart, navigate } = useAppContext();

  // Get current quantity from cart
  const getItemQuantityInCart = () => {
    if (!food) return 0;
    const cartItem = cart.find((item) => item.id === food.id);
    return cartItem ? cartItem.quantity : 0;
  };

  // Initialize quantity with current cart value or 1
  const [quantity, setQuantity] = useState(() => {
    const cartQuantity = getItemQuantityInCart();
    return cartQuantity > 0 ? cartQuantity : 1;
  });

  // Update quantity if cart changes
  useEffect(() => {
    const cartQuantity = getItemQuantityInCart();
    if (cartQuantity > 0) {
      setQuantity(cartQuantity);
    }
  }, [cart, food]);

  if (!food) return null;

  const price =
    typeof food.price === "number"
      ? food.price
      : parseFloat(food.price?.replace(/[^\d.]/g, "")) || 0;
  const totalPrice = price * quantity;

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // Clear existing items for this food
    const existingQuantity = getItemQuantityInCart();

    // Add the item with the new quantity
    if (quantity > existingQuantity) {
      // Add additional items
      for (let i = 0; i < quantity - existingQuantity; i++) {
        addToCart(food);
      }
    } else if (quantity < existingQuantity) {
    }

    navigate("/");
  };

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
