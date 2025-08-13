import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase/config";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Screens/login";
import Signup from "./Screens/signup";
import Home from "./Screens/home";
import About from "./Screens/about";
import Navbar from "./Components/Navbar";
import Footer from "./Components/footer";
import MiniProducts from "./Screens/minproducts";
import Products from "./Screens/products";
import Manage from "./Screens/AdminProductManager";

type Screen = "login" | "signup";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const ADMIN_EMAIL = "autonexuscarsolutions@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user) setCurrentScreen("login");
    });
    return () => unsubscribe();
  }, []);

  // Show loader while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Auto<span className="text-red-600">Nexus</span>
          </h2>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/signup only if user is not logged in
  if (!user) {
    return (
      <div>
        {currentScreen === "login" && <Login onNavigate={setCurrentScreen} />}
        {currentScreen === "signup" && <Signup onNavigate={setCurrentScreen} />}
      </div>
    );
  }

  // User is logged in: show app
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar
        onNavigate={setCurrentScreen}
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div data-section="home">
                <Home user={user} searchQuery={searchQuery} />
              </div>
              <div data-section="about">
                <About />
              </div>
              <div data-section="miniproducts">
                <MiniProducts />
              </div>
              {/* Admin only section */}
              {user.email === ADMIN_EMAIL && (
                <div data-section="manage">
                  <Manage user={user} />
                </div>
              )}
            </div>
          }
        />

        {/* Products page accessible to logged-in users */}
        <Route path="/products" element={<Products />} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
