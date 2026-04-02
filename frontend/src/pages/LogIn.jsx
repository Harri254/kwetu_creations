import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({ email, password });
      const nextPath = location.state?.from?.pathname || (user.role === "admin" ? "/owner" : "/");
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-primary text-base md:text-lg";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
      <div className="text-center mb-8">
        <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary text-2xl">
          <FontAwesomeIcon icon={faLock} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Log in to manage your account or continue to checkout.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-6 border border-gray-100">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-primary mb-1 ml-1">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className={inputClasses}
            required
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-primary mb-1 ml-1">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              className={inputClasses}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary p-1"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center font-medium">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-secondary hover:bg-opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-secondary/20 transition-all transform active:scale-95 ${loading ? "opacity-70 cursor-wait" : ""}`}
        >
          {loading ? "Authenticating..." : "Log In"}
        </button>

        {/* <div className="text-sm text-center text-primary/70 rounded-2xl bg-primary/5 p-4">
          <p className="font-semibold">Starter admin account</p>
          <p>`admin@kwetu.local` / `Admin@12345`</p>
          <p className="mt-2 text-xs">Replace these defaults with your own environment values before production use.</p>
        </div> */}

        <p className="text-center text-gray-600 mt-6">
          New here?{" "}
          <Link to="/createAccount" className="text-secondary font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LogIn;
