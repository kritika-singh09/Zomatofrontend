import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../services/api";

export const AppContext = createContext();
const ADDRESSES_CACHE_KEY = "userAddresses";
const SELECTED_ADDRESS_KEY = "selectedAddressId";
const API_URL = "https://hotelbuddhaavenue.vercel.app";

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userNumber, setUserNumber] = useState("+91-");
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [otp, setOtp] = useState("");
  const [currentUser, setCurrentUser] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(false);
  const [vegModeEnabled, setVegModeEnabled] = useState(
    localStorage.getItem("vegMode") === "true" || false
  );
  const [foodItem, setFoodItem] = useState({
    name: "Biryani",
    price: "150",
    quantity: "250g",
    description: "Best in the class",
    image: null,
    veg: false,
    rating: 4.5,
  });

  // Initialize cart from localStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [showCartNotification, setShowCartNotification] = useState(false);

  // Use refs to prevent infinite loops
  const isInitialMount = useRef(true);
  const isInitialCartMount = useRef(true);

  //Check if user is logged in or not

  // Check if user is logged in on app load and on token/user changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (token && user) {
        setCurrentUser(true);
      } else if (isLoggedIn) {
        // If isLoggedIn flag exists but token/user is missing, try to recover
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            setCurrentUser(true);
          } catch (e) {
            console.error("Error parsing stored user:", e);
          }
        }
      }
    }
  }, []); // Empty dependency array - only run once on mount

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartJSON = JSON.stringify(cart);
    localStorage.setItem("cart", cartJSON);
  }, [cart]); // Only run when cart changes

  // Generate unique ID for base item + variation
  const getBaseVariationId = (item, variation) => {
    const base = String(item.id).toLowerCase().replace(/\s+/g, "-");
    const variationPart = variation?.id
      ? String(variation.id).toLowerCase()
      : "default";
    return `${base}-${variationPart}`;
  };

  // Login function
  const login = async (phoneNumber, firebaseUid) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber, firebaseUid }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user data and login status
        const userData = { phone: phoneNumber, uid: firebaseUid };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        setUser(userData);
        setCurrentUser(true);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP function
  const verifyOTP = async (phoneNumber, otpCode) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber, otp: otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setCurrentUser(true);
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || "OTP verification failed",
        };
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userProfile");
    setToken(null);
    setUser(null);
    setCurrentUser(false);
    navigate("/login");
  };

  // Update user profile function
  const updateUserProfile = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local user data
        const updatedUser = { ...user, ...userData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return {
          success: true,
          message: data.message || "Profile updated successfully",
        };
      } else {
        return {
          success: false,
          message: data.message || "Failed to update profile",
        };
      }
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, message: "Network error. Please try again." };
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async (forceRefresh = false) => {
    try {
      const data = await fetchUserProfile(forceRefresh);
      if (data.success && data.user) {
        console.log("User profile fetched successfully:", data.user);
        setUser(data.user);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("user") || "{}"),
            ...data.user,
          })
        );
        localStorage.setItem("userProfile", JSON.stringify(data.user));
      } else {
        console.warn("Failed to fetch user profile:", data.error);
      }
    } catch (e) {
      console.error("Error in refreshUserProfile:", e);
    }
  };

  // Add item to cart
  const addToCart = (item) => {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    if (existingItemIndex !== -1) {
      // If item exists, update quantity
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity = quantity;
      setCart(updatedCart);
    } else {
      // If item doesn't exist, add it with quantity 1
      setCart([...cart, { ...item, quantity: 1, id: item.id }]);
    }

    // Show notification
    setShowCartNotification(true);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
  };

  const addToCartWithQuantity = (item, quantity) => {
    if (!item || !item.id) {
      console.error("Invalid item or missing ID:", item);
      return;
    }

    setCart((prevCart) => {
      const prev = { ...prevCart };
      prev[item.id] = { ...item, quantity };
      return prev;
    });

    setShowCartNotification(true);
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
  };

  // Add to cart
  const addToCartWithAddons = (item, variation, addons) => {
    const id = getBaseVariationId(item, variation);
    setCart((prevCart) => {
      const prev = { ...prevCart };
      if (prev[id]) {
        // Add new addons set for this instance
        prev[id].quantity += 1;
        prev[id].addonsList.push(addons.map((a) => a.name));
      } else {
        prev[id] = {
          ...item,
          variation,
          quantity: 1,
          addonsList: [addons.map((a) => a.name)],
        };
      }
      return prev;
    });
  };

  // Remove one instance (by index) or all of a base+variation
  const removeOneFromCart = (id, index = null) => {
    setCart((prevCart) => {
      const prev = { ...prevCart };
      if (!prev[id]) return prev;
      if (index !== null && prev[id].addonsList.length > 1) {
        prev[id].addonsList.splice(index, 1);
        prev[id].quantity -= 1;
      } else {
        delete prev[id];
      }
      return prev;
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[itemId];
      return newCart;
    });
  };

  // Empty Cart
  const clearCart = () => {
    if (window.confirm("Delete all the items of the cart?")) {
      setCart({});
    }
  };

  // Update quantity (for all instances)
  const updateCartItemQuantity = (id, newQuantity, newAddons = []) => {
    setCart((prevCart) => {
      const prev = { ...prevCart };
      if (!prev[id]) return prev;

      // If increasing, add a new addons set (empty or from newAddons)
      if (newQuantity > prev[id].quantity) {
        prev[id].quantity = newQuantity;
        prev[id].addonsList.push(newAddons.length ? newAddons : []);
      }
      // If decreasing, remove the last addons set
      else if (newQuantity < prev[id].quantity) {
        prev[id].quantity = newQuantity;
        prev[id].addonsList.pop();
        // If quantity is now 0, remove the item
        if (prev[id].quantity <= 0) {
          delete prev[id];
        }
      }
      // If equal, do nothing
      return prev;
    });
  };

  // Toggle veg mode from the profile
  const toggleVegMode = () => {
    const newValue = !vegModeEnabled;
    setVegModeEnabled(newValue);
    localStorage.setItem("vegMode", newValue);
  };

  // Price calculation
  const getCartTotals = () => {
    let baseTotal = 0;
    let addonTotal = 0;
    Object.values(cart).forEach((entry) => {
      const basePrice =
        (parseFloat(entry.price) +
          (entry.variation ? parseFloat(entry.variation.price) || 0 : 0)) *
        entry.quantity;
      baseTotal += basePrice;
      // Check if addonsList exists before trying to iterate over it
      if (entry.addonsList && Array.isArray(entry.addonsList)) {
        entry.addonsList.forEach((addons) => {
          if (Array.isArray(addons)) {
            addonTotal +=
              addons.reduce((sum, addonName) => {
                // You may want to map addonName to price here if needed
                return sum + 0; // Replace 0 with actual price lookup
              }, 0) || 0;
          }
        });
      }
    });
    return { baseTotal, addonTotal, total: baseTotal + addonTotal };
  };

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(
    localStorage.getItem(SELECTED_ADDRESS_KEY) || null
  );
  const [addressesLoading, setAddressesLoading] = useState(false);

  const fetchAddresses = async (forceRefresh = false) => {
    setAddressesLoading(true);
    try {
      if (!forceRefresh) {
        const cached = localStorage.getItem(ADDRESSES_CACHE_KEY);
        if (cached) {
          setAddresses(JSON.parse(cached));
          setAddressesLoading(false);
          return;
        }
      }
      if (!user?.firebaseUid && !user?.uid) {
        setAddresses([]);
        setAddressesLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/api/user/getaddresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseUid: user.firebaseUid || user.uid }),
      });
      const data = await res.json();
      console.log("Addresses fetched:", data);
      if (data.success) {
        setAddresses(data.addresses);
        localStorage.setItem(
          ADDRESSES_CACHE_KEY,
          JSON.stringify(data.addresses)
        );
      } else {
        setAddresses([]);
      }
    } catch (e) {
      setAddresses([]);
    }
    setAddressesLoading(false);
  };

  const handleAddAddress = async (addressObj) => {
    try {
      if (
        !addressObj.house_no ||
        !addressObj.street ||
        !addressObj.city ||
        !addressObj.state ||
        !addressObj.pincode
      ) {
        alert("Please fill in all required fields");
        return false;
      }
      if (!user || (!user.firebaseUid && !user.uid)) {
        alert("User information is missing. Please log in again.");
        return false;
      }
      const firebaseUid = user.firebaseUid || user.uid;
      const addressData = {
        firebaseUid: firebaseUid,
        address: {
          type:
            addressObj.type.charAt(0).toUpperCase() + addressObj.type.slice(1),
          house_no: addressObj.house_no,
          street: addressObj.street,
          city: addressObj.city,
          state: addressObj.state,
          postalCode: addressObj.pincode,
          landmark: addressObj.landmark || "",
          lat: addressObj.lat,
          lng: addressObj.lng,
        },
      };
      const response = await fetch(`${API_URL}/api/auth/updateaddress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addressData),
      });
      const responseData = await response.json();
      if (response.ok && responseData.success) {
        await fetchAddresses(true);
        return true;
      } else {
        alert(responseData.message || "Failed to add address");
        return false;
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Network error. Please try again.");
      return false;
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        // Check if user is available
        if (!user || (!user.firebaseUid && !user.uid)) {
          alert("User information is missing. Please log in again.");
          return;
        }

        // Get Firebase UID from user object
        const firebaseUid = user.firebaseUid || user.uid;

        const response = await fetch(`${API_URL}/api/user/deleteaddress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseUid,
            addressId,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Remove the address from local state using _id
          const updatedAddresses = addresses.filter(
            (address) => address._id !== addressId
          );
          setAddresses(updatedAddresses);
          localStorage.setItem(
            ADDRESSES_CACHE_KEY,
            JSON.stringify(updatedAddresses)
          );
          // If the deleted address was selected, clear the selection
          if (selectedAddressId === addressId) {
            setSelectedAddressId(null);
            localStorage.removeItem(SELECTED_ADDRESS_KEY);
          }
          alert("Address deleted successfully");
        } else {
          alert(result.message || "Failed to delete address");
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Network error. Please try again.");
      }
    }
  };

  // Keep selected address in sync with localStorage
  useEffect(() => {
    if (selectedAddressId) {
      localStorage.setItem(SELECTED_ADDRESS_KEY, selectedAddressId);
    }
  }, [selectedAddressId]);

  // Fetch addresses on user change
  useEffect(() => {
    fetchAddresses();
  }, [user]);

  // order placement
  const placeOrder = async () => {
    try {
      if (!user || !user._id) {
        alert("Please log in to place an order");
        return { success: false, message: "User not logged in" };
      }

      if (!selectedAddressId) {
        alert("Please select a delivery address");
        return { success: false, message: "No address selected" };
      }

      const cartItems = Object.values(cart);

      const cartTotals = getCartTotals();

      // Get the actual item IDs from the cart items
      const item_ids = cartItems.map((item) => item._id).filter(Boolean);

      // is_variation and variation
      const is_variation = cartItems.some((item) => !!item.variation);
      const variation = is_variation
        ? cartItems.map((item) => item.variation || null)
        : null;

      // is_addon and addon
      const is_addon = cartItems.some(
        (item) => Array.isArray(item.addonsList) && item.addonsList.length > 0
      );
      const addon = is_addon
        ? cartItems.map((item) => item.addonsList || [])
        : [];

      // Prepare order data
      const orderData = {
        customer_id: user._id,
        address_id: selectedAddressId,
        item_ids,
        is_variation,
        variation,
        is_addon,
        addon,
        gst: 18,
        amount: cartTotals.total,
        payment_status: "success",
        payment_data: {},
        order_status: 1,
        delivery_partner_id: null,
        delivery_boy: "Own-Delivery",
        order_source: "Online",
        status: "Pending",
      };

      // Call API to create order
      const response = await fetch(
        "https://hotelbuddhaavenue.vercel.app/api/admin/createorder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Clear cart on successful order
        setCart({});
        return {
          success: true,
          orderId: result.orderId || result._id,
          message: "Order placed successfully",
        };
      } else {
        return {
          success: false,
          message: result.message || "Failed to place order",
        };
      }
    } catch (error) {
      console.error("Error placing order:", error);
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const value = {
    navigate,
    userNumber,
    phone,
    setPhone,
    isValid,
    setIsValid,
    otp,
    setOtp,
    currentUser,
    setCurrentUser,
    setUserNumber,
    foodItem,
    setFoodItem,
    cart,
    addToCart,
    removeFromCart,
    showCartNotification,
    login,
    verifyOTP,
    logout,
    user,
    loading,
    clearCart,
    addToCartWithQuantity,
    getCartTotals,
    addToCartWithAddons,
    removeOneFromCart,
    updateCartItemQuantity,
    getBaseVariationId,
    updateUserProfile,
    vegModeEnabled,
    toggleVegMode,
    refreshUserProfile,
    addresses,
    setSelectedAddressId,
    selectedAddressId,
    fetchAddresses,
    handleAddAddress,
    handleDeleteAddress,
    addressesLoading,
    placeOrder,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
