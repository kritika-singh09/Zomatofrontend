import React from "react";
import { useAppContext } from '../context/AppContext';

const CodeNumber = () => {
  const { phone } = useAppContext();

  return (
    // Mobile view
    <div className="text-m mx-6 p-6 font-sans text-center">
      <p>We have sent a verification code to</p>
      <p className=" text-center font-semibold">{phone}</p>
    </div>
  );
};

export default CodeNumber;
