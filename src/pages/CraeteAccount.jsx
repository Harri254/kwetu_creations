import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    setError("");
    alert("✅ Account created successfully!");
    // Logic to send data to your backend would go here
  };

  const inputClasses = "w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
      
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary text-2xl">
          <FontAwesomeIcon icon={faUserPlus} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Create an Account</h1>
        <p className="text-gray-500 mt-2">Join KwetuCreations and start your journey</p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-5 border border-gray-100"
      >
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1 ml-1">Full Name</label>
          <input 
            type="text" 
            name="fullname" 
            placeholder="Jane Doe"
            className={inputClasses}
            required 
            autoFocus 
            value={formData.fullname}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1 ml-1">Email Address</label>
          <input 
            type="email" 
            name="email" 
            placeholder="jane@example.com"
            className={inputClasses}
            required 
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1 ml-1">Create Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className={inputClasses}
              required
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1 ml-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="••••••••"
              className={inputClasses}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-secondary hover:bg-opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-secondary/20 transition-all transform active:scale-95 mt-4"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/logIn" className="text-secondary font-bold hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default CreateAccount;