// foodData.js
import { FaStar, FaFire, FaHeart, FaLeaf } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { GiNoodles, GiChickenLeg, GiCupcake } from "react-icons/gi";
import chickenImg from "../../assets/food/chicken.jpg";
import pizzaImg from "../../assets/food/pizza.jpeg";
import biryaniImg from "../../assets/food/biryani.jpeg";
import noodlesImg from "../../assets/food/noodles.jpeg";
import dosaImg from "../../assets/food/dosa.jpeg";
import brownieImg from "../../assets/food/brownie.jpeg";
// foodData.js
export const foodRecommendations = [
  {
    id: 1,
    name: "Butter Chicken",
    restaurant: "Mughlai Cuisine",
    price: "₹249",
    rating: 4.8,
    image: chickenImg,
    tag: "Bestseller",
    tagIcon: "FaStar",
    tagIconColor: "text-yellow-500",
    tagBg: "bg-yellow-100",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    restaurant: "Pizza",
    price: "₹199",
    rating: 4.6,
    image: pizzaImg,
    tag: "Trending",
    tagIcon: "FaFire",
    tagIconColor: "text-orange-500",
    tagBg: "bg-orange-100",
  },
  {
    id: 3,
    name: "Hakka Noodles",
    restaurant: "Starter",
    price: "₹149",
    rating: 4.3,
    image: noodlesImg,
    tag: "Must Try",
    tagIcon: "GiNoodles",
    tagIconColor: "text-red-500",
    tagBg: "bg-red-100",
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    restaurant: "Dessert",
    price: "₹99",
    rating: 4.7,
    image: brownieImg,
    tag: "Popular",
    tagIcon: "FaHeart",
    tagIconColor: "text-pink-500",
    tagBg: "bg-pink-100",
  },
  {
    id: 5,
    name: "Chicken Biryani",
    restaurant: "Indian Cuisine",
    price: "₹220",
    rating: 4.5,
    image: biryaniImg,
    tag: "Spicy",
    tagIcon: "GiChickenLeg",
    tagIconColor: "text-red-500",
    tagBg: "bg-red-100",
  },
  {
    id: 6,
    name: "Masala Dosa",
    restaurant: "South Indian",
    price: "₹120",
    rating: 4.4,
    image: dosaImg,
    tag: "Breakfast",
    tagIcon: "FaStar",
    tagIconColor: "text-green-500",
    tagBg: "bg-green-100",
  },
];
