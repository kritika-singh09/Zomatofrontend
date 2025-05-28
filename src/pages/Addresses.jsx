import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { IoMdAdd } from "react-icons/io";
import { FaHome, FaBriefcase, FaEdit, FaTrash } from "react-icons/fa";
import AddNewAddressModal from "../components/AddNewAddressModal";

const SavedAddresses = () => {
  const {
    user,
    fetchAddresses,
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    handleAddAddress,
    handleDeleteAddress,
    addressesLoading,
  } = useAppContext();

  const [showAddForm, setShowAddForm] = useState(false);
  const [activeType, setActiveType] = useState("home");
  const [error, setError] = useState(null);
  const [addressToEdit, setAddressToEdit] = useState(null);

  useEffect(() => {
    fetchAddresses(); // Always fetch addresses when this page mounts
  }, []);

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    localStorage.setItem("selectedAddressId", addressId);
  };

  const handleFormSubmit = async (addressData) => {
    try {
      const success = await handleAddAddress(addressData);
      if (success) {
        console.log("Address added successfully");
        setShowAddForm(false);
        setAddressToEdit(null);
      }
    } catch (err) {
      console.error("Error adding address:", err);
    }
  };

  const handleEditAddress = (id) => {
    const address = addresses.find((addr) => addr._id === id);
    if (address) {
      setAddressToEdit(address);
      setShowAddForm(true);
    }
  };

  // Filter addresses based on active type
  const filteredAddresses = addresses.filter((address) => {
    return address.type?.toLowerCase() === activeType.toLowerCase();
  });

  return (
    <>
      <div
        className="max-w-xl h-screen overflow-auto mx-auto p-4 bg-bgColor"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Saved Addresses</h1>
          <button
            onClick={() => {
              setAddressToEdit(null);
              setShowAddForm(true);
            }}
            className="flex items-center bg-red-800 text-white px-3 py-2 rounded-md"
          >
            <IoMdAdd className="mr-1" /> Add New
          </button>
        </div>

        {/* Loading state */}
        {addressesLoading && (
          <div className="text-center py-8">
            <div className="animate-pulse">Loading addresses...</div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Address Categories */}
        {!addressesLoading && (
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                className={`flex-1 py-2 ${
                  activeType === "home"
                    ? "bg-red-800 text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                } rounded-md flex items-center justify-center`}
                onClick={() => setActiveType("home")}
              >
                <FaHome className="mr-2" /> Home
              </button>
              <button
                className={`flex-1 py-2 ${
                  activeType === "work"
                    ? "bg-red-800 text-white"
                    : "bg-white border border-gray-300 text-gray-700"
                } rounded-md flex items-center justify-center`}
                onClick={() => setActiveType("work")}
              >
                <FaBriefcase className="mr-2" /> Work
              </button>
            </div>
          </div>
        )}

        {/* Address List */}
        {!addressesLoading && !error && (
          <>
            {filteredAddresses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No {activeType} addresses saved yet
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAddresses.map((address, index) => (
                  <div
                    key={address._id || index}
                    className={`rounded-lg p-4 bg-white shadow-lg/15 cursor-pointer border-2 ${
                      selectedAddressId === address._id
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                    onClick={() => handleSelectAddress(address._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {address.type?.toLowerCase() === "home" ? (
                          <FaHome className="text-red-800 mr-2" />
                        ) : (
                          <FaBriefcase className="text-blue-800 mr-2" />
                        )}
                        <span className="font-medium capitalize">
                          {address.type}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(address._id);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 p-1"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent address selection when clicking delete
                            handleDeleteAddress(address._id);
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-gray-700">
                      <p>
                        {address.house_no}, {address.street}
                      </p>
                      <p>
                        {address.city}, {address.state} -{" "}
                        {address.postalCode || address.pincode}
                      </p>
                      {address.landmark && <p>Landmark: {address.landmark}</p>}

                      {/* Selected address indicator */}
                      {selectedAddressId === address._id && (
                        <div className="mt-2 text-green-600 font-medium flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Delivery Address
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Address Modal */}
      <AddNewAddressModal
        showModal={showAddForm}
        closeModal={() => setShowAddForm(false)}
        onSubmit={handleFormSubmit}
        initialAddress={addressToEdit}
      />
    </>
  );
};

export default SavedAddresses;
