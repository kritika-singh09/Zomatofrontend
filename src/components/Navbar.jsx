import React from "react";
import { GoArrowLeft } from "react-icons/go";

const Navbar = () => {
  const handleBack = () => {
    window.history.back();
  };
  return (
    // Mobile view
    <div className="bg-gray-200 max-w-xl mx-auto">
      <div className="text-2xl flex  font-normal p-2">
        <GoArrowLeft className=" my-1" onClick={handleBack} />
      </div>
    </div>
  );
};

export default Navbar;
