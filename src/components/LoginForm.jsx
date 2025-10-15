import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const LoginForm = () => {
  const { phone, setPhone, isValid, setIsValid, setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    const phoneRegex = /^[0-9]{10}$/;
    setIsValid(phoneRegex.test(value));
  };



  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (phone.length === 10 && /^[0-9]+$/.test(phone)) {
      setTimeout(() => {
        localStorage.setItem("user", JSON.stringify({ phone }));
        localStorage.setItem("isLoggedIn", "true");
        setCurrentUser(true);
        toast.success("Login successful!");
        navigate("/");
        setLoading(false);
      }, 500);
    } else {
      toast.error("Please enter a valid 10-digit phone number.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative mt-5">
        <div className="text-center absolute top-2 bg-white z-10 px-2 login-text">
          <h1 className="text-center">Login in or sign up</h1>
        </div>
        <hr className="mt-5 relative top-6" />
      </div>
      <form className="mt-12 text-center" onSubmit={sendOtp}>
        <div className="flex items-center justify-center mb-0">
          <div className="border border-r-0  border-gray-400 py-2.5 px-3 rounded-l-md bg-gray-100">
            +91
          </div>
          <input
            className="border border-l-0 border-gray-400 w-[195px] py-2.5 px-1.5 rounded-r-md  focus:outline-none focus:border-gray-400"
            pattern="[0-9]{10}"
            type="tel"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={handleChange}
          />
        </div>
        {!isValid && phone.length > 3 && (
          <p className="text-red-500 text-xs">
            Please enter a valid Indian phone number
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-[250px] py-2.5 mt-4 px-1.5 rounded-md bg-red-800 text-white ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Continue"}
        </button>

      </form>
    </>
  );
};

export default LoginForm;
