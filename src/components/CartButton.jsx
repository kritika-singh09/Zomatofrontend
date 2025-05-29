// src/components/CartButton.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { BsCart3 } from "react-icons/bs";
import { useLocation } from "react-router-dom";

const CartButton = () => {
  const { navigate, cart } = useAppContext();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [hasCurrentOrder, setHasCurrentOrder] = useState(false);

  // Check if current order exists
  useEffect(() => {
    const checkCurrentOrder = () => {
      const currentOrderElement = document.getElementById("currentOrder");
      setHasCurrentOrder(!!currentOrderElement);
    };

    // Check initially
    checkCurrentOrder();

    // Set up a mutation observer to detect when the current order component is added/removed
    const observer = new MutationObserver(checkCurrentOrder);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Calculate total items in cart
  const totalItems = Object.values(cart).reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Show button animation when cart changes
  useEffect(() => {
    if (totalItems > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [cart, totalItems]);

  // Don't show on login or cart pages
  if (
    location.pathname === "/login" ||
    location.pathname === "/verification" ||
    location.pathname === "/cart"
  ) {
    return null;
  }

  return (
    <button
      onClick={() => navigate("/cart")}
      className={`fixed ${
        hasCurrentOrder ? "bottom-24" : "bottom-5"
      } right-5 bg-secondary text-white p-3 rounded-xl shadow-lg z-50 flex items-center justify-center transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
      style={{ width: "60px", height: "60px" }}
    >
      <div className="relative">
        <BsCart3 size={24} />
        {totalItems > 0 && (
          <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {totalItems}
          </div>
        )}
      </div>
    </button>
  );
};

export default CartButton;
