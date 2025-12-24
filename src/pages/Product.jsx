import { NavLink, useParams } from "react-router-dom";
import book from "../assets/photos/book.jpg";
import coding from "../assets/photos/coding.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

const allProducts = [
  { id: 1, image: book, price: 400, category: "brands" },
  { id: 6, image: book, price: 400, category: "brands" },
  { id: 5, image: coding, price: 400, category: "brands" },
  { id: 7, image: coding, price: 400, category: "brands" },
  { id: 9, image: coding, price: 400, category: "brands" },
  { id: 8, image: coding, price: 400, category: "brands" },
  { id: 10, image: coding, price: 400, category: "brands" },
  { id: 2, image: coding, price: 500, category: "motiondesigns" },
  { id: 3, image: book, price: 350, category: "marketingdesigns" },
  { id: 4, image: coding, price: 600, category: "poster" },
];

function Product() {
  const { category } = useParams();

  const navLinkStyle = ({ isActive }) =>
    `pb-2 transition-all duration-300 border-b-2 ${
      isActive ? "text-secondary border-secondary font-bold" : "text-gray-500 border-transparent hover:text-primary"
    }`;

  const filteredProducts = category 
    ? allProducts.filter((p) => p.category === category) 
    : allProducts;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* Header Section */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-bold text-primary mb-2">Product Templates</h2>
        <p className="text-gray-500">Premium design assets for your creative projects</p>
      </div>

      {/* Category Navigation */}
      <nav className="sticky top-[70px] bg-white/90 backdrop-blur-md z-30 py-4 mb-8 border-b border-gray-100">
        <ul className="flex items-center justify-center gap-6 md:gap-10 overflow-x-auto whitespace-nowrap scrollbar-hide px-2">
          <li><NavLink to="/product" end className={navLinkStyle}>All</NavLink></li>
          <li><NavLink to="/product/brands" className={navLinkStyle}>Brands</NavLink></li>
          <li><NavLink to="/product/motiondesigns" className={navLinkStyle}>Motion</NavLink></li>
          <li><NavLink to="/product/marketingdesigns" className={navLinkStyle}>Marketing</NavLink></li>
          <li><NavLink to="/product/poster" className={navLinkStyle}>Posters</NavLink></li>
        </ul>
      </nav>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                src={product.image} 
                alt={product.category} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 left-3 bg-secondary/80 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                {product.category.replace('designs', '')}
              </div>
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col justify-between flex-grow">
              <div className="mb-4">
                <h4 className="text-secondary font-bold text-lg">Premium Asset #{product.id}</h4>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-extrabold text-primary">
                  <span className="text-sm font-normal text-gray-400 mr-1">KES</span>
                  {product.price}
                </span>
                
                <button className="bg-primary text-white p-3 rounded-xl hover:bg-secondary transition-colors shadow-md shadow-primary/10">
                  <FontAwesomeIcon icon={faCartPlus} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-xl italic">No templates found in this category yet.</p>
        </div>
      )}
    </div>
  );
}

export default Product;
