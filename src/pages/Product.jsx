import { NavLink, useParams } from "react-router-dom";
import { useState } from "react";
import "./Product.css";
import book from "../assets/photos/output.jpg";
import coding from "../assets/photos/coding.jpg";

const all = [
  { id: 1, image: book, price: 400, category: "brands" },
  { id: 6, image: book, price: 400, category: "brands" },
  { id: 5, image: coding, price: 400, category: "brands" },
  { id: 2, image: coding, price: 500, category: "motiondesigns" },
  { id: 3, image: book, price: 350, category: "marketingdesigns" },
  { id: 4, image: coding, price: 600, category: "poster" },
];

function Product() {
  const { category } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const navLinkstyle = ({ isActive }) =>
    isActive ? "active-link" : "inactive-link";

  const sortedCategory = category
    ? all.filter((product) => product.category === category)
    : all;

  return (
    <div className="product">
      <h2 className="template-heading">Product Templates</h2>

      <div className="pr-cont">
        {/* ✅ Mobile Dropdown */}
        <div className="dropdown-container">
          <button
            className="dropdown-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            {category ? category : "Select Category ▾"}
          </button>

          {isOpen && (
            <ul className="dropdown-menu">
              <li>
                <NavLink
                  to="/product"
                  end
                  className={navLinkstyle}
                  onClick={() => setIsOpen(false)}
                >
                  All
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product/brands"
                  className={navLinkstyle}
                  onClick={() => setIsOpen(false)}
                >
                  Brands
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product/motiondesigns"
                  className={navLinkstyle}
                  onClick={() => setIsOpen(false)}
                >
                  Motion Designs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product/marketingdesigns"
                  className={navLinkstyle}
                  onClick={() => setIsOpen(false)}
                >
                  Marketing Designs
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/product/poster"
                  className={navLinkstyle}
                  onClick={() => setIsOpen(false)}
                >
                  Posters
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        {/* ✅ Desktop Nav */}
        <nav className="nav-cont">
          <ul className="pr-nav-list">
            <li>
              <NavLink to="/product" end className={navLinkstyle}>
                All
              </NavLink>
            </li>
            <li>
              <NavLink to="/product/brands" className={navLinkstyle}>
                Brands
              </NavLink>
            </li>
            <li>
              <NavLink to="/product/motiondesigns" className={navLinkstyle}>
                Motion Designs
              </NavLink>
            </li>
            <li>
              <NavLink to="/product/marketingdesigns" className={navLinkstyle}>
                Marketing Designs
              </NavLink>
            </li>
            <li>
              <NavLink to="/product/poster" className={navLinkstyle}>
                Posters
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* ✅ Product Grid */}
        <div className="temp-holder">
          {sortedCategory.map((product) => (
            <div className="temp-card" key={product.id}>
              <div>
                <img src={product.image} alt={product.category} />
                <div className="price">
                  <p>
                    Kshs. <span>{product.price}</span>
                  </p>
                  <button>Buy</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;
