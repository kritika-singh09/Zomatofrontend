import React from "react";
import UserCard from "../components/UserCard";
import ProfileCards from "../components/ProfileCards";

const Profile = () => {
  return (
    <div className="bg-gray-200 w-full h-screen">
      <UserCard />
      <ProfileCards />
    </div>
  );
};

export default Profile;
