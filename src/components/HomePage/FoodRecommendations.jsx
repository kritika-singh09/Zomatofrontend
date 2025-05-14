// import React, { useMemo } from "react";
// import FoodCard from "./FoodCard";
// import { foodRecommendations } from "./FoodData";

// // Food Card Component
// const FoodCard = ({ food }) => {
//   const [imageLoaded, setImageLoaded] = React.useState(false);

//   return (
//     <div className="cursor-pointer transition-transform hover:scale-105 w-1/3 px-2 mb-4">
//       <div className="rounded-lg shadow-md overflow-hidden">
//         {/* Food Image */}
//         <div className="h-32 bg-gray-100 relative">
//           {/* Placeholder while image loads */}
//           {!imageLoaded && (
//             <div className="absolute inset-0 flex items-center justify-center text-gray-400">
//               <div className="animate-pulse">Loading...</div>
//             </div>
//           )}
//           {/* Placeholder image */}
//           <img
//             src="/assets/placeholder.jpg"
//             alt="Placeholder"
//             className={`w-full h-full object-cover ${
//               imageLoaded ? "hidden" : "block"
//             }`}
//           />
//           {/* Actual image - hidden until loaded */}
//           <img
//             src={`/assets/food/${food.image}`}
//             alt={food.name}
//             className={`w-full h-full object-cover ${
//               imageLoaded ? "block" : "hidden"
//             }`}
//             onLoad={() => setImageLoaded(true)}
//             onError={() => {
//               // Show a fallback if image fails to load
//               setImageLoaded(true);
//             }}
//           />

//           {/* Tag */}
//           <div
//             className={`absolute top-2 left-2 ${food.tagBg} px-2 py-1 rounded-full flex items-center`}
//           >
//             {food.tagIcon}
//             <span className="ml-1 text-xs font-medium">{food.tag}</span>
//           </div>
//         </div>

//         {/* Food Details */}
//         <div className="p-2">
//           <h3 className="font-bold text-sm truncate">{food.name}</h3>
//           <div className="flex items-center mt-1">
//             <FaStar className="text-yellow-500 text-xs" />
//             <span className="ml-1 text-xs">{food.rating}</span>
//             <span className="mx-1 text-gray-300 text-xs">•</span>
//             <span className="text-xs text-gray-600 truncate">
//               {food.restaurant}
//             </span>
//           </div>
//           <div className="mt-2 flex justify-between items-center">
//             <span className="font-bold text-xs">{food.price}</span>
//             <button className="bg-white border border-orange-500 text-orange-500 px-2 py-0.5 rounded-md text-xs hover:bg-orange-500 hover:text-white transition-colors">
//               Add
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const FoodRecommendations = () => {
//   // Food recommendation data
//   const foodRecommendations = [
//     {
//       id: 1,
//       name: "Butter Chicken",
//       restaurant: "Mughlai Cuisine",
//       price: "₹249",
//       rating: 4.8,
//       src: "../assets/food/butterchiken.jpeg",
//       tag: "Bestseller",
//       tagIcon: <FaStar className="text-yellow-500" />,
//       tagBg: "bg-yellow-100",
//     },
//     {
//       id: 2,
//       name: "Margherita Pizza",
//       restaurant: "Pizza",
//       price: "₹199",
//       rating: 4.6,
//       image: "pizza.jpg",
//       tag: "Trending",
//       tagIcon: <FaFire className="text-orange-500" />,
//       tagBg: "bg-orange-100",
//     },
//     {
//       id: 3,
//       name: "Hakka Noodles",
//       restaurant: "Starter",
//       price: "₹149",
//       rating: 4.3,
//       image: "noodles.jpg",
//       tag: "Must Try",
//       tagIcon: <GiNoodles className="text-red-500" />,
//       tagBg: "bg-red-100",
//     },
//     {
//       id: 4,
//       name: "Chocolate Brownie",
//       restaurant: "Dessert",
//       price: "₹99",
//       rating: 4.7,
//       image: "brownie.jpg",
//       tag: "Popular",
//       tagIcon: <FaHeart className="text-pink-500" />,
//       tagBg: "bg-pink-100",
//     },
//     {
//       id: 5,
//       name: "Chicken Biryani",
//       restaurant: "Indian Cuisine",
//       price: "₹220",
//       rating: 4.5,
//       image: "biryani.jpg",
//       tag: "Spicy",
//       tagIcon: <GiChickenLeg className="text-red-500" />,
//       tagBg: "bg-red-100",
//     },
//     {
//       id: 6,
//       name: "Masala Dosa",
//       restaurant: "South Indian",
//       price: "₹120",
//       rating: 4.4,
//       image: "dosa.jpg",
//       tag: "Breakfast",
//       tagIcon: <FaStar className="text-green-500" />,
//       tagBg: "bg-green-100",
//     },
//   ];

//   return (
//     <div className="mt-8 px-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">Dishes For You</h2>
//         <button className="text-orange-500 text-sm font-medium">
//           View All
//         </button>
//       </div>

//       {/* Flex layout with exactly 3 cards per row */}
//       <div className="flex flex-wrap -mx-2">
//         {foodRecommendations.map((food) => (
//           <FoodCard key={food.id} food={food} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FoodRecommendations;

// FoodRecommendations.jsx
import React, { useMemo } from "react";
import FoodCard from "./FoodCard";
import { foodRecommendations } from "./FoodData";

const FoodRecommendations = () => {
  // Use useMemo to prevent unnecessary re-renders of the food items
  const foodItems = useMemo(() => {
    return foodRecommendations.map((food) => (
      <FoodCard key={food.id} food={food} />
    ));
  }, []);

  return (
    <div className="mt-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Dishes For You</h2>
        <button className="text-orange-500 text-sm font-medium">
          View All
        </button>
      </div>

      {/* Flex layout with exactly 3 cards per row */}
      <div className="flex flex-wrap -mx-2">{foodItems}</div>
    </div>
  );
};

export default FoodRecommendations;
