import React from "react";
import { VscDiffModified } from "react-icons/vsc";

const AddOns = () => {
  return (
    <div className="bg-white rounded-xl px-2.5 py-3.5 mx-3 my-4">
      <div>
        <h1 className="text-base font-medium ">Toppings</h1>
        <p className="text-sm text-gray-600 border-b-1 border-gray-300 pb-4">
          Select up to 10 options
        </p>
      </div>
      <div>
        <div className="flex justify-between  my-6 text-md">
          <div className="flex items-center gap-2">
            <VscDiffModified className="text-green-600" />
            <span>Paneer</span>
          </div>
          <div className="flex gap-2">
            <label htmlFor="">₹40</label>
            <input type="checkbox" name="" id="" />
          </div>
        </div>
        <div className="flex justify-between  my-6 text-md">
          <div className="flex items-center gap-2">
            <VscDiffModified className="text-green-600" />
            <span>Paneer</span>
          </div>
          <div className="flex gap-2">
            <label htmlFor="">₹40</label>
            <input type="checkbox" name="" id="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOns;
