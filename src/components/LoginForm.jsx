import React, { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const LoginForm = () => {
  const { phone, setPhone, isValid, setIsValid,login, otp, setOtp, currentUser, setCurrentUser } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setPhone(value);
     // Validate phone number format
  const phoneRegex = /^[0-9]{10}$/;
  setIsValid(phoneRegex.test(value));
  }

const sendOtp = async (e) => {
  e.preventDefault();
  if (phone.length === 10 && /^[0-9]+$/.test(phone)) {
    try {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }
      
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth, "recaptcha-container",
          {
            size: "normal",
            callback: (response) => {
              console.log("reCAPTCHA solved");
            },
            "expired-callback": () => {
              toast.error("reCAPTCHA expired. Please solve it again.");
            }
          }
        );
      }
      
      // Render the reCAPTCHA widget
      await window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
      
      const appVerifier = window.recaptchaVerifier;
      
      try {
        const confirmation = await signInWithPhoneNumber(
          auth,
          "+91" + phone,
          appVerifier
        );
        
        if (confirmation && confirmation.verificationId) {
          window.confirmationResult = confirmation;
          toast.success("OTP sent successfully!");
          navigate('/verification');
        } else {
          toast.error("Failed to initiate OTP process.");
        }
      } catch (error) {
        console.error("OTP send error:", error);
        toast.error("Failed to send OTP. Try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initialize reCAPTCHA. Try again.");
    }
  } else {
    toast.error("Please enter a valid 10-digit phone number.");
  }
};
        
        // Render the reCAPTCHA widget
  //       await window.recaptchaVerifier.render().then((widgetId) => {
  //         window.recaptchaWidgetId = widgetId;
  //       });
        
  //     } catch (error) {
  //       console.error(error);
  //       toast.error("Failed to initialize reCAPTCHA. Try again.");
  //     }
  //   } else {
  //     toast.error("Please enter a valid 10-digit phone number.");
  //   }
  // };

//         if (window.recaptchaVerifier) {
//           window.recaptchaVerifier.clear();
//           delete window.recaptchaVerifier;
//         }
//         if (!window.recaptchaVerifier) {
//           window.recaptchaVerifier = new RecaptchaVerifier(
//             auth, "recaptcha-container",
//             {
//               size: "normal",
//               callback: async (response) => {
//                 console.log("reCAPTCHA solved");
//               },
//               "expired-callback": () => { }
//             }
//           );
//         }
//         // for ensuring the widget is rendered
//         await window.recaptchaVerifier.render().then((widgetId) => {
//           window.recaptchaWidgetId = widgetId;
//         });

//         const appVerifier = window.recaptchaVerifier;

//         try {
//           const confirmation = await signInWithPhoneNumber(
//             auth,
//             "+91" + phone,
//             appVerifier
//           );
//           // console.log(confirmation);
//           // console.log(confirmation.verificationId);

//           if (confirmation && confirmation.verificationId) {
//             window.confirmationResult = confirmation;
//             toast.success("OTP sent successfully!");
//             setCurrentUser(true);
//             navigate('/verification');
//           } else {
//             toast.error("Failed to initiate OTP process.");
//           }
//         } catch (error) {
//           console.error("OTP send error:", error);
//           toast.error("Failed to send OTP. Try again.");
//         }
//       }

//       catch (error) {
//         console.error(error);
//         toast.error("Failed to send OTP. Try again.");
//       }
//     } else {
//       toast.error("Please enter a valid 10-digit phone number.");
//     }
//   };
  
  

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (isValid) {
  //     // Perform login logic here
  //     console.log('Login successful');
  //     console.log(phone);
  //   } else {
  //     console.log('Invalid phone number');
  //   }
  // };

  return (
    <>
    <div className='relative mt-5'>
      <div className='text-center absolute top-2 bg-white z-10 px-2 login-text'>
        <h1 className='text-center'>Login in or sign up</h1>
        
      </div>
      <hr className='mt-5 relative top-6' />
     
    </div>
      <form className='mt-12 text-center' action="" onSubmit={sendOtp}>
        <div className="flex items-center justify-center mb-3">
        <div className="border border-r-0 mb-3 border-gray-400 py-2.5 px-3 rounded-l-md bg-gray-100">+91</div>
        <input className='border border-l-0 border-gray-400 w-[195px] py-2.5 px-1.5 rounded-r-md mb-3 focus:outline-none focus:border-gray-400' pattern="[0-9]{10}" type="tel" placeholder='Enter Phone Number' value={phone} onChange={handleChange} />
        </div>
        {!isValid && phone.length > 3 && (
  <p className="text-red-500 text-sm mt-1">
    Please enter a valid Indian phone number
  </p>
)}
        <button type='submit' className='w-[250px] py-2.5 px-1.5 rounded-md text-white bg-red-400 transition-all duration-300 ease-in-out hover:bg-red-800'>Continue</button>
        <div id="recaptcha-container" className="mb-3 flex justify-center mt-3"></div>

      </form>
      </>
  )
}

export default LoginForm;
