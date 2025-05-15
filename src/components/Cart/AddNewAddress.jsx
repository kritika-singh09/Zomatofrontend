// AddNewAddress.jsx
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaHome,
  FaBriefcase,
  FaLocationArrow,
} from "react-icons/fa";

const AddNewAddress = ({
  showPanel,
  togglePanel,
  onAddAddress,
  addressToEdit,
}) => {
  // Initialize form data with empty values or values from addressToEdit if provided
  const [formData, setFormData] = useState({
    type: "Home",
    address: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  // Update form data when addressToEdit changes
  useEffect(() => {
    if (addressToEdit) {
      setFormData(addressToEdit);
    } else {
      // Reset form when adding a new address
      setFormData({
        type: "Home",
        address: "",
        city: "",
        state: "",
        pincode: "",
        isDefault: false,
      });
    }
  }, [addressToEdit, showPanel]);

  // Prevent body scrolling when panel is open
  useEffect(() => {
    if (showPanel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPanel]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If editing, keep the original ID; otherwise generate a new one
    const addressData = addressToEdit
      ? { ...formData }
      : { ...formData, id: Date.now() };

    onAddAddress(addressData);
    togglePanel();
  };

  return (
    <>
      {/* Semi-transparent overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          showPanel ? "opacity-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={togglePanel}
      ></div>

      {/* Sliding panel for new address form */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 transform ${
          showPanel ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white rounded-t-2xl p-5 shadow-lg">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {addressToEdit ? "Edit Address" : "Add New Address"}
            </h2>
            <button
              className="text-gray-500 p-1 hover:bg-gray-100 rounded-full"
              onClick={togglePanel}
            >
              <FaTimes />
            </button>
          </div>

          {/* Address form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Address type selection */}
            <div>
              <label className="block text-gray-700 mb-2">Address Type</label>
              <div className="flex space-x-4">
                <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    formData.type === "Home"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="Home"
                    checked={formData.type === "Home"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <FaHome className="text-green-600 mr-2" />
                  <span>Home</span>
                </label>

                <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    formData.type === "Work"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="Work"
                    checked={formData.type === "Work"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <FaBriefcase className="text-blue-600 mr-2" />
                  <span>Work</span>
                </label>

                {/* <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    formData.type === "Other"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="Other"
                    checked={formData.type === "Other"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <FaLocationArrow className="text-purple-600 mr-2" />
                  <span>Other</span>
                </label> */}
              </div>
            </div>

            {/* Address field */}
            <div>
              <label htmlFor="address" className="block text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House/Flat No., Building, Street"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                id="address"
                onChange={handleChange}
                placeholder="House/Flat No., Building, Street"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* City field */}
            <div>
              <label htmlFor="city" className="block text-black mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Gorakhpur"
                className="w-full p-3 border border-gray-300 cursor-not-allowed rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-black mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Uttar Pradesh"
                className="w-full p-3 border border-gray-300 cursor-not-allowed rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled
              />
            </div>

            {/* Pincode field */}
            <div>
              <label htmlFor="pincode" className="block text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit Pincode"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                pattern="[0-9]{6}"
                maxLength="6"
                required
              />
            </div>

            {/* Default address checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="isDefault" className="ml-2 block text-gray-700">
                Make this my default address
              </label>
            </div>

            {/* Save button */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-lg font-bold mt-4 hover:bg-green-800"
            >
              {addressToEdit ? "Update Address" : "Save Address"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewAddress;
