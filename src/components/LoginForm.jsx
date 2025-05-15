import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const LoginForm = () => {
  const { phone, setPhone, isValid, setIsValid } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Clean up reCAPTCHA on component unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (e) {
          console.log("Error clearing reCAPTCHA on unmount:", e);
        }
      }
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    const phoneRegex = /^[0-9]{10}$/;
    setIsValid(phoneRegex.test(value));
  }

  const setupRecaptcha = () => {
    // Clean up any existing instances
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.log("Error clearing existing reCAPTCHA:", e);
      }
      window.recaptchaVerifier = null;
    }
    
    // Clear the container
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
    }
    
    // Create new instance
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: () => {},
      'expired-callback': () => {
        toast.error("reCAPTCHA expired. Please try again.");
        setLoading(false);
      }
    });
  }

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (phone.length === 10 && /^[0-9]+$/.test(phone)) {
      try {
        setupRecaptcha();
        
        const confirmation = await signInWithPhoneNumber(
          auth,
          "+91" + phone,
          window.recaptchaVerifier
        );
        
        if (confirmation) {
          window.confirmationResult = confirmation;
          toast.success("OTP sent successfully!");
          navigate('/verification');
        }
      } catch (error) {
        console.error("Error:", error);
        
        if (error.code === 'auth/too-many-requests') {
          toast.error("Too many requests. Please try again after some time.");
        } else if (error.message && error.message.includes('reCAPTCHA')) {
          toast.error("reCAPTCHA error. Please refresh the page and try again.");
        } else {
          toast.error("Failed to send OTP. Try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please enter a valid 10-digit phone number.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className='relative mt-5'>
        <div className='text-center absolute top-2 bg-white z-10 px-2 login-text'>
          <h1 className='text-center'>Login in or sign up</h1>
        </div>
        <hr className='mt-5 relative top-6' />
      </div>
      <form className='mt-12 text-center' onSubmit={sendOtp}>
        <div className="flex items-center justify-center mb-3">
          <div className="border border-r-0 mb-3 border-gray-400 py-2.5 px-3 rounded-l-md bg-gray-100">+91</div>
          <input 
            className='border border-l-0 border-gray-400 w-[195px] py-2.5 px-1.5 rounded-r-md mb-3 focus:outline-none focus:border-gray-400' 
            pattern="[0-9]{10}" 
            type="tel" 
            placeholder='Enter Phone Number' 
            value={phone} 
            onChange={handleChange} 
          />
        </div>
        {!isValid && phone.length > 3 && (
          <p className="text-red-500 text-sm mt-1">
            Please enter a valid Indian phone number
          </p>
        )}
        <button 
          type='submit' 
          disabled={loading} 
          className='w-[250px] py-2.5 px-1.5 rounded-md text-white bg-red-400 transition-all duration-300 ease-in-out hover:bg-red-800'
        >
          {loading ? 'Sending...' : 'Continue'}
        </button>
        <div id="recaptcha-container" className="mb-3 flex justify-center mt-3"></div>
      </form>
    </>
  )
}

export default LoginForm;
