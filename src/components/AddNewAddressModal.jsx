import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import LoadingOverlay from "./LoadingOverlay";

const AddNewAddressModal = ({
  showModal,
  closeModal,
  onSubmit,
  initialAddress = null,
  isLoading = false,
}) => {
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

  const [isClosing, setIsClosing] = useState(false);
  const [address, setAddress] = useState(initialAddress || getDefaultAddress());

  // Reset form when modal opens or initialAddress changes
  useEffect(() => {
    if (showModal) {
      if (initialAddress) {
        // Format the address data to match the form fields
        setAddress({
          type: initialAddress.type?.toLowerCase() || "home",
          house_no: initialAddress.house_no || "",
          street: initialAddress.street || "",
          city: initialAddress.city || "",
          state: initialAddress.state || "",
          pincode: initialAddress.pincode || initialAddress.postalCode || "",
          landmark: initialAddress.landmark || "",
          lat: initialAddress.lat || 26.7606,
          lng: initialAddress.lng || 83.3732,
          _id: initialAddress._id, // Keep the ID for editing
        });
      } else {
        setAddress(getDefaultAddress());
      }
    }
  }, [showModal, initialAddress]);

  // Map initialization
  useEffect(() => {
    let isMounted = true;

    if (showModal) {
      // Clear any existing map instance first
      if (window._mappls_modal_map) {
        window._mappls_modal_map = null;
      }

      setTimeout(() => {
        if (!isMounted) return;

        const mapContainer = document.getElementById("map");
        if (!window.mappls || !mapContainer) return;

        // Initialize map
        const mapInstance = new window.mappls.Map("map", {
          center: [
            address.lat || initialAddress?.lat || 26.7606,
            address.lng || initialAddress?.lng || 83.3732,
          ],
          zoomControl: true,
          location: true,
        });

        window._mappls_modal_map = mapInstance;

        // Add draggable marker
        var marker = new window.mappls.Marker({
          map: mapInstance,
          position: {
            lat: address.lat || initialAddress?.lat || 26.7606,
            lng: address.lng || initialAddress?.lng || 83.3732,
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
        mapInstance.addListener("click", function (e) {
          let lat, lng;
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
            return;
          }
          marker.setPosition({ lat, lng });
          showLatLng(lat, lng);
        });

        // Show initial position
        showLatLng(address.lat || 26.7606, address.lng || 83.3732);
      }, 100);
    }

    return () => {
      isMounted = false;
      window._mappls_modal_map = null;
      const divId = document.getElementById("show-result");
      if (divId) divId.style.display = "none";
    };
  }, [showModal]);

  const fetchAddressFromLatLng = async (lat, lng) => {
    try {
      // If we're editing an address and this is the initial map load, don't overwrite the data
      if (
        initialAddress &&
        lat === (initialAddress.lat || 26.7606) &&
        lng === (initialAddress.lng || 83.3732)
      ) {
        return; // Skip geocoding on initial load for edit mode
      }
      const response = await fetch(
        `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}&api_key=68356bb1a3afb750007085wdx475b3a`
      );
      const data = await response.json();

      if (data && data.address) {
        setAddress((prev) => ({
          ...prev,
          lat,
          lng,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window._mappls_modal_map = null;
    // If editing (has _id), preserve it in the submitted data
    const addressData = address._id
      ? { ...address }
      : { ...address, id: Date.now() };

    onSubmit(address);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
      setIsClosing(false);
    }, 300);
  };

  if (!showModal) return null;

  return (
    <div
      className={`address-modal-overlay ${isClosing ? "closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`address-modal-content ${isClosing ? "closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Add loading overlay inside the modal */}
        {isLoading && <LoadingOverlay />}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {initialAddress ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={handleClose}
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
        ></div>

        {/* <div
          id="show-result"
          style={{
            display: "none",
            margin: "8px 0",
            color: "#d32f2f",
            fontWeight: "bold",
          }}
        ></div> */}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  checked={address.type === "home"}
                  onChange={handleChange}
                  className="mr-2 accent-red-800"
                />
                Home
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="work"
                  checked={address.type === "work"}
                  onChange={handleChange}
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
              value={address.house_no}
              onChange={handleChange}
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
              value={address.street}
              onChange={handleChange}
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
              value={address.city}
              onChange={handleChange}
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
              value={address.state}
              onChange={handleChange}
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
              value={address.pincode}
              onChange={handleChange}
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
              value={address.landmark}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
            />
          </div>

          <div className="flex space-x-4 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-red-800 text-white rounded-md"
            >
              {initialAddress ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAddressModal;
