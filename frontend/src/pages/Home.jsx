import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { apiRequest, toMediaUrl } from "../lib/api";
import { PRODUCT_CATEGORIES } from "../constants/categories";
import { useCart } from "../hooks/useCart";

const categoryTone = {
  latest: "from-[#F6E6D8] to-white",
  products: "from-[#DBE9F2] to-white",
  services: "from-[#E6EFE4] to-white",
};

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiRequest("/api/products/homepage")
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
  }, []);

  const grouped = PRODUCT_CATEGORIES.map((category) => ({
    ...category,
    items: products.filter((product) => product.category === category.value).slice(0, 3),
  }));

  return (
    <main className="bg-[#f5f1ea]">
      {isLoading ? (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 text-center text-primary">Loading the latest work...</div>
      ) : error ? (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 text-center text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
          <div className="rounded-[2rem] border border-dashed border-primary/20 bg-white px-8 py-16 text-center">
            <h2 className="text-3xl font-bold text-primary">Your catalogue is ready for real products.</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              There are no published items yet. Use the admin dashboard to upload product artwork and start selling.
            </p>
            <div className="mt-6 flex justify-center">
              <Link to="/owner" className="bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
                Open dashboard
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12">
          <div className="space-y-8">
            {grouped.map((section) => (
              <CategoryPanel key={section.value} section={section} navigate={navigate} addToCart={addToCart} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function CategoryPanel({ section, navigate, addToCart }) {
  const displayItems = [...section.items];

  while (displayItems.length < 3) {
    displayItems.push({
      id: `placeholder-${section.value}-${displayItems.length}`,
      isPlaceholder: true,
    });
  }

  return (
    <section className={`rounded-[2rem] border border-black/5 bg-gradient-to-r ${categoryTone[section.value]} p-5 md:p-6 shadow-[0_18px_40px_rgba(7,46,74,0.05)]`}>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="uppercase tracking-[0.28em] text-xs text-secondary mb-2">{section.value}</p>
          <h3 className="text-2xl md:text-3xl font-black text-primary">{section.label}</h3>
        </div>
        <Link to={`/product/${section.value}`} className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
          Open
        </Link>
      </div>

      {section.items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {displayItems.map((item) =>
            item.isPlaceholder ? (
              <article
                key={item.id}
                className="flex min-h-[19rem] flex-col justify-center rounded-[1.6rem] border border-dashed border-primary/15 bg-white/70 p-6 text-center shadow-[0_14px_30px_rgba(7,46,74,0.03)]"
              >
                <p className="text-sm uppercase tracking-[0.24em] text-secondary/70">Coming soon</p>
                <p className="mt-4 text-xl font-black text-primary">More work in {section.label}</p>
                <p className="mt-3 text-sm leading-7 text-gray-500">
                  This shelf will automatically fill out as more items are published in the dashboard.
                </p>
              </article>
            ) : (
              <article
                key={item.id}
                className="overflow-hidden rounded-[1.6rem] shadow-[0_14px_30px_rgba(7,46,74,0.04)] transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/product/item/${item.slug}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/product/item/${item.slug}`);
                  }
                }}
              >
                <div className="relative min-h-[23rem]">
                  <img
                    src={toMediaUrl(item.imageUrl)}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/12 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xl font-black text-white">{item.name}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="font-black text-white">KES {item.price}/=</span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart(item);
                      }}
                      className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/15 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                      aria-label={`Add ${item.name} to cart`}
                    >
                      <FontAwesomeIcon icon={faCartPlus} />
                    </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      ) : (
        <div className="rounded-[1.6rem] bg-white px-5 py-14 text-center text-gray-500">
          Nothing published here yet.
        </div>
      )}
    </section>
  );
}

export default Home;
