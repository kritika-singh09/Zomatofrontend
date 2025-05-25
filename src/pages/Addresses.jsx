import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { IoMdAdd } from "react-icons/io";
import { FaHome, FaBriefcase, FaEdit, FaTrash } from "react-icons/fa";

const SavedAddresses = () => {
  const { user } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeType, setActiveType] = useState("home");
  const [addresses, setAddresses] = useState([
    {
      type: "home",
      street: "123 Main Street, Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      landmark: "Near City Hospital",
    },
    {
      type: "work",
      street: "456 Business Park, Building C",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400051",
      landmark: "Opposite Central Mall",
    },
    {
      type: "home",
      street: "789 Lake View Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      landmark: "Behind Green Park",
    },
    {
      type: "work",
      street: "789 Lake View Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      landmark: "Behind Green Park",
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    type: "home",
    house_no: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  // useEffect(() => {
  //   // Only update addresses from user data if they exist
  //   if (user && user.addresses && user.addresses.length > 0) {
  //     setAddresses(user.addresses);
  //     setUseDummyData(false);
  //   } else {
  //     // Make sure we keep the dummy addresses
  //     setUseDummyData(true);
  //   }
  // }, [user]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      // Add validation here
      if (
        !newAddress.house_no ||
        !newAddress.street ||
        !newAddress.city ||
        !newAddress.state ||
        !newAddress.pincode
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Check if user is available
      if (!user || (!user.firebaseUid && !user.uid)) {
        alert("User information is missing. Please log in again.");
        return;
      }
      // Get Firebase UID from user object
      const firebaseUid = user.firebaseUid || user.uid;

      // Generate a unique address ID
      const address_id = `addr${Date.now().toString().slice(-6)}`;

      // Format the address data according to the API requirements
      const addressData = {
        firebaseUid: firebaseUid, // Replace with actual user ID when available
        address: {
          address_id: address_id,
          type:
            newAddress.type.charAt(0).toUpperCase() + newAddress.type.slice(1), // Capitalize first letter
          house_no: newAddress.house_no, // Using landmark as house_no for now
          street: newAddress.street,
          city: newAddress.city,
          state: newAddress.state,
          postalCode: newAddress.pincode,
          landmark: newAddress.landmark || "",
        },
      };
      console.log(addressData);

      // Send to backend
      const response = await fetch(
        "https://hotelbuddhaavenue.vercel.app/api/auth/updateaddress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressData),
        }
      );

      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        // Add the new address to local state with the format we use for display
        const displayAddress = {
          type: newAddress.type,
          house_no: newAddress.house_no,
          street: newAddress.street,
          city: newAddress.city,
          state: newAddress.state,
          pincode: newAddress.pincode,
          landmark: newAddress.landmark,
          address_id: address_id, // Store the ID for future reference
        };

        setAddresses([...addresses, displayAddress]);

        // Reset form
        setNewAddress({
          type: "home",
          house_no: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
          landmark: "",
        });

        setShowAddForm(false);
        alert("Address added successfully");
      } else {
        alert(result.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Network error. Please try again.");
    }
  };

  const handleDeleteAddress = async (index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        // Check if user is available
        if (!user || (!user.firebaseUid && !user.uid)) {
          alert("User information is missing. Please log in again.");
          return;
        }

        // Get Firebase UID from user object
        const firebaseUid = user.firebaseUid || user.uid;

        const response = await fetch(
          "https://hotelbuddhaavenue.vercel.app/api/user/address/delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firebaseUid: firebaseUid,
              addressIndex: index,
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          // Update local state
          const updatedAddresses = addresses.filter((_, i) => i !== index);
          setAddresses(updatedAddresses);
          alert("Address deleted successfully");
        } else {
          alert(result.message || "Failed to delete address");
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Network error. Please try again.");
      }
    }
  };

  // Filter addresses based on active type
  const filteredAddresses = addresses.filter(
    (address) => address.type === activeType
  );

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Saved Addresses</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center bg-red-800 text-white px-3 py-2 rounded-md"
        >
          <IoMdAdd className="mr-1" /> Add New
        </button>
      </div>

      {/* Address Categories */}
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            className={`flex-1 py-2 ${
              activeType === "home"
                ? "bg-red-800 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-md flex items-center justify-center`}
            onClick={() => setActiveType("home")}
          >
            <FaHome className="mr-2" /> Home
          </button>
          <button
            className={`flex-1 py-2 ${
              activeType === "work"
                ? "bg-red-800 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-md flex items-center justify-center`}
            onClick={() => setActiveType("work")}
          >
            <FaBriefcase className="mr-2" /> Work
          </button>
        </div>
      </div>

      {/* Address List */}
      {filteredAddresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No {activeType} addresses saved yet
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAddresses.map((address, index) => (
            <div key={index} className="rounded-lg p-4 bg-white shadow-lg/15">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {address.type === "home" ? (
                    <FaHome className="text-red-800 mr-2" />
                  ) : (
                    <FaBriefcase className="text-blue-800 mr-2" />
                  )}
                  <span className="font-medium capitalize">{address.type}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 p-1">
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 p-1"
                    onClick={() =>
                      handleDeleteAddress(
                        addresses.findIndex((a) => a === address)
                      )
                    }
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
                  {address.city}, {address.state} - {address.pincode}
                </p>
                {address.landmark && <p>Landmark: {address.landmark}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Address Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Add New Address</h2>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="home"
                      checked={newAddress.type === "home"}
                      onChange={handleAddressChange}
                      className="mr-2 accent-red-800"
                    />
                    Home
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="work"
                      checked={newAddress.type === "work"}
                      onChange={handleAddressChange}
                      className="mr-2 accent-red-800"
                    />
                    Work
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House/Flat Number*
                </label>
                <input
                  type="text"
                  name="house_no"
                  value={newAddress.house_no}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address*
                </label>
                <input
                  type="text"
                  name="street"
                  value={newAddress.street}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City*
                </label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode*
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={newAddress.pincode}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={newAddress.landmark}
                  onChange={handleAddressChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
                />
              </div>

              <div className="flex space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-800 text-white rounded-md"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedAddresses;
