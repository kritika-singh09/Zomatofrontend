import React, { useEffect } from "react";
import UserCard from "../components/UserCard";
import ProfileCards from "../components/ProfileCards";
import { useAppContext } from "../context/AppContext";

const Profile = () => {
  const { refreshUserProfile, user, loading } = useAppContext();

  useEffect(() => {
    refreshUserProfile();
  }, []);

  return (
    <div className="bg-gray-200 max-w-xl mx-auto h-screen">
      {loading ? (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-800"></div>
        </div>
      ) : (
        <>
          <UserCard />
          <ProfileCards />
        </>
      )}
    </div>
  );
};

export default Profile;
