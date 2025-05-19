import React from "react";
import { LuBadgeInfo } from "react-icons/lu";

const Message = () => {
  return (
    <div className="bg-white rounded-xl px-2.5 py-3.5 mx-3 mt-4 mb-24">
      <div className="flex justify-between">
        <h1 className="text-base font-medium pb-4">
          Add a cooking request(optional)
        </h1>
        <LuBadgeInfo />
      </div>
      <textarea
        className="bg-gray-200 w-full rounded-xl p-2"
        name=""
        rows={5}
        placeholder="e.g. Dont make it too spicy"
        id=""
      ></textarea>
    </div>
  );
};

export default Message;
