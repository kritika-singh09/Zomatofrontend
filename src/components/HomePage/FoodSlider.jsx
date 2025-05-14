import React from "react";

const FoodSlider = () => {
  const categories = [
    { id: 1, name: "Pizza", image: "🍕" },
    { id: 2, name: "Burger", image: "🍔" },
    { id: 3, name: "Sushi", image: "🍣" },
    { id: 4, name: "Pasta", image: "🍝" },
    { id: 5, name: "Salad", image: "🥗" },
    { id: 6, name: "Dessert", image: "🍰" },
    { id: 7, name: "Coffee", image: "☕" },
    { id: 8, name: "Breakfast", image: "🍳" },
    { id: 9, name: "Indian", image: "🍛" },
    { id: 10, name: "Chinese", image: "🥡" },
    { id: 11, name: "Tacos", image: "🌮" },
    { id: 12, name: "Steak", image: "🥩" },
    { id: 13, name: "Ice Cream", image: "🍦" },
    { id: 14, name: "Fried Chicken", image: "🍗" },
    { id: 15, name: "Seafood", image: "🦞" },
    { id: 16, name: "Sandwich", image: "🥪" },
    { id: 17, name: "Soup", image: "🍲" },
    { id: 18, name: "Donuts", image: "🍩" },
    { id: 19, name: "BBQ", image: "🍖" },
    { id: 20, name: "Smoothie", image: "🥤" },
  ];
  return (
    // Horizontal Slider Section
    <div className="mt-8 px-4">
      <h2 className="text-xl font-bold mb-4">What's on your mind?</h2>
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-6 min-w-max">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl shadow-md">
                {category.image}
              </div>
              <p className="mt-2 text-sm font-medium">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodSlider;
