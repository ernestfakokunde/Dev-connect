import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  //----user state-----
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const normalizeUser = (rawUser) => {
    if (!rawUser || typeof rawUser !== 'object') return rawUser;
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const profilePic = rawUser.profilePic;

    if (profilePic && typeof profilePic === 'string' && profilePic.startsWith('/')) {
      const domainUrl = baseURL.replace('/api', '');
      return { ...rawUser, profilePic: `${domainUrl}${profilePic}` };
    }
    return rawUser;
  };

  //automatically restore user if user exists
  useEffect(() => {
    if (token) {
      setLoading(true);
      // Interceptor will handle the token
      axiosInstance.get("/users/me")
        .then(res => setUser(normalizeUser(res.data)))
        .catch((err) => {
          setToken('');
          localStorage.removeItem("token");
          console.log(err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  //login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/users/login', { email, password });
      const { token } = res.data;
      setToken(token);
      localStorage.setItem('token', token);

      // Fetch full user profile after login - interceptor handles token
      const userRes = await axiosInstance.get("/users/me");
      setUser(normalizeUser(userRes.data));

      return true;
    } catch (error) {
      console.log("login failed", error.response?.data.message || error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  //register function
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/users/register", formData);
      const { token } = res.data;
      setToken(token);
      localStorage.setItem("token", token);

      // Fetch full user profile after registration - interceptor handles token
      const userRes = await axiosInstance.get("/users/me");
      setUser(normalizeUser(userRes.data));

      return true;
    } catch (error) {
      console.log("Registration failed", error.response?.data || error.message);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  //logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setToken("");
  };

  //----->>> update userProfile
  const updateProfile = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Not authenticated");
      }
      const data = new FormData();

      data.append("profileName", formData.profileName || "");
      data.append("town", formData.town || "");
      data.append("placeOfBirth", formData.placeOfBirth || "");
      data.append("bio", formData.bio || "");
      data.append("gender", formData.gender || "");
      if (formData.profilePic) data.append("profilePic", formData.profilePic);

      // Interceptor will handle the token
      const res = await axiosInstance.patch('/users/profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setUser(normalizeUser(res.data.user));
        return res.data.user;
      } else {
        throw new Error(res.data.message || "Profile update failed");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  //helper function to add new product
  const addNewProducts = (newProducts) => {
    setProducts((prev) => [...prev, { ...newProducts, id: prev.length + 1, }]);
  };

  //product state
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "AI Developer Hoodie",
      price: 45,
      image: "https://via.placeholder.com/150",
      description: "Soft and stylish hoodie for developers.",
    },
    {
      id: 2,
      name: "JavaScript Mug",
      price: 15,
      image: "https://via.placeholder.com/150",
      description: "Start your morning with JS energy ☕",
    },
    {
      id: 3,
      name: "React Stickers Pack",
      price: 10,
      image: "https://via.placeholder.com/150",
      description: "Decorate your laptop with React love 💙",
    },
    {
      id: 4,
      name: "Developer Mug",
      price: 20,
      image: "https://images.unsplash.com/photo-1600172454284-934d3c8844f4?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      name: "Standing Desk",
      price: 250,
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 6,
      name: "4K Monitor",
      price: 300,
      image: "https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 7,
      name: "Laptop Stand",
      price: 40,
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900d2?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 8,
      name: "Wireless Mouse",
      price: 25,
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 9,
      name: "Smart LED Lamp",
      price: 60,
      image: "https://images.unsplash.com/photo-1593642533144-3d62c9ab3a93?auto=format&fit=crop&w=600&q=80",
    },
  ]);

  //---cart state---
  const [cart, setCart] = useState([]);

  //--search query state
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    if (!product.name) return false;
    return product.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase());
  });

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        console.log(cart);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      };
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };
  const cartQuantity = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };
  const value = {
    user,
    setUser,
    products,
    setProducts,
    setSearchQuery,
    filteredProducts,
    searchQuery,
    cart,
    addNewProducts,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    cartQuantity,
    login,
    register,
    logout,
    token,
    loading,
    updateProfile,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};
