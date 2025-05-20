// src/components/variationPage/VariationFooter.jsx
import React, { useState, useEffect, useRef } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useAppContext } from "../../context/AppContext";

const VariationFooter = ({ food, onClose }) => {
  const { cart, addToCartWithQuantity, removeFromCart } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const initialRender = useRef(true);
  const baseItemId = useRef(food?.id?.split("-")[0] || food?.id);

  // Get current quantity from cart
  useEffect(() => {
    if (food && baseItemId.current) {
      // Check for exact match first
      const exactMatch = cart.find((item) => item.id === food.id);
      if (exactMatch) {
        setQuantity(exactMatch.quantity);
        return;
      }

      // Check for the base item (without variations/addons)
      const baseItem = cart.find((item) => item.id === baseItemId.current);
      if (baseItem) {
        setQuantity(baseItem.quantity);
        return;
      }

      // Check for any variations of the base item
      const variations = cart.filter((item) =>
        item.id.startsWith(`${baseItemId.current}-`)
      );

      if (variations.length > 0) {
        // If variations exist, set quantity to the first variation's quantity
        setQuantity(variations[0].quantity);
      } else if (initialRender.current) {
        // Only set to 1 on initial render if no items found
        setQuantity(1);
        initialRender.current = false;
      }
    }
  }, [cart]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
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

    // Add to cart with the selected quantity
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
