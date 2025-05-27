import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { IoMdAdd } from "react-icons/io";
import { FaHome, FaBriefcase, FaEdit, FaTrash } from "react-icons/fa";

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

  const getDefaultAddress = () => ({
    type: "home",
    house_no: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    lat: 26.7606,
    lng: 83.3732,
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [activeType, setActiveType] = useState("home");
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState(null);

  const [newAddress, setNewAddress] = useState(getDefaultAddress);

  // Fetch addresses from API
  const fetchAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=68356bb1a3afb750007085wdx475b3a`
      );
      const data = await response.json();
      console.log("Reverse geocoding response:", data);
      if (data && data.address) {
        setNewAddress((prev) => ({
          ...prev,
          house_no: data.address.house_number || "",
          street: [
            data.address.road,
            data.address.neighbourhood,
            data.address.suburb,
          ]
            .filter(Boolean)
            .join(", "),
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          state: data.address.state || "",
          pincode: data.address.postcode || "",
          landmark:
            data.address.attraction ||
            data.address.public_building ||
            data.address.museum ||
            "",
        }));
      }
    } catch (err) {
      console.error("Reverse geocoding failed", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (showAddForm) {
      setNewAddress(getDefaultAddress());
      setTimeout(() => {
        if (!isMounted) return;
        if (window.mappls && document.getElementById("map")) {
          // Remove any previous map instance
          if (window._mappls_modal_map && window._mappls_modal_map.remove) {
            window._mappls_modal_map.remove();
          }

          // Initialize map
          var map = new window.mappls.Map("map", {
            center: [26.7606, 83.3732],
            zoomControl: true,
            location: true,
          });
          window._mappls_modal_map = map;

          // Add draggable marker
          var marker = new window.mappls.Marker({
            map: map,
            position: {
              lat: 26.7606,
              lng: 83.3732,
            },
            fitbounds: true,
            popupHtml: "MapmyIndia",
            draggable: true,
          });
          // Helper to show lat/lng
          function showLatLng(lat, lng) {
            let divId = document.getElementById("show-result");
            if (divId) {
              divId.style.display = "block";
              divId.innerHTML = `Latitude: ${lat}, Longitude: ${lng}`;
            }
            fetchAddressFromLatLng(lat, lng);
          }

          // On marker drag end
          marker.addListener("dragend", function () {
            // Get the new position from the marker itself
            const pos = marker.getPosition();
            if (
              pos &&
              typeof pos.lat === "number" &&
              typeof pos.lng === "number"
            ) {
              showLatLng(pos.lat, pos.lng);
            }
          });

          // On map click, move marker and show lat/lng
          map.addListener("click", function (e) {
            let lat, lng;
            // Prefer e.lat/lng if available, else try e.lngLat
            if (typeof e.lat === "number" && typeof e.lng === "number") {
              lat = e.lat;
              lng = e.lng;
            } else if (
              Array.isArray(e.lngLat) &&
              e.lngLat.length === 2 &&
              typeof e.lngLat[0] === "number" &&
              typeof e.lngLat[1] === "number"
            ) {
              lng = e.lngLat[0];
              lat = e.lngLat[1];
            } else {
              // Invalid event, do nothing
              return;
            }
            marker.setPosition({ lat, lng });
            showLatLng(lat, lng);
          });

          // Show initial position
          showLatLng(26.7606, 83.3732);
        }
      }, 100);
    }
    return () => {
      isMounted = false;
      // Clean up map instance if needed
      if (window._mappls_modal_map && window._mappls_modal_map.remove) {
        window._mappls_modal_map.remove();
        window._mappls_modal_map = null;
      }
      // Hide result div when modal closes
      const divId = document.getElementById("show-result");
      if (divId) divId.style.display = "none";
    };
  }, [showAddForm]);

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    localStorage.setItem("selectedAddressId", addressId);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleAddAddress(newAddress);
      // Force close the modal regardless of the return value
      setShowAddForm(false);
      setNewAddress(getDefaultAddress());
    } catch (err) {
      console.error("Error adding address:", err);
    }
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowAddForm(false);
      setIsClosing(false);
    }, 300); // Match this to the animation duration
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter addresses based on active type
  const filteredAddresses = addresses.filter((address) => {
    // Convert both to lowercase for case-insensitive comparison
    return address.type?.toLowerCase() === activeType.toLowerCase();
  });

  return (
    <>
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Saved Addresses</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center bg-red-800 text-white px-3 py-2 rounded-md"
          >
            <IoMdAdd className="mr-1" /> Add New
          </button>
          <button
            onClick={() => fetchAddresses(true)}
            className="flex items-center bg-gray-200 text-gray-800 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-300"
            title="Refresh Addresses"
          >
            Refresh
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
                            e.stopPropagation(); // Prevent address selection when clicking edit
                            // Handle edit functionality
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

        {/* Add Address Form */}
        {showAddForm && (
          <div
            className={`address-modal-overlay ${isClosing ? "closing" : ""}`}
            onClick={closeModal} // Close when clicking outside
          >
            <div
              className={`address-modal-content ${isClosing ? "closing" : ""}`}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Add New Address</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div
                id="map"
                style={{
                  margin: 0,
                  padding: 0,
                  width: "100%",
                  height: "300px",
                }}
              ></div>{" "}
              <div
                id="show-result"
                style={{
                  display: "none",
                  margin: "8px 0",
                  color: "#d32f2f",
                  fontWeight: "bold",
                }}
              ></div>
              <form onSubmit={handleFormSubmit} className="space-y-4">
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
    </>
  );
};

export default SavedAddresses;
