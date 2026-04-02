import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPenToSquare, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ORDER_STATUSES, PRODUCT_CATEGORIES } from "../constants/categories";
import { apiRequest, toMediaUrl, uploadImage } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

const initialForm = {
  name: "",
  category: PRODUCT_CATEGORIES[0].value,
  price: "",
  description: "",
  imageUrl: "",
  status: "active",
};

function Owner() {
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const title = useMemo(() => (editingId ? "Update content" : "Add new content"), [editingId]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [productsPayload, ordersPayload] = await Promise.all([
          apiRequest("/api/products?includeAll=true", { token }),
          apiRequest("/api/orders", { token }),
        ]);
        if (isMounted) {
          setProducts(productsPayload.products);
          setOrders(ordersPayload.orders);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const imageUrl = await readFileAsDataUrl(file);
    setSelectedFile(file);
    setPreview(imageUrl);
    setFormData((current) => ({ ...current, imageUrl: current.imageUrl }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setPreview("");
    setSelectedFile(null);
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      let imageUrl = formData.imageUrl;

      if (selectedFile) {
        const uploaded = await uploadImage(selectedFile, token);
        imageUrl = uploaded.publicPath;
      }

      const payload = await apiRequest(editingId ? `/api/products/${editingId}` : "/api/products", {
        method: editingId ? "PUT" : "POST",
        token,
        body: {
          ...formData,
          imageUrl,
          price: Number(formData.price),
        },
      });

      const savedProduct = payload.product;

      setProducts((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? savedProduct : item));
        }

        return [savedProduct, ...current];
      });

      resetForm();
      setSuccess(editingId ? "Product updated successfully." : "Product published successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");

    try {
      await apiRequest(`/api/products/${id}`, {
        method: "DELETE",
        token,
      });
      setProducts((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (product) => {
    setEditingId(product.id);
    setPreview(product.imageUrl);
    setSelectedFile(null);
    setFormData({
      name: product.name,
      category: product.category,
      price: String(product.price),
      description: product.description || "",
      imageUrl: product.imageUrl,
      status: product.status,
    });
    setSuccess("");
  };

  const handleOrderStatusChange = async (orderId, status) => {
    setOrderMessage("");
    setError("");

    try {
      const payload = await apiRequest(`/api/orders/${orderId}`, {
        method: "PATCH",
        token,
        body: { status },
      });

      setOrders((current) => current.map((order) => (order.id === orderId ? payload.order : order)));
      setOrderMessage(`Order #${orderId} updated to ${status}.`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage your live Kwetu catalogue as {user?.name}.</p>
      </header>

      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12">
        <div className="flex items-center gap-3 mb-6 text-secondary">
          <FontAwesomeIcon icon={faPlus} className="text-xl" />
          <h2 className="text-2xl font-semibold text-primary">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Product name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-secondary outline-none"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price (KES)"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-secondary outline-none"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-secondary outline-none"
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-secondary outline-none"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Short product description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-secondary outline-none"
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-secondary transition-colors relative">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-300 mb-4" />
              <p className="text-gray-500">Upload a product image or cover art.</p>
              <p className="text-sm text-gray-400 mt-2">Images are uploaded to ImgBB and the returned image URL is saved with the product.</p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
              {preview ? (
                <img src={preview} alt="Product preview" className="w-full h-64 object-cover rounded-2xl" />
              ) : (
                <div className="w-full h-64 rounded-2xl bg-primary/10 text-primary grid place-items-center text-center px-6">
                  Preview will appear here after you choose an image.
                </div>
              )}
            </div>
          </div>

          {error ? <p className="text-red-600 font-medium">{error}</p> : null}
          {success ? <p className="text-green-700 font-medium">{success}</p> : null}

          <div className="flex gap-4">
            <button type="submit" disabled={isSaving} className="flex-1 bg-secondary text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-70">
              {isSaving ? "Saving..." : editingId ? "Update item" : "Publish item"}
            </button>
            <button type="button" onClick={resetForm} className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">
              Clear
            </button>
          </div>
        </form>
      </section>

      <h3 className="text-2xl font-bold text-primary mb-6 border-b pb-4">Current Templates</h3>
      {isLoading ? (
        <div className="text-center py-20 text-primary">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-primary/20 bg-white px-6 py-12 text-center text-gray-500">
          No products found yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="h-48 overflow-hidden relative">
                <img src={toMediaUrl(item.imageUrl)} className="w-full h-full object-cover" alt={item.name} />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditing(item)} className="w-8 h-8 bg-white text-green-600 rounded-full shadow-md hover:bg-green-50">
                    <FontAwesomeIcon icon={faPenToSquare} size="sm" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="w-8 h-8 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50">
                    <FontAwesomeIcon icon={faTrash} size="sm" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-bold text-secondary uppercase mb-1">{item.category}</p>
                <p className="text-lg font-bold text-primary">{item.name}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description || "No description yet."}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-bold text-primary">KES {item.price}</p>
                  <span className={`text-xs px-3 py-1 rounded-full ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="mt-14">
        <div className="flex items-center justify-between gap-4 mb-6 border-b pb-4">
          <div>
            <h3 className="text-2xl font-bold text-primary">Order Management</h3>
            <p className="text-gray-500 mt-1">Review incoming orders and update their status as payment and delivery progress.</p>
          </div>
        </div>

        {orderMessage ? <p className="text-green-700 font-medium mb-4">{orderMessage}</p> : null}

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-primary/20 bg-white px-6 py-12 text-center text-gray-500">
            No orders have been placed yet.
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Order #{order.id}</p>
                    <h4 className="text-2xl font-bold text-primary mt-1">KES {order.totalAmount}/=</h4>
                    <p className="text-gray-500 mt-1">{order.customerName || "Guest customer"} · {order.customerEmail || "No email"}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold capitalize">{order.paymentMethod}</span>
                    <select
                      value={order.status}
                      onChange={(event) => handleOrderStatusChange(order.id, event.target.value)}
                      className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold capitalize"
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 px-4 py-3">
                      <div>
                        <p className="font-semibold text-primary">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qty {item.quantity} x KES {item.unitPrice}</p>
                      </div>
                      <p className="font-bold text-primary">KES {item.lineTotal}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default Owner;
