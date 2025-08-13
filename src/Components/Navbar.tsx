import React, { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  Home,
  Package,
  Info,
  Settings,
  Heart,
  LogOut,
  ShoppingBag,
  History,
  TrendingUp,
  Filter,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Plus,
  Minus
} from "lucide-react";

interface NavbarProps {
  onNavigate: (screen: "login" | "signup" | "home") => void;
  user: any;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Mock data for search suggestions
const searchSuggestions = [
  { id: 1, text: "Brake Pads", category: "Brakes", popular: true },
  { id: 2, text: "Engine Oil", category: "Fluids", popular: true },
  { id: 3, text: "Air Filter", category: "Filters", popular: false },
  { id: 4, text: "Spark Plugs", category: "Engine", popular: true },
  { id: 5, text: "Headlight Bulbs", category: "Lighting", popular: false },
  { id: 6, text: "Windshield Wipers", category: "Exterior", popular: false },
  { id: 7, text: "Transmission Fluid", category: "Fluids", popular: false },
  { id: 8, text: "Car Battery", category: "Electrical", popular: true }
];

const recentSearches = [
  "Brake Pads Toyota",
  "Engine Oil 5W-30",
  "Air Filter Honda"
];

// Mock cart items
const cartItems = [
  {
    id: 1,
    name: "Brake Pads",
    price: 45.99,
    quantity: 2,
    image: "https://via.placeholder.com/50"
  },
  {
    id: 2,
    name: "Engine Oil",
    price: 28.5,
    quantity: 1,
    image: "https://via.placeholder.com/50"
  },
  {
    id: 3,
    name: "Air Filter",
    price: 15.75,
    quantity: 1,
    image: "https://via.placeholder.com/50"
  }
];

// Mock notifications
const notifications = [
  {
    id: 1,
    title: "Order Shipped",
    message: "Your brake pads order has been shipped",
    time: "2 hours ago",
    unread: true
  },
  {
    id: 2,
    title: "Price Drop Alert",
    message: "Engine oil now 20% off",
    time: "5 hours ago",
    unread: true
  },
  {
    id: 3,
    title: "Delivery Completed",
    message: "Your order has been delivered",
    time: "1 day ago",
    unread: false
  }
];

const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  user,
  searchQuery,
  onSearchChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchSuggestionsVisible, setSearchSuggestionsVisible] =
    useState(false);
  const [filteredSuggestions, setFilteredSuggestions] =
    useState(searchSuggestions);
  const [cartItemsState, setCartItemsState] = useState(cartItems);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [activeSection, setActiveSection] = useState("home");

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const ADMIN_EMAIL = "autonexuscarsolutions@gmail.com";

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchSuggestionsVisible(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter search suggestions based on query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchSuggestions.filter(
        (suggestion) =>
          suggestion.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          suggestion.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setSearchSuggestionsVisible(true);
    } else {
      setFilteredSuggestions(searchSuggestions);
      setSearchSuggestionsVisible(isSearchFocused);
    }
  }, [searchQuery, isSearchFocused]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onNavigate("login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(`[data-section="${sectionId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.querySelector(`[data-section="${sectionId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  const handleSearchSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setSearchSuggestionsVisible(false);
    setIsSearchFocused(false);
  };

  const updateCartQuantity = (id: number, change: number) => {
    setCartItemsState(
      (prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              const newQuantity = Math.max(0, item.quantity + change);
              return newQuantity === 0
                ? null
                : { ...item, quantity: newQuantity };
            }
            return item;
          })
          .filter(Boolean) as typeof cartItems
    );
  };

  const removeCartItem = (id: number) => {
    setCartItemsState((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cartItemsState.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartItemCount = cartItemsState.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const markNotificationAsRead = (id: number) => {
    const notification = notifications.find((n) => n.id === id);
    if (notification?.unread) {
      setUnreadNotifications((prev) => Math.max(0, prev - 1));
    }
  };

  const navItems = [
    {
      name: "Home",
      action: () => scrollToSection("home"),
      icon: Home,
      section: "home"
    },
    {
      name: "About",
      action: () => scrollToSection("about"),
      icon: Info,
      section: "about"
    },
    {
      name: "Featured",
      action: () => scrollToSection("miniproducts"),
      icon: ShoppingBag,
      section: "miniproducts"
    }
  ];

  // Add admin navigation if user is admin
  if (user?.email === ADMIN_EMAIL) {
    navItems.push({
      name: "Manage",
      action: () => scrollToSection("manage"),
      icon: Settings,
      section: "manage"
    });
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-2xl border-b border-slate-700/50 shadow-lg shadow-black/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <button
                onClick={() => scrollToSection("home")}
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-xl shadow-red-500/25 group-hover:shadow-red-500/40 transition-all duration-300 group-hover:scale-105">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-black text-white group-hover:text-red-400 transition-colors duration-300">
                    Auto<span className="text-red-400">Nexus</span>
                  </h1>
                  <span className="text-xs font-medium text-slate-400 -mt-1">
                    Car Solutions
                  </span>
                </div>
              </button>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center ml-12 space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.section;
                  return (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className={`relative group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-slate-800 text-red-400 shadow-md shadow-red-900/10 border border-slate-700"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? "text-red-400"
                            : "text-slate-400 group-hover:text-red-400"
                        }`}
                      />
                      {item.name}
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-1 bg-red-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Search Bar - Desktop */}
              <div className="hidden lg:block" ref={searchRef}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search auto parts..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setSearchSuggestionsVisible(true);
                    }}
                    className="block w-64 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-slate-800 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <kbd className="inline-flex items-center px-1.5 py-0.5 bg-slate-700 text-slate-400 text-xs rounded font-mono">
                      ⌘K
                    </kbd>
                  </div>
                </div>

                {/* Search Suggestions */}
                {searchSuggestionsVisible && (
                  <div className="absolute top-full mt-1 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-xl">
                    {searchQuery.trim() === "" && (
                      <div className="px-3 pb-2 border-b border-slate-700">
                        <p className="text-xs font-semibold text-slate-400 mb-1">
                          Recent Searches
                        </p>
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearchSuggestionClick(search)}
                            className="flex items-center w-full px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Clock className="w-3 h-3 mr-2 text-slate-500" />
                            {search}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="px-3">
                      <p className="text-xs font-semibold text-slate-400 mb-1">
                        {searchQuery.trim()
                          ? "Suggestions"
                          : "Popular Searches"}
                      </p>
                      {filteredSuggestions.slice(0, 6).map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() =>
                            handleSearchSuggestionClick(suggestion.text)
                          }
                          className="flex items-center justify-between w-full px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-700 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center">
                            <Search className="w-3 h-3 mr-2 text-slate-500 group-hover:text-red-500" />
                            <span>{suggestion.text}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500">
                              {suggestion.category}
                            </span>
                            {suggestion.popular && (
                              <TrendingUp className="w-2.5 h-2.5 text-red-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-800 transition-all duration-200 border border-slate-700/50"
                >
                  <img
                    className="w-8 h-8 rounded-lg border border-slate-700 shadow"
                    src={
                      user?.photoURL ||
                      `https://ui-avatars.com/api/?name=${user?.email}&background=ef4444&color=fff&rounded=true`
                    }
                    alt="Profile"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-white text-xs font-semibold">
                      {user?.displayName ||
                        user?.email?.split("@")[0] ||
                        "User"}
                    </p>
                    <p className="text-slate-400 text-[10px] truncate max-w-28">
                      {user?.email}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-4 z-50 backdrop-blur-xl">
                    <div className="px-4 pb-3 border-b border-slate-700">
                      <div className="flex items-center gap-3">
                        <img
                          className="w-12 h-12 rounded-lg border border-slate-700 shadow"
                          src={
                            user?.photoURL ||
                            `https://ui-avatars.com/api/?name=${user?.email}&background=ef4444&color=fff&rounded=true`
                          }
                          alt="Profile"
                        />
                        <div className="flex-1">
                          <p className="text-white font-bold text-sm">
                            {user?.displayName ||
                              user?.email?.split("@")[0] ||
                              "User"}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {user?.email}
                          </p>
                          {user?.email === ADMIN_EMAIL && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-900/50 text-red-400 border border-red-800/50 mt-1">
                              <Star className="w-2.5 h-2.5 mr-1" />
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      {[
                        {
                          icon: User,
                          title: "Profile Settings",
                          subtitle: "Manage your account"
                        },
                        {
                          icon: ShoppingBag,
                          title: "Order History",
                          subtitle: "View past purchases"
                        },
                        {
                          icon: Heart,
                          title: "Wishlist",
                          subtitle: "Saved items"
                        },
                        {
                          icon: MapPin,
                          title: "Addresses",
                          subtitle: "Delivery locations"
                        }
                      ].map((item, index) => (
                        <button
                          key={index}
                          className="flex items-center w-full px-4 py-2 text-slate-300 hover:bg-slate-700/50 transition-colors group"
                        >
                          <item.icon className="w-4 h-4 mr-3 text-slate-500 group-hover:text-red-400" />
                          <div className="text-left flex-1">
                            <div className="font-medium text-xs">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {item.subtitle}
                            </div>
                          </div>
                        </button>
                      ))}

                      <div className="border-t border-slate-700 mt-1 pt-1 mx-3">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-3 py-2 text-red-400 hover:bg-red-900/10 transition-colors rounded-lg group"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          <div className="text-left flex-1">
                            <div className="font-medium text-xs">Sign Out</div>
                            <div className="text-[10px] text-red-500/80">
                              See you later!
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Search auto parts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-slate-800"
              />
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden pb-4">
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.section;
                  return (
                    <button
                      key={item.name}
                      onClick={item.action}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 mb-1 ${
                        isActive
                          ? "bg-slate-700 text-red-400 border border-slate-600 shadow"
                          : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-red-400" : "text-slate-400"
                        }`}
                      />
                      {item.name}
                    </button>
                  );
                })}

                {/* Mobile Quick Actions */}
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <p className="text-slate-500 text-[10px] font-bold px-2 mb-2 uppercase tracking-wide">
                    Quick Actions
                  </p>

                  {[
                    {
                      icon: ShoppingCart,
                      title: "Shopping Cart",
                      count: cartItemCount
                    },
                    {
                      icon: Bell,
                      title: "Notifications",
                      count: unreadNotifications
                    },
                    { icon: Heart, title: "Wishlist", count: 0 },
                    { icon: User, title: "Profile", count: 0 }
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (item.title === "Shopping Cart") setIsCartOpen(true);
                        if (item.title === "Notifications")
                          setIsNotificationOpen(true);
                      }}
                      className="flex items-center justify-between w-full px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors mb-1"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span className="text-xs">{item.title}</span>
                      </div>
                      {item.count > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Mobile Sign Out */}
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:bg-red-900/10 transition-colors rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Backdrop for closing dropdowns */}
      {(isProfileOpen ||
        isMenuOpen ||
        isCartOpen ||
        isNotificationOpen ||
        searchSuggestionsVisible) && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => {
            setIsProfileOpen(false);
            setIsMenuOpen(false);
            setIsCartOpen(false);
            setIsNotificationOpen(false);
            setSearchSuggestionsVisible(false);
            setIsSearchFocused(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
