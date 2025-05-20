import React, { useState, useEffect } from "react";
import Header from "../components/HomePage/Header";
import FoodSlider from "../components/HomePage/FoodSlider";
import Recommendation from "../components/itemDetail/Recommendation";
import FoodItemGrid from "../components/HomePage/FoodItemGrid";
import CartButton from "../components/CartButton";
import BottomSheetModal from "../components/BottomSheetModal";
import VariationPage from "./VariationPage";

const Home = () => {
  const [open, setOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const handleFoodClick = (food) => {
    setSelectedFood(food);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <Header />
      <FoodSlider />
      <FoodItemGrid onFoodClick={handleFoodClick} />
      <Recommendation onFoodClick={handleFoodClick} />
      <CartButton />
      <BottomSheetModal open={open} onClose={() => setOpen(false)}>
        <VariationPage food={selectedFood} onClose={handleClose} />
      </BottomSheetModal>
    </div>
  );
};

export default Home;
