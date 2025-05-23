import React, { useMemo, useState, useEffect } from "react";
import FoodCard from "./FoodCard";
import { fetchFoodItems } from "../../services/api";
import { useAppContext } from "../../context/AppContext";

const FoodItemGrid = ({ onFoodClick }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { vegModeEnabled } = useAppContext();

  // Sort food items by rating in descending order and take only the top 6
  // const topRatedFoodItems = [...foodItems]
  //   .sort((a, b) => b.rating - a.rating)
  //   .slice(0, 6);

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

  // Filter items based on veg mode
  const filteredItems = useMemo(() => {
    if (vegModeEnabled) {
      return foodItems.filter((item) => item.veg === true);
    }
    return foodItems;
  }, [foodItems, vegModeEnabled]);

  // Sort filtered items by rating and take top 6
  const topItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [filteredItems]);

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
          {topItems.map((food) => (
            <FoodCard key={food.id} food={food} onFoodClick={onFoodClick} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodItemGrid;
