import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { RiArrowDropDownLine } from "react-icons/ri";
import { LuReceiptIndianRupee } from "react-icons/lu";
import { FaUser, FaSearch } from "react-icons/fa";
import { TiMicrophone } from "react-icons/ti";
import FoodSlider from "./FoodSlider";
import FilterSlider from "./FilterSlider";
import FoodCard from "./FoodCard";
import { FiLogOut } from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";

const Header = () => {
  const [AddressLine1, setAddressLine1] = useState(["Azad Colony "]);
  const [AddressLine2, setAddressLine2] = useState(["Abc Colony "]);
  const [toggle, setToggle] = useState(false);
  const { logout, user, navigate } = useAppContext();
  const [showMenu, setShowMenu] = useState(false);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <>
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
          <div className="relative group mx-4">
            <FaUser onClick={handleProfileClick} className="cursor-pointer" />
            <div
              className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg transition-all duration-300 z-50 ${
                showMenu ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              {user && (
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <p className="font-medium">{user.name || "User"}</p>
                  <p className="text-xs">{user.phone}</p>
                </div>
              )}
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          </div>
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
      </div>
    </>
  );
};

export default Header;
