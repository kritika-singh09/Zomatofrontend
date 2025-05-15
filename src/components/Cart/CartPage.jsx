import React, { useState } from "react";
import CartItem from "./CartItem";
import { GrNotes } from "react-icons/gr";
import { FaTimes } from "react-icons/fa";
import BillDetail from "./BillDetail";
import AddressPanel from "./AddressPanel";

const CartPage = () => {
  // Sample cart items - in a real app, this would come from context or state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Butter Chicken",
      restaurant: "Mughlai Cuisine",
      price: "₹249.60",
      quantity: 1,
      veg: false,
    },
    {
      id: 2,
      name: "Margherita Pizza",
      restaurant: "Pizza",
      price: "₹199",
      quantity: 1,
      veg: true,
    },
    {
      id: 6,
      name: "Masala Dosa",
      restaurant: "South Indian",
      price: "₹120",
      quantity: 1,
      veg: true,
    },
  ]);
  const [instructions, setInstructions] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [showAddressPanel, setShowAddressPanel] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Update quantity handler
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item handler
  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Navigate to menu to add more items
  const handleAddMore = () => {
    // Navigate to menu or show menu modal
    alert("Navigate to menu to add more items");
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
    return total + price * item.quantity;
  }, 0);

  // Delivery fee
  const deliveryFee = 40;

  // GST calculation (5% of subtotal)
  const gst = subtotal * 0.05;

  // Handle address selection
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    console.log("Selected address:", address);
    // Here you would typically proceed to the next step in the checkout process
  };

  return (
    <div className="p-4">
      {cartItems.length === 0 ? (
        <div className="bg-white p-8 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            onClick={handleAddMore}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          {/* Cart items */}
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onAddMore={handleAddMore}
            />
          ))}

          <div className="mt-6 border-gray-200">
            {!showInstructions ? (
              <div className="flex items-center relative">
                <GrNotes className="mb-2 absolute left-0 cursor-pointer" />
                <button
                  className="ml-6 pb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => setShowInstructions(true)}
                >
                  Add Instructions for Restaurant
                </button>
              </div>
            ) : (
              <div className="mt-2 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Instructions for Restaurant</h3>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setShowInstructions(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="E.g., Less spicy, no onions, extra sauce, etc."
                  rows="3"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  autoFocus
                ></textarea>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex justify-between text-lg">
              <span>
                Delivery in <span className="font-bold">35-40 min</span>
              </span>
            </div>
          </div>

          {/* Bill Details Component with sliding panel */}
          <BillDetail
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            gst={gst}
            totalPrice={subtotal + deliveryFee + gst}
            showDetails={showBillDetails}
            toggleDetails={() => setShowBillDetails(!showBillDetails)}
          />

          <button
            className="cursor-pointer w-full bg-green-700 text-white py-3 rounded-lg font-bold mt-4 hover:bg-green-800"
            onClick={() => setShowAddressPanel(true)}
          >
            Select Address at next step
          </button>

          {/* Address Panel Component */}
          <AddressPanel
            showPanel={showAddressPanel}
            togglePanel={() => setShowAddressPanel(!showAddressPanel)}
            onSelectAddress={handleSelectAddress}
          />
        </div>
      )}
    </div>
  );
};

export default CartPage;
