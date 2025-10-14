import { fetchWithCache } from "../utils/apiCache"; // Import your cache util

const API_URL = "http://localhost:4000/api/user/items";
const CACHE_KEY = "foodItemsCache";
const CACHE_EXPIRY_MINUTES = 24 * 60; // 24 hours in minutes

export const fetchFoodItems = async () => {
  try {
    // fetchWithCache will fetch from API if cache is not available or expired
    const data = await fetchWithCache(API_URL, CACHE_KEY, CACHE_EXPIRY_MINUTES);

    // Map the API response to match the format expected by FoodCard
    const formattedData = data.itemsdata.map((item) => ({
      _id: item._id,
      id: item.id,
      name: item.name,
      categoryId: item.categoryId,
      restaurant: item.categoryId
        ? `Category ${item.categoryId}`
        : "Restaurant",
      price: parseFloat(item.price), // Store as number for sorting/filtering
      priceFormatted: `₹${item.price}`, // Store formatted price for display
      rating: item.rating || 4.5,
      image: item.image,
      veg: item.veg,
      tag: item.veg ? "Veg" : "Non-Veg",
      tagIcon: item.veg ? "FaLeaf" : "GiChickenLeg",
      tagIconColor: item.veg ? "text-green-500" : "text-red-500",
      tagBg: item.veg ? "bg-green-100" : "bg-red-100",
      description: item.description,
      longDescription: item.longDescription,
      quantity: item.quantity,
      variation: item.variation || [],
      addon: item.addon || [],
    }));

    // Store in cache with timestamp
    // localStorage.setItem(
    //   CACHE_KEY,
    //   JSON.stringify({
    //     data: formattedData,
    //     timestamp: new Date().getTime(),
    //   })
    // );

    return formattedData;
  } catch (error) {
    console.error("Error fetching food items:", error);
    return [];
  }
};

export const fetchUserProfile = async (forceRefresh = false) => {
  try {
    // Try to get cached profile
    if (!forceRefresh) {
      const cachedProfile = localStorage.getItem("userProfile");
      if (cachedProfile) {
        return { success: true, user: JSON.parse(cachedProfile) };
      }
    }

    // Get the user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    const firebaseUid = userData?.uid || userData?.firebaseUid;

    if (!firebaseUid) {
      console.warn("Firebase UID not found in user data");
      return { success: false, error: "User ID not found" };
    }

    // Use GET with query param
    const res = await fetch(
      "http://localhost:4000/api/user/data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebaseUid }),
      }
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: error.message };
  }
};
