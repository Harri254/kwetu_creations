import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { faMoneyBillWave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PAYMENT_METHODS } from "../constants/categories";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { apiRequest, toMediaUrl } from "../lib/api";
import { useNavigate } from "react-router-dom";

const PAYMENT_WAIT_MS = 5000;
const PAYMENT_MAX_POLLS = 24;

function Cart() {
  const { items, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].value);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [mpesaPhoneNumber, setMpesaPhoneNumber] = useState(user?.phoneNumber || "");
  const [status, setStatus] = useState({ error: "", success: "", loading: false });

  const checkoutItems = useMemo(
    () => items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    [items]
  );

  const handleCheckout = async () => {
    if (items.length === 0) {
      setStatus({ error: "Add at least one item to continue.", success: "", loading: false });
      return;
    }

    setStatus({ error: "", success: "", loading: true });

    try {
      const payload = await apiRequest("/api/orders", {
        method: "POST",
        token,
        body: {
          items: checkoutItems,
          paymentMethod,
          customerName: user?.name || guestName,
          customerEmail: user?.email || guestEmail,
          phoneNumber: mpesaPhoneNumber,
        },
      });

      if (paymentMethod === "mpesa" && payload.payment?.checkoutRequestId) {
        setStatus({
          error: "",
          success: payload.message || "STK push sent to your phone. Complete the prompt to finish payment.",
          loading: true,
        });

        const paidOrder = await waitForMpesaCompletion(payload.order.id, payload.payment.checkoutRequestId, token);

        clearCart();
        setStatus({
          error: "",
          success: `Payment received successfully for order #${paidOrder.id}. Receipt: ${paidOrder.paymentReference || "confirmed"}.`,
          loading: false,
        });

        if (user) {
          navigate("/orders", { replace: true });
        }

        return;
      }

      clearCart();
      setStatus({
        error: "",
        success: payload.message || `Order #${payload.order.id} created successfully. Total: KES ${payload.order.totalAmount}.`,
        loading: false,
      });
      if (user) {
        navigate("/orders", { replace: true });
      }
    } catch (err) {
      setStatus({ error: err.message, success: "", loading: false });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 min-h-screen">
      <h2 className="text-3xl text-primary/80 font-extrabold md:text-4xl lg:text-5xl">Confirm and make payment.</h2>
      <p className="mt-2 text-xl text-secondary font-bold">Your vision is our mission.</p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-primary/20 bg-primary/5 p-10 text-center text-primary">
          Your cart is empty. Add a few products from the catalogue to continue.
        </div>
      ) : (
        <div className="mt-8 grid lg:grid-cols-[1.35fr_0.65fr] gap-8 items-start">
          <div className="flex flex-col gap-6">
            {items.map((item) => (
              <div key={item.productId} className="flex flex-col md:flex-row p-4 gap-4 rounded-2xl bg-primary/10 relative justify-evenly shadow-xl">
                <img src={toMediaUrl(item.imageUrl)} alt={item.name} className="w-full md:w-[250px] h-[220px] object-cover rounded-2xl" />
                <div className="flex flex-col items-center md:items-start justify-center gap-6 text-2xl mt-1 md:mt-6 flex-1">
                  <div className="text-center md:text-left">
                    <h3 className="font-medium text-2xl md:text-3xl mb-2">{item.name}</h3>
                    <p className="font-medium">Kshs. <span className="text-2xl md:text-4xl">{item.price}</span></p>
                  </div>
                  <div className="flex gap-3 text-tertiary items-center">
                    <button className="bg-secondary rounded-2xl px-6 py-1 text-white" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                    <p className="font-bold text-primary mx-4 text-4xl">{item.quantity}</p>
                    <button className="bg-secondary rounded-2xl px-6 py-1 text-white" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="bg-primary absolute text-white text-lg px-4 py-2 rounded-2xl right-3 top-3">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-6">
            <div className="text-2xl md:text-3xl">
              <p className="font-bold">Total Amount</p>
              <p className="text-secondary text-4xl mt-2">Kshs. {totalAmount}/=</p>
            </div>

            {!user ? (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={guestEmail}
                  onChange={(event) => setGuestEmail(event.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-primary/5 p-4 text-primary">
                Checkout will use <span className="font-semibold">{user.email}</span>.
              </div>
            )}

            {!user ? (
              <div className="rounded-2xl bg-secondary/10 p-4 text-sm text-primary">
                Guest checkout is enabled. Enter your details below and we will create the order without requiring an account.
              </div>
            ) : null}

            {paymentMethod === "mpesa" ? (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-primary">M-Pesa Phone Number</label>
                <input
                  type="tel"
                  placeholder="2547XXXXXXXX"
                  value={mpesaPhoneNumber}
                  onChange={(event) => setMpesaPhoneNumber(event.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-secondary"
                />
                <p className="text-xs text-gray-500">Use a Safaricom line in the format `2547XXXXXXXX` or `07XXXXXXXX`.</p>
              </div>
            ) : null}

            <div className="space-y-3">
              <p className="text-xl font-semibold text-primary">Choose Payment Method</p>
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`w-full flex items-center justify-between py-3 px-4 rounded-2xl border transition-colors ${
                    paymentMethod === method.value ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-200 hover:border-secondary"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FontAwesomeIcon icon={method.value === "paypal" ? faPaypal : faMoneyBillWave} />
                    {method.label}
                  </span>
                  <span className="text-sm uppercase tracking-[0.25em]">{paymentMethod === method.value ? "Selected" : "Pick"}</span>
                </button>
              ))}
            </div>

            {status.error ? <p className="text-red-600">{status.error}</p> : null}
            {status.success ? <p className="text-green-700">{status.success}</p> : null}
            {status.loading && paymentMethod === "mpesa" ? (
              <p className="text-sm text-primary">
                Waiting for M-Pesa confirmation. Approve the STK push on your phone and keep this page open.
              </p>
            ) : null}

            <button
              onClick={handleCheckout}
              disabled={status.loading}
              className="w-full bg-secondary hover:bg-opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-secondary/20 transition-all disabled:opacity-70"
            >
              {status.loading ? (paymentMethod === "mpesa" ? "Sending STK push..." : "Creating order...") : paymentMethod === "mpesa" ? "Pay with M-Pesa" : "Create order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

async function waitForMpesaCompletion(orderId, checkoutRequestId, token) {
  for (let attempt = 0; attempt < PAYMENT_MAX_POLLS; attempt += 1) {
    await delay(PAYMENT_WAIT_MS);

    const paymentPayload = await apiRequest("/api/payments/daraja/query", {
      method: "POST",
      token,
      body: { orderId, checkoutRequestId },
    });

    if (paymentPayload.order?.status === "paid") {
      const orderPayload = await apiRequest(`/api/orders/${orderId}/status?checkoutRequestId=${encodeURIComponent(checkoutRequestId)}`, {
        token,
      });
      return orderPayload.order;
    }

    if (paymentPayload.order?.status === "failed") {
      throw new Error(paymentPayload.order.paymentResultDesc || "M-Pesa payment was not completed.");
    }
  }

  throw new Error("Payment is still pending. Please confirm the M-Pesa prompt, then check your order status again.");
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
