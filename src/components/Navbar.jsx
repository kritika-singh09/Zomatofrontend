import React from "react";
import {GoArrowLeft } from "react-icons/go";

const Navbar = () => {
  const handleBack = () => {
    window.history.back();
  };
  return (
    // Mobile view
    <div>
      <div className="text-2xl flex relative font-normal p-2">
        <GoArrowLeft className="absolute my-1" onClick={handleBack} />
        <h1 className="mx-10">OTP Verification</h1>
      </div>
      {/* <CodeNumber />
      <Otp />
      <div className="text-center text-sm text-blue-700 p-4">
        <p>Check text messages for you OTP</p>
      </div>
      <Send /> */}
    </div>
  );
};

export default Navbar;
