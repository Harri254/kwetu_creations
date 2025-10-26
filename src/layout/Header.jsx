import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import image from "../assets/KwetuLogo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menu = isOpen ? "block" : "hidden";
  const navLinkStyle = ({ isActive }) =>
  isActive ? "sm:text-secondary" : "sm:text-white";

  return (
    <header className="w-full h-15 bg-primary flex items-center">
      <div className="w-[50%] flex items-center">
          <img src={image} alt="kwetu logo" className="w-60" />
      </div>

      <button
        className={`ml-auto mr-3 text-secondary text-4xl sm:hidden`}
        onClick={() =>setIsOpen(prev=>!prev)}
        aria-expanded={isOpen}
        aria-controls="main-nav"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      <nav id="main-nav" className={`${menu} absolute right-0 top-15 bg-secondary w-[40%] h-[10rem] sm:block sm:w-[60%] sm:relative sm:bg-inherit sm:h-5 sm:top-0  sm:ml-auto  z-40 lg:w-[35%] rounded-xl`}>
        <ul className="flex flex-col sm:flex-row items-center h-[100%] text-[1.4rem] sm:text-white">
          <li onClick={()=>setIsOpen(false)} className="hover:bg-primary w-full flex justify-center items-center hover:text-white h-[25%] md:h-fit rounded-[0.6rem]"><NavLink to="/" className={navLinkStyle}>Home</NavLink></li>
          <li onClick={()=>setIsOpen(false)} className="hover:bg-primary w-full flex justify-center items-center hover:text-white h-[25%] md:h-fit rounded-[0.6rem]"><NavLink to="/about" className={navLinkStyle}>About</NavLink></li>
          <li onClick={()=>setIsOpen(false)} className="hover:bg-primary w-full flex justify-center items-center hover:text-white h-[25%] md:h-fit rounded-[0.6rem]"><NavLink to="/product" className={navLinkStyle}>Product</NavLink></li>
          <li onClick={()=>setIsOpen(false)} className="hover:bg-primary w-full flex justify-center items-center hover:text-white h-[25%] md:h-fit rounded-[0.6rem]"><NavLink to="/contact" className={navLinkStyle}>Contact</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
