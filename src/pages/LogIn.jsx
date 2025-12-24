import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { mockUsers } from "../context/mockUsers";

function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate a slight delay for better UX
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        setError("Invalid username or password. Please try again.");
        setLoading(false);
        return; // Stop execution here if no user found
      }

      // Safe to check role now
      if (user.role === "admin") {
        navigate("/owner");
      } else {
        navigate("/", { replace: true });
      }
      setLoading(false);
    }, 800);
  };

  const inputClasses = "w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-primary text-base md:text-lg";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
      
      {/* Branding Header */}
      <div className="text-center mb-8">
        <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary text-2xl">
          <FontAwesomeIcon icon={faLock} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Log in to manage your KwetuCreations account</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-6 border border-gray-100"
      >
        {/* Username field */}
        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-primary mb-1 ml-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            className={inputClasses}
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password field */}
        <div>
          <div className="flex justify-between items-center mb-1 ml-1">
            <label htmlFor="password" className="block text-sm font-semibold text-primary">
              Password
            </label>
            <button type="button" className="text-xs text-secondary hover:underline font-medium">
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              className={inputClasses}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary p-1"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-secondary hover:bg-opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-secondary/20 transition-all transform active:scale-95 ${loading ? "opacity-70 cursor-wait" : ""}`}
        >
          {loading ? "Authenticating..." : "Log In"}
        </button>

        <p className="text-center text-gray-600 mt-6">
          New here?{" "}
          <Link
            to="/createAccount"
            className="text-secondary font-bold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LogIn;