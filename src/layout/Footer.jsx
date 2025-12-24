import { NavLink, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Footer() {
  const year = new Date().getFullYear();

  const navLinkStyle = ({ isActive }) =>
    `transition-colors duration-300 ${isActive ? "text-secondary font-semibold" : "text-tertiary hover:text-secondary"}`;

  return (
    <footer className="w-full bg-primary text-white pt-10 pb-6 mt-auto !lg:text-4xl">
      <div className="container mx-auto px-6 md:w-[50%] md:mx-auto ">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-white/10 pb-8 ">
          {/* 2. Navigation Links */}
          <nav>
            <ul className="flex flex-wrap justify-center gap-6 md:gap-8 text-lg">
              <li><NavLink to="/" className={navLinkStyle}>Home</NavLink></li>
              <li><NavLink to="/about" className={navLinkStyle}>About</NavLink></li>
              <li><NavLink to="/product" className={navLinkStyle}>Product</NavLink></li>
              <li><NavLink to="/contact" className={navLinkStyle}>Contact</NavLink></li>
            </ul>
          </nav>

          {/* 3. Social Media Icons */}
          <div className="flex justify-center md:justify-end gap-6 text-2xl">
            <a href="http://www.github.com/harri254/" className="hover:text-secondary transition-transform hover:-translate-y-1" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={['fab', 'github']} />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://web.facebook.com/katu.theman" className="hover:text-secondary transition-transform hover:-translate-y-1" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={['fab', 'facebook']} />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://x.com/katutheman/" className="hover:text-secondary transition-transform hover:-translate-y-1" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={['fab', 'twitter']} />
              <span className="sr-only">X</span>
            </a>
            <a href="https://www.instagram.com/katu_the.man/" className="hover:text-secondary transition-transform hover:-translate-y-1" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={['fab', 'instagram']} />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>

        {/* Bottom Section: Sign In & Copyright */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link 
            to="/logIn" 
            className="text-white border border-white/30 px-6 py-2 rounded-full hover:bg-secondary hover:border-secondary transition-all"
          >
            Sign In
          </Link>
          
          <p className="text-sm text-gray-400 text-center">
            &copy; {year} <span className="text-white font-medium">Kwetu Creations</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;