import React, { useEffect } from "react";
import UserCard from "../components/UserCard";
import ProfileCards from "../components/ProfileCards";
import { useAppContext } from "../context/AppContext";

const Profile = () => {
  const { refreshUserProfile } = useAppContext();

  useEffect(() => {
    console.log("Profile page loaded");
    refreshUserProfile();
  }, []);

  return (
    <div className="bg-gray-200 w-xl mx-auto h-screen">
      <UserCard />
      <ProfileCards />
    </div>
  );
};

export default Profile;
