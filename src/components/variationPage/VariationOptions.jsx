import React from "react";

const VariationOptions = () => {
  return (
    <div className="bg-white rounded-xl px-2.5 py-3.5 mx-3 my-4">
      <h1 className="text-base font-medium ">Size</h1>
      <p className="text-sm text-gray-600 border-b-1 border-gray-300 pb-4">
        Required <span>• </span>Select any 1 Option
      </p>

      <div className="mt-5">
        <div className="flex justify-between my-6 text-md font-semibold">
          <span>Regular (Serves 1, 17.7 CM)</span>
          <div className="flex gap-2">
            <label htmlFor="variation-option">₹286</label>
            <input type="radio" name="variation-option" />
          </div>
        </div>
        <div className="flex justify-between my-6 text-md">
          <span>Medium (Serves 2, 24.5 CM)</span>
          <div className="flex gap-2">
            <label htmlFor="variation-option">₹666</label>
            <input type="radio" name="variation-option" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariationOptions;
