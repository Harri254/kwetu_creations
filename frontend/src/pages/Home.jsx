import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, toMediaUrl } from "../lib/api";
import { PRODUCT_CATEGORIES } from "../constants/categories";

const categoryTone = {
  latest: "from-[#F6E6D8] to-white",
  products: "from-[#DBE9F2] to-white",
  services: "from-[#E6EFE4] to-white",
};

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiRequest("/api/products")
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
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary">Kwetu Creations</p>
            <h1 className="mt-4 text-4xl md:text-5xl font-black text-primary">Latest work, products, and services.</h1>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-7">
              A simple overview of the newest published work and the main things currently available.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {grouped.map((section) => (
              <CategoryPanel key={section.value} section={section} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function CategoryPanel({ section }) {
  const lead = section.items[0];
  const remaining = section.items.slice(1, 3);

  return (
    <section className={`rounded-[2rem] border border-black/5 bg-gradient-to-b ${categoryTone[section.value]} p-5 md:p-6 shadow-[0_18px_40px_rgba(7,46,74,0.05)]`}>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="uppercase tracking-[0.28em] text-xs text-secondary mb-2">{section.value}</p>
          <h3 className="text-2xl md:text-3xl font-black text-primary">{section.label}</h3>
        </div>
        <Link to={`/product/${section.value}`} className="text-sm font-semibold text-primary hover:text-secondary transition-colors">
          Open
        </Link>
      </div>

      {lead ? (
        <div className="overflow-hidden rounded-[1.6rem] bg-white shadow-[0_14px_30px_rgba(7,46,74,0.04)]">
          <img src={toMediaUrl(lead.imageUrl)} alt={lead.name} className="h-64 w-full object-cover" />
          <div className="p-5">
            <p className="text-xl font-black text-primary">{lead.name}</p>
            <p className="mt-2 line-clamp-3 text-sm text-gray-600">{lead.description || "Published work from the live catalogue."}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-secondary font-black">KES {lead.price}/=</span>
              <span className="text-xs uppercase tracking-[0.22em] text-gray-400">{section.items.length} item{section.items.length === 1 ? "" : "s"}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[1.6rem] bg-white px-5 py-14 text-center text-gray-500">
          Nothing published here yet.
        </div>
      )}

      {remaining.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {remaining.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-[1.2rem] bg-white px-4 py-3 shadow-[0_12px_24px_rgba(7,46,74,0.03)]">
              <img src={toMediaUrl(item.imageUrl)} alt={item.name} className="h-16 w-16 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-primary">{item.name}</p>
                <p className="truncate text-sm text-gray-500">{item.description || "Published work from the live catalogue."}</p>
              </div>
              <span className="whitespace-nowrap text-sm font-bold text-secondary">KES {item.price}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default Home;
