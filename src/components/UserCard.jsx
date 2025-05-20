import React from "react";
import profileImage from "../assets/blank-profile.png";
import { useAppContext } from "../context/AppContext";

const UserCard = () => {
  return (
    <div className="flex items-center px-3 py-5 bg-white shadow-md rounded-lg mx-2">
      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
        <img src={profileImage} alt="User" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold">User Name</h1>
        <p className="text-sm">user@example.com</p>
      </div>
    </div>
  );
};

export default UserCard;
