// src/components/ItemCustomizationModal.jsx
import React, { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useAppContext } from "../context/AppContext";
import { createPortal } from "react-dom";

const ANIMATION_DURATION = 400;

const ItemCustomizationModal = ({
  item,
  onClose,
  onIncrement,
  onDecrement,
  onAddNewCustomization,
  quantity,
}) => {
  const { cart, addToCartWithQuantity, removeFromCart } = useAppContext();
  const [shouldRender, setShouldRender] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    let btnTimeout;
    setShouldRender(true);
    setTimeout(() => setIsActive(true), 10);
    btnTimeout = setTimeout(() => setShowCloseButton(true), ANIMATION_DURATION);
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(btnTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setIsActive(false);
    setShowCloseButton(false);
    const timeout = setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = "";
      onClose();
    }, ANIMATION_DURATION);
    return () => clearTimeout(timeout);
  };

  if (!item || !shouldRender) return null;

  // Get all variations of this item in the cart
  const itemVariations = Object.values(cart).filter((cartItem) =>
    cartItem.id.startsWith(`${item.id.split("-")[0]}-`)
  );

  const handleVariationIncrement = (variation) => {
    addToCartWithQuantity(variation, variation.quantity + 1);
  };

  const handleVariationDecrement = (variation) => {
    if (variation.quantity > 1) {
      addToCartWithQuantity(variation, variation.quantity - 1);
    } else {
      // If this is the last item in cart, close the modal
      if (itemVariations.length === 1) {
        removeFromCart(variation.id);
        handleClose();
      } else {
        // Otherwise just remove this variation
        removeFromCart(variation.id);
      }
    }
  };

  return createPortal(
    <>
      {/* Dimmed overlay */}
      <div
        className="bottomsheet-overlay"
        style={{
          opacity: isActive ? 1 : 0,
          pointerEvents: isActive ? "auto" : "none",
        }}
        onClick={handleClose}
      />

      {/* Close button just above the modal */}
      {showCloseButton && (
        <button
          className="fixed left-1/2 z-50 items-center -translate-x-1/2 bottom-[50vh] mb-2 bg-white rounded-full shadow-lg border border-gray-200 w-10 h-10 flex justify-center text-2xl text-gray-500 close-btn-animate"
          onClick={handleClose}
        >
          &times;
        </button>
      )}

      {/* Sliding bottom sheet */}
      <div
        className={`bottomsheet-sheet${isActive ? " open" : ""}`}
        style={{
          height: "auto",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div className="overflow-y-auto px-2">
          <div className="bg-white rounded-t-xl w-full overflow-hidden">
            <div className="p-4 border-b-gray-400">
              <h3 className="font-bold text-lg">{item.name}</h3>
            </div>

            <div className="p-4">
              {/* Show all variations in cart */}
              {itemVariations.length > 0 && (
                <div>
                  <p className="text-gray-700 font-medium mb-2">
                    Your Customizations:
                  </p>
                  <div className="max-h-60 overflow-y-auto">
                    {itemVariations.map((variation, idx) => (
                      <div
                        key={idx}
                        className={`p-2 mb-2 rounded-md border ${
                          variation.id === item.id
                            ? "border-red-800 bg-red-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium">
                              {variation.variationDetails || "Regular"}
                            </div>
                            {variation.addonDetails && (
                              <div className="text-xs text-gray-500">
                                {variation.addonDetails}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center border rounded-md overflow-hidden">
                            <button
                              className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-700"
                              onClick={() =>
                                handleVariationDecrement(variation)
                              }
                            >
                              <AiOutlineMinus size={14} />
                            </button>
                            <span className="w-7 h-7 flex items-center justify-center bg-white text-sm">
                              {variation.quantity}
                            </span>
                            <button
                              className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-700"
                              onClick={() =>
                                handleVariationIncrement(variation)
                              }
                            >
                              <AiOutlinePlus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="w-full py-2 bg-red-800 text-white rounded-md mt-4"
                onClick={onAddNewCustomization}
              >
                Add New Customization
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ItemCustomizationModal;
