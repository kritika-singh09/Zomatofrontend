import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Otp = () => {
  const { phone, otp, setOtp, verifyOTP, setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpInputs = [...otpInputs];
      newOtpInputs[index] = value;
      setOtpInputs(newOtpInputs);
      
      // Combine all inputs to form the complete OTP
      const combinedOtp = newOtpInputs.join("");
      setOtp(combinedOtp);
      
      // Auto-focus next input field
      if (value !== "" && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otpInputs[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };
  
  const verifyOtp = async (e) => {
    e.preventDefault();
    const combinedOtp = otpInputs.join("");

    if (!combinedOtp || combinedOtp.length !== 6) {
      toast.error("Enter a 6-digit OTP.");
      return;
    }

    try {
      if (!window.confirmationResult) {
        toast.error("OTP session expired. Please resend OTP.");
        return;
      }

      const result = await verifyOTP(phone, combinedOtp);
      // const result = await window.confirmationResult.confirm(combinedOtp);
      console.log({
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber
      });
      if (result.success) {
        toast.success("OTP verified!");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      } else {
        toast.error(result.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("Invalid OTP. Please try again.");
    }
    return (
      <form onSubmit={verifyOtp}>
        <div className="flex justify-around mt-10">
          {otpInputs.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              inputMode="numeric"
              className="h-[50px] w-[40px] border border-grey-300 text-center text-2xl rounded-lg"
              required
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              autoFocus={index === 0}
            />
          ))}
        </div>
        <div className="text-center mt-6">
          <button
            type="submit"
            className="w-[250px] py-2.5 px-1.5 rounded-md bg-red-800 text-white"
          >
            Verify OTP
          </button>
        </div>
      </form>
      // <div className="flex justify-around mt-10">
      //   <input
      //     type="number"
      //     className="h-[50px] w-[40px] border border-grey-300 text-center text-2xl rounded-lg"
      //     required
      //     maxLength="1"
      //     onInput={(e) => {
      //       e.target.value = e.target.value.slice(0, 1);
      //     }}
      //   />
      //   <input
      //     type="number"
      //     className="h-[50px] w-[40px] border border-grey-300 text-center text-2xl rounded-lg"
      //     required
      //     maxLength="1"
      //     onInput={(e) => {
      //       e.target.value = e.target.value.slice(0, 1);
      //     }}
      //   />
      //   <input
      //     type="number"
      //     className="h-[50px] w-[40px] border border-grey-300 text-center text-2xl rounded-lg"
      //     required
      //     maxLength="1"
      //     onInput={(e) => {
      //       e.target.value = e.target.value.slice(0, 1);
      //     }}
      //   />
      //   <input
      //     type="number"
      //     className="h-[50px] w-[40px] border border-grey-300 text-center text-2xl rounded-lg"
      //     required
      //     maxLength="1"
      //     onInput={(e) => {
      //       e.target.value = e.target.value.slice(0, 1);
      //     }}
      //   />
      //   <input
      //     type="number"
      //     className="h-[50px] w-[40px] border border-grey-300  text-center text-2xl rounded-lg"
      //     required
      //     maxLength="1"
      //     onInput={(e) => {
      //       e.target.value = e.target.value.slice(0, 1);
      //     }}
      //   />
      //   <input
      //     type="number"
      //     className="h-[50px] w-[40px] border border-grey-300  text-center text-2xl rounded-lg"
      //     required
      //     maxLength="1"
      //     onInput={(e) => {
      //       e.target.value = e.target.value.slice(0, 1);
      //     }}
      //   />
      // </div>
    );
  };
};
export default Otp;
