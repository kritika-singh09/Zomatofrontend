import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import { LuReceiptIndianRupee } from "react-icons/lu";
import { FaUser, FaSearch } from "react-icons/fa";
// import { FaSearch } from "react-icons/fa";
// import { FaToggleOff } from "react-icons/fa6";
// import { FaToggleOn } from "react-icons/fa";
import { TiMicrophone } from "react-icons/ti";
import FoodSlider from "./FoodSlider";
import FilterSlider from "./FilterSlider";
import FoodCard from "./FoodCard";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const [AddressLine1, setAddressLine1] = useState(["Azad Colony "]);
  const [AddressLine2, setAddressLine2] = useState(["Abc Colony "]);
  const [toggle, setToggle] = useState(false);
  const { logout, user } = useAppContext();

  return (
    <>
      <div className="h-[300px] w-full bg-cover bg-center bg-[url('./assets/bg.jpeg')] bg-transparent absolute -z-40 opacity-50"></div>
      <div className="flex justify-between ">
        <div className=" flex items-center m-2 text-xl w-[200px]">
          <FaLocationDot className=" text-red-500" />
          <div className="px-2 font-bold">
            {AddressLine1.map((item, index) => {
              return <h1 key={index}>{item}</h1>;
            })}
          </div>
          <RiArrowDropDownLine className="text-lg " />
        </div>

        <div className="flex items-center text-2xl">
          <LuReceiptIndianRupee />
          <FaUser className="mx-4" />
        </div>
      </div>
      <div className="px-9">
        {AddressLine2.map((item, index) => {
          return <h1 key={index}>{item}</h1>;
        })}
      </div>
      <div className=" flex justify-between mt-2 ">
        <div className="flex relative rounded-lg justify-center items-center flex-grow ">
          <FaSearch className="text-2xl text-red-600 absolute left-8  bottom-2 " />
          <input
            type="text"
            className="shadow-md    rounded-lg p-2 pl-12 ml-6 mt-4 mr-6 flex-grow  "
            placeholder="Search..."
          />
          <TiMicrophone className="text-2xl text-red-600 absolute right-6  bottom-2 " />
        </div>
        {/* <div className="text-center px-6">
          <span>Veg </span>

          <button
            className={`text-3xl flex items-center ${
              toggle ? "text-green-500" : ""
            }`}
            onClick={() => setToggle(!toggle)}
          >
            {toggle ? <FaToggleOn /> : <FaToggleOff />}
          </button>
        </div> */}
      </div>
      {/* <FoodSlider /> */}
      {/* <FilterSlider /> */}
      {/* <FoodCard /> */}
      {/* <FoodRecommendations /> */}
    </>
  );
};

export default Header;
