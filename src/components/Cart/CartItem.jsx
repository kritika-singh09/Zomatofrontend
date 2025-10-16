import React from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
// import CartPage from "./CartPage";
import { VscDiffModified } from "react-icons/vsc";

const CartItem = ({ item, onUpdateQuantity, onRemoveItem, onAddMore }) => {
  // Calculate item total price
  let itemPrice = 0;
  try {
    // Handle price parsing safely
    itemPrice = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
  } catch (error) {
    console.error("Error parsing price:", error);
  }

  const totalPrice = itemPrice * item.quantity;

  return (
    <div className="border-b border-gray-200 py-4">
      {/* Item details */}
      <div className="flex mb-3 ">
        <div style={{ margin: "0.5rem 0.5rem 0.5rem 0" }}>
          {item.veg ? (
            <VscDiffModified className="text-green-600  " />
          ) : (
            <VscDiffModified className="text-red-600" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-medium">{item.name}</h3>
          {(item.variationDetails || item.addonDetails) && (
            <div className="text-xs text-gray-500 mb-1">
              {item.variationDetails && <span>{item.variationDetails} </span>}
              {item.addonDetails && <span>{item.addonDetails}</span>}
            </div>
          )}
          {/* <p className="text-sm text-gray-500">{item.restaurant}</p> */}
          <p className="text-sm font-medium">₹{item.price}</p>
        </div>
        {/* Quantity controls */}
        <div className="flex justify-between items-center ">
          <div className="flex items-center">
            <button
              className="cursor-pointer w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 hover:bg-gray-100"
              onClick={() =>
                item.quantity <= 1
                  ? onRemoveItem(item.id)
                  : onUpdateQuantity(item.id, item.quantity - 1)
              }
            >
              {item.quantity <= 1 ? (
                <FaTrash size={12} />
              ) : (
                <FaMinus size={12} />
              )}
            </button>
            <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white">
              {item.quantity}
            </span>
            <button
              className=" cursor-pointer w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 text-gray-600 hover:bg-gray-100"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          className="text-red-500 text-sm flex items-center cursor-pointer"
          onClick={() => onRemoveItem(item.id)}
        >
          <FaTrash size={10} className="mr-1" /> Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
