import { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { PRODUCT_CATEGORIES } from "../constants/categories";
import { apiRequest, toMediaUrl } from "../lib/api";
import { useCart } from "../hooks/useCart";

function Product() {
  const { category } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError("");

    const query = category ? `/api/products?category=${category}` : "/api/products";
    apiRequest(query)
      .then((payload) => {
        if (isMounted) {
          setProducts(payload.products);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [category]);

  const heading = useMemo(() => {
    const currentCategory = PRODUCT_CATEGORIES.find((item) => item.value === category);
    return currentCategory?.label || "Product Templates";
  }, [category]);

  const navLinkStyle = ({ isActive }) =>
    `pb-2 transition-all duration-300 border-b-2 ${
      isActive ? "text-secondary border-secondary font-bold" : "text-gray-500 border-transparent hover:text-primary"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-bold text-primary mb-2">{heading}</h2>
        <p className="text-gray-500">Premium design assets and custom creative services published from the live catalogue.</p>
      </div>

      <nav className="sticky top-[60px] bg-white/90 backdrop-blur-md z-30 py-4 mb-8 border-b border-gray-100">
        <ul className="flex items-center justify-center gap-6 md:gap-10 overflow-x-auto flex-wrap whitespace-nowrap px-2">
          <li><NavLink to="/product" end className={navLinkStyle}>All</NavLink></li>
          {PRODUCT_CATEGORIES.map((item) => (
            <li key={item.value}>
              <NavLink to={`/product/${item.value}`} className={navLinkStyle}>{item.label}</NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {isLoading ? (
        <div className="text-center py-20 text-primary">Loading catalogue...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl italic">No templates found in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={toMediaUrl(product.imageUrl)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-secondary/80 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                  {product.category}
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow">
                <div className="mb-4">
                  <h4 className="text-secondary font-bold text-lg">{product.name}</h4>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-3">{product.description || "Creative product ready for your next campaign."}</p>
                </div>

                <div className="flex items-center justify-between mt-auto gap-3">
                  <span className="text-2xl font-extrabold text-primary">
                    <span className="text-sm font-normal text-gray-400 mr-1">KES</span>
                    {product.price}/=
                  </span>

                  <button
                    onClick={() => addToCart(product)}
                    className="bg-primary text-white p-3 rounded-xl hover:bg-secondary transition-colors shadow-md shadow-primary/10"
                  >
                    <FontAwesomeIcon icon={faCartPlus} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Product;
