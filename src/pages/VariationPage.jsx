import React from "react";
import Banner from "../components/variationPage/Banner";
import { useAppContext } from "../context/AppContext";
import Header from "../components/variationPage/Header";
import VariationOptions from "../components/variationPage/VariationOptions";
import AddOns from "../components/variationPage/AddOns";
import Message from "../components/variationPage/Message";
import VariationFooter from "../components/variationPage/VariationFooter";

const VariationPage = () => {
  return (
    <div className="bg-gray-200 h-full">
      {/* <Banner /> */}
      <Header />
      <VariationOptions />
      <AddOns />
      <Message />
      <VariationFooter />
    </div>
  );
};

export default VariationPage;
