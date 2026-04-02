import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import image from "../assets/KwetuLogo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCartShopping, faRightFromBracket, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemsCount } = useCart();

  const navLinkStyle = ({ isActive }) =>
    `hover:text-secondary transition-colors duration-300 ${
      isActive ? "text-secondary font-bold" : "text-white"
    }`;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Reduced vertical padding (py-1 or py-2) */}
      <header className="bg-primary text-white py-1 px-4 sticky top-0 z-50 shadow-md h-[4rem] overflow-hidden md:h-[6rem] md:text-xl">
        <div className="container mx-auto flex justify-between items-center mt-[-1.2em] md:mt-[-1.8em]">
          
          {/* Enhanced Logo visibility for large screens */}
          <Link to="/" className="flex items-center">
            <img 
              src={image} 
              alt="kwetu logo" 
              className="w-24 md:w-40 object-cover transition-all duration-300" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <NavLink to="/" className={navLinkStyle}>Home</NavLink>
            <NavLink to="/about" className={navLinkStyle}>About</NavLink>
            <NavLink to="/product" className={navLinkStyle}>Product</NavLink>
            <NavLink to="/contact" className={navLinkStyle}>Contact</NavLink>
            {isAuthenticated && (
              <NavLink to="/orders" className={navLinkStyle}>Orders</NavLink>
            )}
            <Link to="/cart" className="relative text-white hover:text-secondary transition-colors">
              <FontAwesomeIcon icon={faCartShopping} />
              {itemsCount > 0 && (
                <span className="absolute -top-3 -right-3 text-xs bg-secondary text-white rounded-full min-w-5 h-5 px-1 grid place-items-center">
                  {itemsCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.role === "admin" && (
                  <Link to="/owner" className="text-white hover:text-secondary transition-colors">
                    Dashboard
                  </Link>
                )}
                <button onClick={logout} className="bg-secondary px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition">
                  <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                  {user?.name?.split(" ")[0] || "Sign Out"}
                </button>
              </div>
            ) : (
              <Link to="/logIn" className="bg-secondary px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition">
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile UI */}
          <div className="md:hidden flex items-center gap-4">
             <Link to="/cart" className="relative text-white">
               <FontAwesomeIcon icon={faCartShopping} />
               {itemsCount > 0 && (
                 <span className="absolute -top-3 -right-3 text-[10px] bg-secondary text-white rounded-full min-w-4 h-4 px-1 grid place-items-center">
                   {itemsCount}
                 </span>
               )}
             </Link>
             <Link to={isAuthenticated ? (user?.role === "admin" ? "/owner" : "/orders") : "/logIn"} className="text-sm border border-white px-3 py-1 rounded">
               {isAuthenticated ? "Account" : "Sign In"}
             </Link>
             <button
                className="text-2xl focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
              </button>
          </div>
        </div>

        {/* Sidebar */}
        <nav 
          className={`fixed top-0 right-0 h-fit rounded-b-2xl w-40 bg-primary shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 flex flex-col space-y-6">
            <NavLink onClick={() => setIsOpen(false)} to="/" className={navLinkStyle}>Home</NavLink>
            <NavLink onClick={() => setIsOpen(false)} to="/about" className={navLinkStyle}>About</NavLink>
            <NavLink onClick={() => setIsOpen(false)} to="/product" className={navLinkStyle}>Product</NavLink>
            <NavLink onClick={() => setIsOpen(false)} to="/contact" className={navLinkStyle}>Contact</NavLink>
            {isAuthenticated && (
              <NavLink onClick={() => setIsOpen(false)} to="/orders" className={navLinkStyle}>Orders</NavLink>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <NavLink onClick={() => setIsOpen(false)} to="/owner" className={navLinkStyle}>Dashboard</NavLink>
            )}
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-left text-white"
              >
                Sign Out
              </button>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
