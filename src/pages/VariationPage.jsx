import React from "react";
import Banner from "../components/variationPage/Banner";
import { useAppContext } from "../context/AppContext";
import Header from "../components/variationPage/Header";
import VariationOptions from "../components/variationPage/VariationOptions";
import AddOns from "../components/variationPage/AddOns";
import Message from "../components/variationPage/Message";
import VariationFooter from "../components/variationPage/VariationFooter";

const VariationPage = ({ food }) => {
  if (!food) return null;

  return (
    <div className="bg-gray-200 w-full">
      {/* <Banner /> */}
      <Header food={food} />
      <VariationOptions food={food} />
      <AddOns food={food} />
      <Message food={food} />
      <VariationFooter food={food} />
    </div>
  );
};

export default VariationPage;
