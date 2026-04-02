import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { apiRequest, toMediaUrl } from "../lib/api";
import { useCart } from "../hooks/useCart";

function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError("");

    apiRequest(`/api/products/slug/${slug}`)
      .then((payload) => {
        if (isMounted) {
          setProduct(payload.product);
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
  }, [slug]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-primary min-h-screen">Loading product details...</div>;
  }

  if (error) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-600 min-h-screen">{error}</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-primary min-h-screen">Product not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <Link to={`/product/${product.category}`} className="text-sm font-semibold text-secondary hover:text-primary transition-colors">
        Back to {product.category}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_40px_rgba(7,46,74,0.06)]">
          <img src={toMediaUrl(product.imageUrl)} alt={product.name} className="h-full max-h-[42rem] w-full object-cover" />
        </div>

        <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-[0_18px_40px_rgba(7,46,74,0.06)]">
          <p className="text-xs uppercase tracking-[0.28em] text-secondary">{product.category}</p>
          <h1 className="mt-4 text-3xl md:text-5xl font-black text-primary">{product.name}</h1>
          <p className="mt-6 text-4xl font-black text-secondary">KES {product.price}/=</p>

          <div className="mt-8">
            <h2 className="text-lg font-bold text-primary">Full details</h2>
            <p className="mt-3 text-gray-600 leading-8">
              {product.description || "This item is available in the live catalogue. More description can be added from the admin dashboard."}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary"
            >
              <FontAwesomeIcon icon={faCartPlus} />
              Add to cart
            </button>
            <Link
              to="/cart"
              className="inline-flex items-center rounded-full border border-primary/15 px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Go to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
