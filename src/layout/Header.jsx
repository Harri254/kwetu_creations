import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import image from "../assets/KwetuLogo.svg";
import "./Header.css";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

const navLinkStyle = ({ isActive }) =>
  isActive ? "active-link" : "non-active-link";

  const handleLinkClick = () => {
    setIsOpen(false); // close menu after click
  };

  return (
    <header className="top-nav">
      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <img src={image} alt="kwetu logo" onClick={handleLinkClick}/>
        </Link>
      </div>

      {/* Hamburger (mobile only) */}
      <button
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Navigation */}
      <nav className={isOpen ? "nav-menu open" : "nav-menu"}>
        <ul>
          <NavLink to="/" className={navLinkStyle} onClick={handleLinkClick}>
            <li>Home</li>
          </NavLink>
          <NavLink to="/about" className={navLinkStyle} onClick={handleLinkClick}>
            <li>About</li>
          </NavLink>
          <NavLink to="/product" className={navLinkStyle} onClick={handleLinkClick}>
            <li>Product</li>
          </NavLink>
          {/* <NavLink to="/services" className={navLinkStyle} onClick={handleLinkClick}>
            <li>Services</li>
          </NavLink> */}
          <NavLink to="/contact" className={navLinkStyle} onClick={handleLinkClick}>
            <li>Contact</li>
          </NavLink>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
