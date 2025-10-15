import { fetchWithCache } from "../utils/apiCache"; // Import your cache util

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/item/get`;
const CACHE_KEY = "foodItemsCache";
const CACHE_EXPIRY_MINUTES = 24 * 60; // 24 hours in minutes

export const fetchFoodItems = async () => {
  try {
    // fetchWithCache will fetch from API if cache is not available or expired
    const data = await fetchWithCache(API_URL, CACHE_KEY, CACHE_EXPIRY_MINUTES);

    console.log('Raw API response:', data);
    
    // Check if data is array or object with itemsdata property
    const items = Array.isArray(data) ? data : (data.itemsdata || data.items || data.data || []);
    
    console.log('Extracted items:', items);
    
    if (!items || items.length === 0) {
      console.warn('No items found in API response');
      return [];
    }
    
    // Map the API response to match the format expected by FoodCard
    const formattedData = items.map((item) => ({
      _id: item._id,
      id: item._id, // Use _id as id
      name: item.name,
      categoryId: item.category?._id || item.category,
      restaurant: item.category
        ? `Category ${item.category}`
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
      quantity: item.quantity || 1,
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

    console.log('Formatted data:', formattedData);
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
    
    if (!userData?.phone) {
      return { success: false, error: "User data not found" };
    }

    // Return mock user profile for now
    const mockProfile = {
      phone: userData.phone,
      name: "User",
      email: ""
    };
    
    return { success: true, user: mockProfile };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: error.message };
  }
};
