// src/pages/OrdersPage.jsx
import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

// Dummy data for testing
const dummyOrders = [
  {
    id: "ORD12345",
    status: "delivered",
    createdAt: "2023-12-15T14:30:00Z",
    totalAmount: 450.75,
    items: [
      {
        name: "Butter Chicken",
        quantity: 1,
        variationDetails: "Full (500g)",
        addonDetails: "+ Extra Butter, Roomali Roti",
      },
      {
        name: "Jeera Rice",
        quantity: 2,
        variationDetails: "Regular",
      },
    ],
  },
  {
    id: "ORD12346",
    status: "processing",
    createdAt: "2023-12-18T18:45:00Z",
    totalAmount: 325.5,
    items: [
      {
        name: "Paneer Tikka",
        quantity: 1,
        variationDetails: "Half (250g)",
        addonDetails: "+ Extra Masala",
      },
      {
        name: "Garlic Naan",
        quantity: 3,
      },
    ],
  },
  {
    id: "ORD12347",
    status: "cancelled",
    createdAt: "2023-12-10T12:15:00Z",
    totalAmount: 550.0,
    items: [
      {
        name: "Chicken Biryani",
        quantity: 2,
        variationDetails: "Full (500g)",
      },
      {
        name: "Raita",
        quantity: 1,
      },
    ],
  },
  {
    id: "ORD12348",
    status: "pending",
    createdAt: "2023-12-19T09:20:00Z",
    totalAmount: 275.25,
    items: [
      {
        name: "Masala Dosa",
        quantity: 2,
      },
      {
        name: "Filter Coffee",
        quantity: 2,
      },
    ],
  },
];

const OrdersPage = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call with dummy data
    const fetchOrders = async () => {
      try {
        // Simulate loading delay
        setTimeout(() => {
          setOrders(dummyOrders);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Error fetching orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm.trim()) return true; // Show all orders if search is empty

    const searchLower = searchTerm.toLowerCase().trim();

    // Search in order ID
    if (order.id.toLowerCase().includes(searchLower)) return true;

    // Search in status
    if (order.status && order.status.toLowerCase().includes(searchLower))
      return true;

    // Search in items
    if (order.items && Array.isArray(order.items)) {
      const hasMatchingItem = order.items.some((item) => {
        // Check item name
        if (item.name && item.name.toLowerCase().includes(searchLower))
          return true;

        // Check variation details
        if (
          item.variationDetails &&
          item.variationDetails.toLowerCase().includes(searchLower)
        )
          return true;

        // Check addon details
        if (
          item.addonDetails &&
          item.addonDetails.toLowerCase().includes(searchLower)
        )
          return true;

        return false;
      });

      if (hasMatchingItem) return true;
    }

    // Check date (formatted)
    const formattedDate = formatDate(order.createdAt).toLowerCase();
    if (formattedDate.includes(searchLower)) return true;

    // Check price
    const priceString = order.totalAmount?.toFixed(2).toString();
    if (priceString && priceString.includes(searchTerm)) return true;

    return false;
  });
  return (
    <div className="max-w-xl mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {/* Search Bar */}
      {!loading && !error && orders.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search orders by ID, item, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800"
          />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-pulse">Loading orders...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* No orders state */}
      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            You haven't placed any orders yet
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-red-800 text-white px-4 py-2 rounded-md"
          >
            Browse Menu
          </button>
        </div>
      )}

      {/* No results state */}
      {!loading &&
        !error &&
        orders.length > 0 &&
        filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders match your search</p>
          </div>
        )}

      {/* Orders list */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Order #{order.id}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : order.status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status?.charAt(0).toUpperCase() +
                    order.status?.slice(1)}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-3">
                {formatDate(order.createdAt)}
              </p>

              <div className="border-t border-gray-200 pt-2">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <div>
                      <span className="text-sm">{item.name}</span>
                      {item.variationDetails && (
                        <span className="text-xs text-gray-500 block">
                          {item.variationDetails}
                        </span>
                      )}
                      {item.addonDetails && (
                        <span className="text-xs text-gray-500 block">
                          {item.addonDetails}
                        </span>
                      )}
                    </div>
                    <div className="text-sm">
                      <span>x{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-medium">
                  ₹{order.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
