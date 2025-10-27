import { NavLink, useParams } from "react-router-dom";
import book from "../assets/photos/output.jpg";
import coding from "../assets/photos/coding.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const all = [
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
  // const [isOpen, setIsOpen] = useState(false);

const navLinkstyle = ({ isActive }) =>
  isActive ? "text-secondary" : "text-black";

  const sortedCategory = category ? all.filter((product) => product.category === category) : all;

  return (
    <div className="flex flex-col h-full my-2 mb-8">
      <h2 className="text-2xl text-gray-950 font-medium my-2 ml-2 md:text-4xl">Product Templates</h2>
      <hr className="text-amber-500"/>
      <div className="flex flex-col">
        <ul className="flex flex-row items-center flex-wrap text-xl justify-around gap-x-8 mx-1.5 xl:w-[50%] xl:mx-auto">
          <li>
            <NavLink to="/product" end className={navLinkstyle}>
              All
            </NavLink>
          </li>
          <li>
            <NavLink to="/product/brands" className={navLinkstyle} >
              Brands
            </NavLink>
          </li>
          <li>
            <NavLink to="/product/motiondesigns" className={navLinkstyle} >
              Motion 
            </NavLink>
          </li>
          <li>
            <NavLink to="/product/marketingdesigns"className={navLinkstyle} >
              Marketing
            </NavLink>
          </li>
          <li>
            <NavLink to="/product/poster" className={navLinkstyle} >
              Posters
            </NavLink>
          </li>
        </ul>
        <div className="w-full flex flex-col items-center justify-center mt-2 gap-2 sm:flex-row flex-wrap md:gap-6">
          {sortedCategory.map((product) => (
            <div className="w-[90%] max-w-[400px] h-[20rem] flex flex-col items-center justify-around border-2 rounded-xl border-primary sm:w-[30%] md:w-[23%] hover:scale-[0.98] md:max-w-[500px] md:h-[24rem]" key={product.id}>
              <img src={product.image} alt={product.category} className="h-[88%] w-full max-w-[400px] rounded-t-[0.63rem] md:max-w-[500px]"/>
              <div className="h-[12%] flex items-center justify-between w-[90%] mx-auto ">
                <p>
                  Kshs. <span>{product.price}</span>
                </p>
                <button className="text-[1.2rem] text-white bg-primary h-[80%] px-[1.2rem] rounded-2xl hover:cursor-pointer">Add <FontAwesomeIcon icon={["fas", "fa-cart-shopping"]} className="fa-xs"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;
