import React, { useMemo, useState, useEffect } from "react";
import FoodCard from "./FoodCard";
import { fetchFoodItems } from "../../services/api";

const FoodItemGrid = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sort food items by rating in descending order and take only the top 6
  const topRatedFoodItems = [...foodItems]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  useEffect(() => {
    const loadFoodItems = async () => {
      try {
        setLoading(true);
        const items = await fetchFoodItems();
        setFoodItems(items);
        setError(null);
      } catch (err) {
        setError("Failed to load food items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFoodItems();
  }, []);

  return (
    <div className="mt-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Dishes For You</h2>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-pulse">Loading dishes...</div>
        </div>
      )}

      {/* Error state */}
      {error && <div className="text-red-500 text-center py-8">{error}</div>}

      {/* Flex layout with exactly 3 cards per row */}
      {!loading && !error && (
        <div className="flex flex-wrap -mx-2">
          {topRatedFoodItems.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodItemGrid;
