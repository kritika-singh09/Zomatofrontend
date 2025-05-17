// src/services/api.js
const API_URL = "https://hotelbuddhaavenue.vercel.app/api/user/items";
const CACHE_KEY = "foodItemsCache";
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

export const fetchFoodItems = async () => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();

      // If cache is still valid, return the cached data
      if (now - timestamp < CACHE_EXPIRY) {
        return data;
      }
    }

    // If no cache or expired, fetch from API
    const response = await fetch(`${API_URL}`);
    const data = await response.json();

    // Map the API response to match the format expected by FoodCard
    const formattedData = data.itemsdata.map((item) => ({
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
    }));

    // Store in cache with timestamp
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: formattedData,
        timestamp: new Date().getTime(),
      })
    );

    return formattedData;
  } catch (error) {
    console.error("Error fetching food items:", error);
    return [];
  }
};
