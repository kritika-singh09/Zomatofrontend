// src/components/CartButton.jsx
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BsCart3 } from 'react-icons/bs';
import { useLocation } from 'react-router-dom';

const CartButton = () => {
  const { navigate, cart } = useAppContext();
  const location = useLocation();
  
  // Calculate total items in cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Don't show on login or cart pages
  if (location.pathname === '/' || location.pathname === '/verification' || location.pathname === '/cart') {
    return null;
  }
  
  return (
    <button
      onClick={() => navigate('/cart')}
      className="fixed bottom-5 right-5 bg-green-500 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
      style={{ width: '60px', height: '60px' }}
    >
      <div className="relative">
        <BsCart3 size={24} />
        {totalItems > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {totalItems}
          </div>
        )}
      </div>
    </button>
  );
};

export default CartButton;
