import React, { useState, useEffect } from "react";

const FoodSlider = ({ onCategoryClick }) => {
  // const defaultCategories = [
  //   { id: 1, name: "Pizza", image: "🍕" },
  //   { id: 2, name: "Burger", image: "🍔" },
  //   { id: 3, name: "Sushi", image: "🍣" },
  //   { id: 4, name: "Pasta", image: "🍝" },
  //   { id: 5, name: "Salad", image: "🥗" },
  //   { id: 6, name: "Dessert", image: "🍰" },
  //   { id: 7, name: "Coffee", image: "☕" },
  //   { id: 8, name: "Breakfast", image: "🍳" },
  //   { id: 9, name: "Indian", image: "🍛" },
  //   { id: 10, name: "Chinese", image: "🥡" },
  // ];

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://hotelbuddhaavenue.vercel.app/api/user/category"
        );
        const data = await response.json();

        if (data.success && data.categories) {
          setCategories(data.categories);
        } else {
          // Fallback to default categories if API fails
          // setCategories(defaultCategories);
        }
      } catch (error) {
        // console.error("Error fetching categories:", error);
        // setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      // Scroll to recommendations section with animation
      const recommendationsSection = document.getElementById(
        "recommendations-section"
      );
      if (recommendationsSection) {
        recommendationsSection.scrollIntoView({ behavior: "smooth" });
      }

      // Pass the category to parent component
      onCategoryClick(category);
    }
  };

  return (
    // Horizontal Slider Section
    <div className="mt-8 px-4">
      <h2 className="text-xl font-bold mb-4">What's on your mind?</h2>
      <div className="overflow-x-auto pb-4">
        {loading ? (
          <div className="flex space-x-6 min-w-max">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="mt-2 w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex space-x-6 min-w-max">
            {categories.map((category) => (
              <div
                key={category._id || category.id}
                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl shadow-md">
                  {category.image || "🍽️"}
                </div>
                <p className="mt-2 text-sm font-medium">{category.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodSlider;
