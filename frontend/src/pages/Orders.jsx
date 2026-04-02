import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { apiRequest } from "../lib/api";

function Orders() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const payload = await apiRequest("/api/orders", { token });
        if (isMounted) {
          setOrders(payload.orders);
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

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleRefreshPayment = async (orderId) => {
    setStatusMessage("");
    setError("");

    try {
      const payload = await apiRequest("/api/payments/daraja/query", {
        method: "POST",
        token,
        body: { orderId },
      });

      const refreshed = await apiRequest("/api/orders", { token });
      setOrders(refreshed.orders);
      setStatusMessage(payload.payment.ResponseDescription || "Payment status refreshed.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-primary">Order History</h1>
        <p className="text-gray-500 mt-2">Track payments and delivery progress for {user?.name}.</p>
      </div>

      {isLoading ? (
        <div className="rounded-3xl bg-primary/5 p-10 text-center text-primary">Loading your orders...</div>
      ) : error ? (
        <div className="rounded-3xl bg-red-50 p-10 text-center text-red-600">{error}</div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-primary/20 bg-white px-6 py-12 text-center text-gray-500">
          You have not placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {statusMessage ? <p className="text-green-700 font-medium">{statusMessage}</p> : null}
          {orders.map((order) => (
            <section key={order.id} className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Order #{order.id}</p>
                  <h2 className="text-2xl font-bold text-primary mt-1">KES {order.totalAmount}/=</h2>
                  <p className="text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold capitalize">{order.paymentMethod}</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusClasses(order.status)}`}>{order.status}</span>
                  {order.paymentMethod === "mpesa" && order.status === "processing" ? (
                    <button
                      type="button"
                      onClick={() => handleRefreshPayment(order.id)}
                      className="px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-primary hover:border-secondary"
                    >
                      Refresh payment
                    </button>
                  ) : null}
                </div>
              </div>

              {order.paymentMethod === "mpesa" ? (
                <div className="mb-5 rounded-2xl bg-primary/5 p-4 text-sm text-primary">
                  <p><span className="font-semibold">M-Pesa line:</span> {order.paymentPhoneNumber || "Not captured"}</p>
                  <p><span className="font-semibold">Checkout Request ID:</span> {order.paymentCheckoutRequestId || "Pending"}</p>
                  <p><span className="font-semibold">Receipt:</span> {order.paymentReference || "Waiting for callback"}</p>
                  {order.paymentResultDesc ? <p><span className="font-semibold">Result:</span> {order.paymentResultDesc}</p> : null}
                </div>
              ) : null}

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
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function statusClasses(status) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "paid":
      return "bg-emerald-100 text-emerald-700";
    case "processing":
      return "bg-amber-100 text-amber-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default Orders;
