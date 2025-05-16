import React from "react";
import { assets } from "../assets/assets";
import bannerImg from "../assets/dinnerbell.jpg";

const Banner = () => {
  return (
    <div>
      <img className="bannerImg rounded-b-3xl" src={bannerImg} alt="" />
      <h1 className="text-3xl text-center px-2 mt-10 leading-8">
        <span className="font-bold"> Dinner Bell </span> <br />
        <span className="text-xl font-medium">
          {" "}
          Gorakhpur's First Food Delivery and Dining App
        </span>
      </h1>
    </div>
  );
};

export default Banner;
