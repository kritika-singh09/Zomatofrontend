import React from 'react'
import { assets } from '../assets/assets';

const Banner = () => {
  return (
    <div>
    <img className="bannerImg" src={assets.main_banner_bg} alt="" />
      <h1 className='text-3xl text-center px-2 mt-2'>Gorakhpur's Best Restaurant</h1>
    </div>
  )
}

export default Banner;
