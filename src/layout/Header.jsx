import { useState, useEffect } from "react";
import { NavLink, Link, Links } from "react-router-dom";
import image from "../assets/KwetuLogo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menu = isOpen ? "block" : "hidden";
  const overlay = isOpen ? "fixed inset-0 bg-opacity-50 z-30" : "hidden";
  const navLinkStyle = ({ isActive }) =>
    isActive ? "sm:text-secondary" : "sm:text-white";

  // Add useEffect to handle body overflow
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <div className={overlay} onClick={() => setIsOpen(false)}></div>
      <header className="w-screen h-15 bg-primary flex items-center relative">
        <div className="w-[30%] flex items-center">
            <img src={image} alt="kwetu logo" className="w-60" />
        </div>

        <button className="text-white hover:text-secondary text-xl min-w-[6rem] p-1 px-3 rounded-[0.5rem] ml-auto font-medium"><Link to="/logIn">Sign In</Link></button>

        <button
          className={`ml-auto mr-3 text-secondary text-4xl sm:hidden w-fit`}
          onClick={() =>setIsOpen(prev=>!prev)}
          aria-expanded={isOpen}
          aria-controls="main-nav"
        >
          <FontAwesomeIcon icon={faBars} className="w-fit"/>
        </button>
        <nav id="main-nav" className={`${menu} fixed right-0 top-15 bg-amber-500 w-fit h-fit sm:items-center sm:justify-center sm:w-[70%] sm:relative sm:bg-inherit sm:top-0 sm:ml-auto z-40 lg:w-[35%] rounded-xl sm:h-fit sm:flex`}>
          <ul className="flex flex-col sm:flex-row items-center sm:justify-around h-[100%] text-[1.4rem] sm:text-white sm:gap-4 sm:w-fit sm:ml-auto sm:mr-6">
            <li onClick={()=>setIsOpen(false)} className="hover:bg-primary w-full flex py-1.5 px-16 sm:px-2 justify-center items-center hover:text-white h-fit md:h-fit rounded-[0.6rem]"><NavLink to="/" className={navLinkStyle}>Home</NavLink></li>
            <li onClick={()=>setIsOpen(false)} className="hover:bg-primary w-full flex py-1.5 px-16 sm:px-2 justify-center items-center hover:text-white h-fit md:h-fit rounded-[0.6rem]"><NavLink to="/about" className={navLinkStyle}>About</NavLink></li>
            <li onClick={()=>setIsOpen(false)} className="hover:bg-primary w-full flex py-1.5 px-16 sm:px-2 justify-center items-center hover:text-white h-fit md:h-fit rounded-[0.6rem]"><NavLink to="/product" className={navLinkStyle}>Product</NavLink></li>
            <li onClick={()=>setIsOpen(false)} className="hover:bg-primary w-full flex py-1.5 pb-2 px-16 sm:px-2 justify-center items-center hover:text-white h-fit md:h-fit rounded-[0.6rem]"><NavLink to="/contact" className={navLinkStyle}>Contact</NavLink></li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Header;
