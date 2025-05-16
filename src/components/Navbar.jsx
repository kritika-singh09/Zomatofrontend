import React from "react";
import { GoArrowLeft } from "react-icons/go";

const Navbar = () => {
  const handleBack = () => {
    window.history.back();
  };
  return (
    // Mobile view
    <div>
      <div className="text-2xl flex relative font-normal p-2">
        <GoArrowLeft className="absolute my-1" onClick={handleBack} />
      </div>
    </div>
  );
};

export default Navbar;
