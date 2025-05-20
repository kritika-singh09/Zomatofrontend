import React, { useState, useEffect } from "react";
import Banner from "../components/variationPage/Banner";
import { useAppContext } from "../context/AppContext";
import Header from "../components/variationPage/Header";
import VariationOptions from "../components/variationPage/VariationOptions";
import AddOns from "../components/variationPage/AddOns";
import Message from "../components/variationPage/Message";
import VariationFooter from "../components/variationPage/VariationFooter";
import { useNavigate } from "react-router-dom";

const VariationPage = ({
  food: propFood,
  onClose: propOnClose,
  onVariationChange,
}) => {
  const { cart, foodItem, addToCartWithQuantity } = useAppContext();
  const navigate = useNavigate();

  const food = propFood || foodItem;
  const onClose = propOnClose || (() => navigate(-1));

  // Use API data directly
  const stableFood = React.useMemo(() => {
    if (!food) return null;
    return {
      ...food,
      variation: food.variation || [],
      addon: food.addon || [],
    };
  }, [food]);

  const [selectedVariation, setSelectedVariation] = useState(
    stableFood?.variation?.[0] || null
  );
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // useEffect(() => {
  //   console.log("VariationPage rendered with food:", food);
  //   console.log("Food has variation:", !!food?.variation);
  //   console.log("Food has addon:", !!food?.addon);
  //   console.log("Selected variation:", selectedVariation);
  // }, [stableFood, selectedVariation]);

  useEffect(() => {
    setSelectedVariation(stableFood?.variation?.[0] || null);
    setSelectedAddons([]);
  }, [stableFood]);

  // Handle sync change
  useEffect(() => {
    if (!stableFood) return;
    // Generate the unique id for the current selection
    const variationId = selectedVariation?.id || "default";
    const addonIds = selectedAddons
      .map((addon) => addon.id)
      .sort()
      .join("-");
    const uniqueId = `${stableFood.id}-${variationId}-${addonIds}`;
    // Find the item in the cart
    const cartItem = cart.find((item) => item.id === uniqueId);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
    }
  }, [stableFood, selectedVariation, selectedAddons, cart]);

  // Calculate total price based on selections
  const getBasePrice = () => {
    if (selectedVariation) {
      return parseFloat(selectedVariation.price);
    }
    return parseFloat(food?.price || 0);
  };

  const getAddonPrice = () => {
    return selectedAddons.reduce(
      (total, addon) => total + parseFloat(addon.price || 0),
      0
    );
  };

  const getTotalPrice = () => {
    return getBasePrice() + getAddonPrice();
  };

  // Create a unique ID for this specific combination of food, variation, and add-ons
  const getUniqueItemId = () => {
    const variationId = selectedVariation?.id || "default";
    const addonIds = selectedAddons
      .map((addon) => addon.id)
      .sort()
      .join("-");
    return `${stableFood.id}-${variationId}-${addonIds}`;
  };

  // Create a modified food object with the selected options
  const getFoodWithSelections = () => {
    const variationText = selectedVariation
      ? `${selectedVariation.name} (${selectedVariation.quantity})`
      : "";
    const addonText =
      selectedAddons.length > 0
        ? `+ ${selectedAddons.map((addon) => addon.name).join(", ")}`
        : "";

    // Calculate the item price: base price + addons (not multiplied)
    const itemPrice = getBasePrice() + getAddonPrice();

    return {
      ...food,
      id: getUniqueItemId(), // <-- unique id for cart
      price: itemPrice.toString(),
      basePrice: getBasePrice(),
      addonPrice: getAddonPrice(),
      selectedVariation,
      selectedAddons,
      originalPrice: food?.price,
      variationDetails: variationText,
      addonDetails: addonText,
    };
  };

  const handleAddToCart = () => {
    const itemWithSelections = getFoodWithSelections();
    addToCartWithQuantity(itemWithSelections, quantity);
    if (onClose) onClose();
  };

  if (!stableFood) {
    console.error("No food data provided to VariationPage");
    return (
      <div className="p-4 text-red-500">Error: No food data available</div>
    );
  }

  return (
    <div className="bg-gray-200 w-full">
      <Header food={stableFood} />
      <VariationOptions
        food={stableFood}
        onVariationChange={setSelectedVariation}
      />
      <AddOns food={stableFood} onAddonsChange={setSelectedAddons} />
      <Message />
      <VariationFooter
        food={getFoodWithSelections()}
        onClose={onClose}
        basePrice={getBasePrice()}
        addonPrice={getAddonPrice()}
        onAddToCart={handleAddToCart}
        quantity={quantity}
        onQuantityChange={setQuantity}
      />
    </div>
  );
};

export default VariationPage;
