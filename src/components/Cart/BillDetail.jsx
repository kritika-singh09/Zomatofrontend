// BillDetail.jsx
import React, { useEffect } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { FaTimes } from "react-icons/fa";

const BillDetail = ({
  subtotal,
  deliveryFee,
  gst,
  totalPrice,
  showDetails,
  toggleDetails,
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (showDetails) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showDetails]);

  return (
    <>
      {/* Total bill row with dropdown toggle */}
      <div className=" border-t border-gray-200">
        <div
          className="flex justify-between font-bold text-lg mt-4 cursor-pointer"
          onClick={toggleDetails}
        >
          <span>
            Total Bill: <span>₹{Math.round(subtotal + deliveryFee + gst)}</span>
          </span>
          <RiArrowDropDownLine className="text-3xl" />
        </div>
      </div>

      {/* Semi-transparent overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          showDetails ? "opacity-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleDetails}
      ></div>

      {/* Sliding panel for bill details */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 transform ${
          showDetails ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white rounded-t-2xl p-5 shadow-lg">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Bill Details</h2>
            <button
              className="text-gray-500 p-1 hover:bg-gray-100 rounded-full"
              onClick={toggleDetails}
            >
              <FaTimes />
            </button>
          </div>

          {/* Bill details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Item Total</span>
              <span>₹{Math.round(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span>₹{Math.floor(deliveryFee)}</span>
            </div>

            <div className="flex justify-between pb-3 border-b border-gray-200">
              <span className="text-gray-600">GST (5%)</span>
              <span>₹{Math.round(gst)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>To Pay</span>
              <span>₹{Math.floor(subtotal + deliveryFee + gst)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillDetail;
