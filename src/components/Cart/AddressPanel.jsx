// AddressPanel.jsx
import React, { useState, useEffect } from "react";
import { FaTimes, FaMapMarkerAlt, FaEdit, FaPlus } from "react-icons/fa";
import AddNewAddress from "./AddNewAddress";

const AddressPanel = ({ showPanel, togglePanel, onSelectAddress }) => {
  // Sample addresses - in a real app, these would come from an API or context
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      address: "humayunpur near tarang crossing",
      city: "Gorakhpur",
      state: "Uttar Pradesh",
      pincode: "273019",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      address: "456 Office Park, Building C",
      city: "Mumbai",
      state: "Uttar Pradesh",
      pincode: "273015",
      isDefault: false,
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find((addr) => addr.isDefault) || addresses[0]
  );

  //for adding new address
  const [showAddNewAddress, setShowAddNewAddress] = useState(false);

  // Track the address being edited (null means we're adding a new address)
  const [addressToEdit, setAddressToEdit] = useState(null);

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

  // Handle address selection and close panel
  const handleSelectAddress = () => {
    onSelectAddress(selectedAddress);
    togglePanel();
  };

  // Handle adding or updating an address
  const handleAddAddress = (newAddress) => {
    // If we're editing an existing address
    if (addressToEdit) {
      // Update the address in the list
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === addressToEdit.id ? newAddress : addr))
      );
    } else {
      // If the new address is set as default, update all other addresses
      if (newAddress.isDefault) {
        setAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: false,
          }))
        );
      }

      // Add the new address to the list
      setAddresses((prev) => [...prev, newAddress]);
    }

    // Select the new/updated address
    setSelectedAddress(newAddress);

    // Close the add address panel and reset the edit state
    setShowAddNewAddress(false);
    setAddressToEdit(null);
  };

  // Handle edit address
  const handleEditAddress = (id) => {
    // Find the address to edit
    const addrToEdit = addresses.find((addr) => addr.id === id);

    // If the address to edit is found, set it and open the edit panel
    if (addrToEdit) {
      setAddressToEdit(addrToEdit);
      setShowAddNewAddress(true);
    }
  };

  // Handle opening the add new address panel
  const handleAddNewAddressClick = () => {
    setAddressToEdit(null); // Reset any previous edit state
    setShowAddNewAddress(true);
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

      {/* Sliding panel for addresses */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 transform ${
          showPanel ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white rounded-t-2xl p-5 shadow-lg">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Delivery Address</h2>
            <button
              className="text-gray-500 p-1 hover:bg-gray-100 rounded-full"
              onClick={togglePanel}
            >
              <FaTimes />
            </button>
          </div>

          {/* Address list */}
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-lg p-3 cursor-pointer ${
                  selectedAddress?.id === address.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedAddress(address)}
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-green-600 mr-2" />
                    <span className="font-medium">{address.type}</span>
                  </div>
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(address.id);
                    }}
                  >
                    <FaEdit />
                  </button>
                </div>
                <div className="mt-1 text-gray-600">
                  {address.address}, {address.city}, {address.pincode}
                </div>
                {address.isDefault && (
                  <div className="mt-1 text-xs text-green-600 font-medium">
                    Default Address
                  </div>
                )}
              </div>
            ))}

            {/* Add new address button */}
            <button
              className="w-full border border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center text-blue-500 hover:bg-blue-50"
              onClick={handleAddNewAddressClick}
            >
              <FaPlus className="mr-2" /> Add New Address
            </button>
          </div>

          {/* Proceed button */}
          <button
            className="w-full bg-green-700 text-white py-3 rounded-lg font-bold mt-4 hover:bg-green-800"
            onClick={handleSelectAddress}
          >
            Deliver to this Address
          </button>
        </div>
      </div>

      {/* Add/Edit Address Panel */}
      <AddNewAddress
        showPanel={showAddNewAddress}
        togglePanel={() => setShowAddNewAddress(!showAddNewAddress)}
        onAddAddress={handleAddAddress}
        addressToEdit={addressToEdit}
      />
    </>
  );
};

export default AddressPanel;
