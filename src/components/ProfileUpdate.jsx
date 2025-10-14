import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

// Helper function to generate avatar color (can be moved to a utils file)
const getColorForLetter = (letter) => {
  const colors = [
    "bg-blue-200 text-blue-700",
    "bg-green-200 text-green-700",
    "bg-purple-200 text-purple-700",
    "bg-red-200 text-red-700",
    "bg-yellow-200 text-yellow-700",
    "bg-pink-200 text-pink-700",
    "bg-indigo-200 text-indigo-700",
  ];

  // Use character code to select a color
  const index = letter.charCodeAt(0) % colors.length;
  return colors[index];
};

const ProfileUpdate = () => {
  const { user, updateUserProfile, refreshUserProfile } = useAppContext();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dob: user?.dob || "",
    anniversary: user?.anniversary || "",
    gender: user?.gender || "male",
  });

  // Get first letter of name for avatar
  const firstLetter = formData.name
    ? formData.name.charAt(0).toUpperCase()
    : "U";
  const avatarClass = getColorForLetter(firstLetter);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // In ProfileUpdate.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if we have the user data with firebaseUid
    if (!user || !user.firebaseUid) {
      alert("User data is missing. Please log in again.");
      return;
    }

    // Include the firebaseUid from the user object
    const updatedData = {
      ...formData,
      firebaseUid: user.firebaseUid, // Use the correct property name
      phone: user.phone || "",
    };

    console.log("Sending data:", updatedData); // For debugging

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Update local user data
        const updatedUser = { ...user, ...formData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("userProfile", JSON.stringify(updatedUser));
        refreshUserProfile(true);
        alert("Profile updated successfully");
      } else {
        alert(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="max-w-xl h-screen mx-auto p-4 bg-bgColor">
      {/* Profile Image */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center ${avatarClass}`}
          >
            <span className="text-4xl font-bold">{firstLetter}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
          />
        </div>

        {/* Anniversary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anniversary
          </label>
          <input
            type="date"
            name="anniversary"
            value={formData.anniversary}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-800"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
                className="mr-2 accent-red-800"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
                className="mr-2 accent-red-800"
              />
              Female
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleChange}
                className="mr-2 accent-red-800"
              />
              Other
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
