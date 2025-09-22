import { NavLink, Link } from 'react-router-dom';
import './Footer.css';
import image from '../assets/KwetuArtwork.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Footer() {
  const year = new Date().getFullYear();

  const navLinkStyle = ({ isActive }) =>
  isActive ? "active-link" : "non-active-link";

  return (
    <div className="footer">
      <div className="last">
        <div className="links">
          {/* Logo */}
          <Link to="/">
            <div className="img-container">
              <img src={image} alt="kwetu logo" className="logo-img" />
            </div>
          </Link>
        </div>
        <div className="links-throughs">
          <ul className='footer-nav-links'>
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
          <div className="social-media-links">
            <a href="http://www.github.com/harri254/">
              <FontAwesomeIcon icon={['fab', 'github']} />{' '}
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://web.facebook.com/katu.theman">
              <FontAwesomeIcon icon={['fab', 'facebook']} />{' '}
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://x.com/katutheman/">
              <FontAwesomeIcon icon={['fab', 'twitter']} />{' '}
              <span className="sr-only">X(Twitter)</span>
            </a>
            <a href="https://www.instagram.com/katu_the.man/">
              <FontAwesomeIcon icon={['fab', 'instagram']} />{' '}
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="cr">
        <p>&copy; {year} Kwetu Creations. All rights reserved </p>
      </div>
    </div>
  );
}

export default Footer;
