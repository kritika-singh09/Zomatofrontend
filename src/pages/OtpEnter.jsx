import React from 'react'
import Navbar from '../components/Navbar';
import Otp from '../components/Otp';
import Send from '../components/Send';
import CodeNumber from '../components/CodeNumber';

const OtpEnter = () => {
  return (
    <div className="otpForm">
      <Navbar />
      <CodeNumber />
      <Otp />
      <Send/>
    </div>
  )
}

export default OtpEnter;
