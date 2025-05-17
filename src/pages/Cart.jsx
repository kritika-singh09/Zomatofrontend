import React from "react";
import CartPage from "./CartPage";

const Cart = () => {
  return (
    <div>
      <CartPage />
    </div>
  );
};

export default Cart;

// // src/pages/Cart.jsx
// import React from "react";
// import { useAppContext } from "../context/AppContext";
// import { BsArrowLeftCircle } from "react-icons/bs";
// import { FaTrash } from "react-icons/fa";

// const Cart = () => {
//   const { navigate, cart, removeFromCart, updateCartItemQuantity } = useAppContext();

//   // Calculate total price
//   const totalPrice = cart.reduce((total, item) => {
//     return total + (parseFloat(item.price) * item.quantity);
//   }, 0);

//   // Handle checkout
//   const handleCheckout = () => {
//     // Implement checkout logic here
//     alert("Checkout functionality will be implemented soon!");
//   };

//   return (
//     <div className="p-3 pb-24">
//       <div className="navbar flex justify-between items-center mb-5">
//         <BsArrowLeftCircle onClick={() => navigate(-1)} className="cursor-pointer" />
//         <h1 className="font-bold text-xl">Your Cart</h1>
//         <div></div> {/* Empty div for flex spacing */}
//       </div>

//       {cart.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-64">
//           <p className="text-gray-500 mb-4">Your cart is empty</p>
//           <button
//             onClick={() => navigate('/')}
//             className="bg-green-500 text-white px-4 py-2 rounded-lg"
//           >
//             Browse Menu
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="space-y-4 mb-4">
//             {cart.map((item) => (
//               <div key={item.id} className="flex justify-between items-center border-b pb-3">
//                 <div className="flex items-center gap-3">
//                   <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
//                     {item.image ? (
//                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-gray-400">
//                         No Image
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <h3 className="font-medium">{item.name}</h3>
//                     <p className="text-gray-500 text-sm">₹{item.price}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center border rounded-md">
//                     <button
//                       onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
//                       className="px-2 py-1 text-lg"
//                     >
//                       -
//                     </button>
//                     <span className="px-2">{item.quantity}</span>
//                     <button
//                       onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
//                       className="px-2 py-1 text-lg"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <button
//                     onClick={() => removeFromCart(item.id)}
//                     className="text-red-500"
//                   >
//                     <FaTrash />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="space-y-2 mb-4">
//             <div className="flex justify-between">
//               <span>Subtotal</span>
//               <span>₹{totalPrice.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Delivery Fee</span>
//               <span>₹30.00</span>
//             </div>
//             <div className="flex justify-between font-bold">
//               <span>Total</span>
//               <span>₹{(totalPrice + 30).toFixed(2)}</span>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Checkout Button */}
//       {cart.length > 0 && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t">
//           <button
//             onClick={handleCheckout}
//             className="w-full bg-red-400 transition-all ease-in-out duration-300 hover:bg-red-800 text-white py-3 rounded-lg font-medium"
//           >
//             Proceed to Checkout • ₹{(totalPrice + 30).toFixed(2)}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;
