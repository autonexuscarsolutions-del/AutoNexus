import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
// Import your video
import bgVideo from "../assets/vecteezy_3d-rendered-super-car-cinematic-front-view-in-dark_34634291.mp4";

interface LoginProps {
  onNavigate: (screen: "login" | "signup" | "home") => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Login successful:", userCredential.user);
      onNavigate("home");
    } catch (error: any) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");
    setResetSuccess("");

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess("Password reset email sent! Check your inbox.");
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSuccess("");
        setResetEmail("");
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address");
      } else {
        setError("Failed to send password reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google login successful:", result.user);
      onNavigate("home");
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative max-w-md w-full space-y-3 mb-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="mt-4">
            <h1
              className="text-[150px]  text-white "
              style={{ fontFamily: "Magenta, Arial Black, sans-serif" }}
            >
              Auto<span className="text-red-600">nexus</span>
            </h1>
          </h2>
          <p className="text-slate-300">
            {showForgotPassword
              ? "Reset your password"
              : "Sign in to your account"}
          </p>
        </div>

        <div className="bg-slate-800/80 backdrop-blur-md p-8 rounded-lg shadow-lg">
          {showForgotPassword ? (
            // Forgot Password Form
            <form onSubmit={handleForgotPassword} className="space-y-6">
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              {resetSuccess && (
                <div className="bg-green-900/50 border border-green-500 text-green-300 px-4 py-3 rounded">
                  {resetSuccess}
                </div>
              )}
              <div>
                <label
                  htmlFor="resetEmail"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="resetEmail"
                  name="resetEmail"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-3 border border-slate-600 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Reset Email"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError("");
                    setResetSuccess("");
                    setResetEmail("");
                  }}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-md transition duration-300"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleEmailLogin} className="space-y-6">
                {error && (
                  <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-3 border border-slate-600 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 border border-slate-600 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-600 rounded bg-slate-700"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-slate-300"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-800 text-slate-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full mt-4 bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-md border border-gray-300 flex items-center justify-center space-x-2 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-slate-400">
                  Don't have an account?{" "}
                  <button
                    onClick={() => onNavigate("signup")}
                    className="text-red-500 hover:text-red-400 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
