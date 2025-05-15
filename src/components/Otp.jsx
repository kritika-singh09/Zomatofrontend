import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";


const Otp = () => {
  const { phone, otp, setOtp,login,  verifyOTP, setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      if (!window.confirmationResult) {
        toast.error("OTP session expired. Please resend OTP.");
         setIsSubmitting(false);
        return;
      }

      // Verify with Firebase
      const result = await window.confirmationResult.confirm(combinedOtp);
      console.log("Firebase verification result:", result);
      if (result.user) {
        // Get Firebase UID
        const firebaseUid = result.user.uid;
        try{
        // Send to your backend
         const response = await fetch("https://hotelbuddhaavenue.vercel.app/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            firebaseUid
          }),
        });
        
        const data = await response.json();
        console.log("API response data:", data)
        
       if (data.success) {
          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify({ 
            phone, 
            firebaseUid,
            ...(data.user ? { userData: data.user } : {})
          }));
          localStorage.setItem("isLoggedIn", "true");
          
         toast.success("Login successful!", {
            onClose: () => {
              // Only redirect after toast is closed or after 3 seconds
              setTimeout(() => {
                window.location.href = "/";
              }, 3000);
            },
            autoClose: 2500 // Toast will show for 2.5 seconds
          });
        } else {
          toast.error(data.message || "Login failed. Please try again.");
          console.error("API error:", data);
          setIsSubmitting(false);
        }
      } catch (apiError) {
        console.error("API call failed:", apiError);
        toast.error("Server error. Please try again.");
        setIsSubmitting(false);
      }
    } else {
      toast.error("Verification failed. Please try again.");
      setIsSubmitting(false);
    }
  } catch (error) {
    console.error("OTP verification failed:", error);
    toast.error("Invalid OTP. Please try again.");
    setIsSubmitting(false);
  }
};

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
              disabled={isSubmitting}
            />
          ))}
        </div>
        <div className="text-center mt-6">
          <button
          type="submit"
          className={`w-[250px] py-2.5 px-1.5 rounded-md bg-red-800 text-white ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Verifying...' : 'Verify OTP'}
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
export default Otp;
