import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";

const AddToCartButton = ({ item }) => {
  const { cart, addToCart, removeFromCart, updateCartItemQuantity } =
    useAppContext();

  // Check if item is valid before proceeding
  if (!item || !item.id) {
    return (
      <button
        className="px-4 py-1 w-20 bg-light text-primary cursor-not-allowed border border-gray-300 rounded-md opacity-50"
        disabled
      >
        Add
      </button>
    );
  }

  // Get item quantity in cart
  const getItemQuantity = () => {
    const cartItem = cart.find((cartItem) => cartItem.id === item.id);
    return cartItem ? cartItem.quantity : 0;
  };

  const quantity = getItemQuantity();

  if (quantity > 0) {
    return (
      <div className="flex items-center border w-20 border-primary rounded-md overflow-hidden">
        <button
          className={`w-8 h-8 flex items-center justify-center bg-light text-primary`}
          onClick={(e) => {
            e.stopPropagation();
            if (quantity === 1) {
              removeFromCart(item.id);
            } else {
              updateCartItemQuantity(item.id, quantity - 1);
            }
          }}
        >
          {quantity === 1 ? (
            <AiOutlineDelete size={16} />
          ) : (
            <AiOutlineMinus size={16} />
          )}
        </button>
        <span className="w-8 h-8 flex items-center justify-center bg-white">
          {quantity}
        </span>
        <button
          className="w-8 h-8  bg-light text-primary flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            updateCartItemQuantity(item.id, quantity + 1);
          }}
        >
          <AiOutlinePlus size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      className="px-4 py-1 w-20 bg-light text-primary cursor-pointer border border-red-800 rounded-md transition-all ease-in-out duration-300"
      onClick={(e) => {
        e.stopPropagation();
        addToCart(item);
      }}
    >
      Add
    </button>
  );
};

export default AddToCartButton;
