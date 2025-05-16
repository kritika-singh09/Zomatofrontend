import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const API_URL = "https://hotelbuddhaavenue.vercel.app";

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userNumber, setUserNumber] = useState("+91-8400585115");
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [otp, setOtp] = useState("");
  const [currentUser, setCurrentUser] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(false);
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
    return savedCart ? JSON.parse(savedCart) : [];
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
    setToken(null);
    setUser(null);
    setCurrentUser(false);
    navigate("/login");
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
      updatedCart[existingItemIndex].quantity += 1;
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
  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  // Update item quantity in cart
  const updateCartItemQuantity = (itemId, quantity) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
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
    updateCartItemQuantity,
    showCartNotification,
    login,
    verifyOTP,
    logout,
    user,
    loading,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
