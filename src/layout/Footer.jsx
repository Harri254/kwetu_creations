import { NavLink, Link } from 'react-router-dom';
import image from '../assets/KwetuLogo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Footer() {
  const year = new Date().getFullYear();

  const navLinkStyle = ({ isActive }) =>
  isActive ? "text-secondary" : "text-white";

  return (
    <div className="w-full bg-primary sm:h-[10rem] md:h-[20rem] md:w-full bottom-0">
      <div className="w-full sm:flex sm:h-[8rem] md:h-[16rem]">
        <div className="hidden sm:w-[40%] sm:h-[6rem] sm:flex justify-items-end-safe md:w-[32%]">
            <img src={image} alt="kwetu logo" className="sm:h-[10rem] w-full md:h-[15rem]" />
        </div>
        <div className="flex flex-col w-full sm:w-[60%] sm:h-[5rem] sm:my-auto md:flex-row md:h-[14rem] md:w-[68%]">
          <ul className="flex h-10 items-center justify-between w-[70%] mx-auto text-[16px] sm:w-[70%] md:flex-col md:h-[10rem] md:my-auto md:w-[30%] md:text-2xl md:mx-6">
            <li>
              <NavLink to="/" className={navLinkStyle}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navLinkStyle}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/product" className={navLinkStyle}>
                Product
              </NavLink>
            </li>
            {/* <li>
              <NavLink to="/services" className={navLinkStyle}>
                Services
              </NavLink>
            </li> */}
            <li>
              <NavLink to="/contact" className={navLinkStyle}>
                Contact
              </NavLink>
            </li>
          </ul>
          <div className="text-white flex justify-around w-[60%] mx-auto text-[1.6rem] sm:w-[60%] md:items-center md:text-4xl md:w-[40%] md:mx-0 md:ml-4 md:mr-auto">
            <a href="http://www.github.com/harri254/" className="hover:text-secondary">
              <FontAwesomeIcon icon={['fab', 'github']} />{' '}
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://web.facebook.com/katu.theman" className="hover:text-secondary">
              <FontAwesomeIcon icon={['fab', 'facebook']} />{' '}
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://x.com/katutheman/" className="hover:text-secondary">
              <FontAwesomeIcon icon={['fab', 'twitter']} />{' '}
              <span className="sr-only">X(Twitter)</span>
            </a>
            <a href="https://www.instagram.com/katu_the.man/" className="hover:text-secondary">
              <FontAwesomeIcon icon={['fab', 'instagram']} />{' '}
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-white ">
        <p className="!m-0 !text-[1.1rem] ">&copy; {year} Kwetu Creations. All rights reserved </p>
      </div>
    </div>
  );
}

export default Footer;
