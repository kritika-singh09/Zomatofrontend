import React from "react";
import { useAppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useLocation } from "react-router-dom";

const Banner = ({ food }) => {
  if (!food) return null;

  return (
    <div>
      <img
        className="rounded-xl max-h-[300px] w-full"
        src={food.image}
        alt={food.name}
      />
    </div>
  );
};

export default Banner;
