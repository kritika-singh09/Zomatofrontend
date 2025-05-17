import React from "react";
import { VscDiffModified } from "react-icons/vsc";
import { CiBookmark } from "react-icons/ci";
import { PiShareFatBold } from "react-icons/pi";
import Banner from "./Banner";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const food = location.state?.food;

  if (!food) return null;

  return (
    <div className=" bg-white rounded-xl p-2 m-3">
      <Banner />
      <div className="px-1 my-2">
        <div className="flex items-center">
          <div style={{ margin: "0.5rem 0.5rem 0.5rem 0" }}>
            <VscDiffModified className="text-green-600  " />
          </div>
          <div>
            <span>{food.tag || "Spicy"}</span>
          </div>
        </div>
        <div className="flex justify-between">
          <h1>{food.name}</h1>
          <div className="flex items-center">
            <div className="rounded-full border-1 p-1 border-gray-400 mx-2">
              <CiBookmark />
            </div>
            <div className="rounded-full border-1 p-1 border-gray-400 mx-2">
              <PiShareFatBold />
            </div>
          </div>
        </div>
        <p className="text-sm mt-4">
          {food.description || "No description available"}
        </p>
      </div>
    </div>
  );
};

export default Header;
