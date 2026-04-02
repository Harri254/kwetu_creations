const BASE_URLS = {
  sandbox: "https://sandbox.safaricom.co.ke",
  production: "https://api.safaricom.co.ke",
};

export function isDarajaConfigured() {
  return Boolean(
    process.env.DARAJA_CONSUMER_KEY &&
      process.env.DARAJA_CONSUMER_SECRET &&
      process.env.DARAJA_SHORTCODE &&
      process.env.DARAJA_PASSKEY &&
      process.env.DARAJA_CALLBACK_BASE_URL
  );
}

export async function initiateStkPush({ phoneNumber, amount, orderId, accountReference, transactionDesc }) {
  const timestamp = getTimestamp();
  const baseUrl = getDarajaBaseUrl();
  const callbackUrl = `${trimTrailingSlash(process.env.DARAJA_CALLBACK_BASE_URL)}/api/payments/daraja/callback`;
  const shortcode = process.env.DARAJA_SHORTCODE;
  const passkey = process.env.DARAJA_PASSKEY;

  const accessToken = await getAccessToken(baseUrl);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.max(1, Math.round(amount)),
      PartyA: phoneNumber,
      PartyB: shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: accountReference || `ORDER-${orderId}`,
      TransactionDesc: transactionDesc || `Order ${orderId}`,
    }),
  });

  const payload = await response.json();
  if (!response.ok || payload.errorCode) {
    throw new Error(payload.errorMessage || payload.ResponseDescription || "Failed to initiate M-Pesa STK push.");
  }

  return {
    merchantRequestId: payload.MerchantRequestID,
    checkoutRequestId: payload.CheckoutRequestID,
    responseCode: payload.ResponseCode,
    responseDescription: payload.ResponseDescription,
    customerMessage: payload.CustomerMessage,
  };
}

export async function queryStkPush({ checkoutRequestId }) {
  const timestamp = getTimestamp();
  const baseUrl = getDarajaBaseUrl();
  const shortcode = process.env.DARAJA_SHORTCODE;
  const passkey = process.env.DARAJA_PASSKEY;
  const accessToken = await getAccessToken(baseUrl);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

  const response = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
  });

  const payload = await response.json();
  if (!response.ok || payload.errorCode) {
    throw new Error(payload.errorMessage || payload.ResponseDescription || "Failed to query M-Pesa payment status.");
  }

  return payload;
}

export function normalizeKenyanPhoneNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  if (digits.startsWith("7") && digits.length === 9) {
    return `254${digits}`;
  }

  return null;
}

export function parseCallbackPayload(payload) {
  const callback = payload?.Body?.stkCallback;
  const metadata = callback?.CallbackMetadata?.Item || [];

  const getValue = (name) => metadata.find((item) => item.Name === name)?.Value ?? null;

  return {
    merchantRequestId: callback?.MerchantRequestID ?? null,
    checkoutRequestId: callback?.CheckoutRequestID ?? null,
    resultCode: callback?.ResultCode ?? null,
    resultDesc: callback?.ResultDesc ?? null,
    amount: getValue("Amount"),
    mpesaReceiptNumber: getValue("MpesaReceiptNumber"),
    transactionDate: getValue("TransactionDate"),
    phoneNumber: getValue("PhoneNumber"),
  };
}

async function getAccessToken(baseUrl) {
  const credentials = Buffer.from(
    `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  const payload = await response.json();
  if (!response.ok || !payload.access_token) {
    throw new Error(payload.errorMessage || "Failed to get Daraja access token.");
  }

  return payload.access_token;
}

function getDarajaBaseUrl() {
  const env = (process.env.DARAJA_ENV || "sandbox").toLowerCase();
  return BASE_URLS[env] || BASE_URLS.sandbox;
}

function getTimestamp() {
  const date = new Date();
  const parts = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    String(date.getSeconds()).padStart(2, "0"),
  ];

  return parts.join("");
}

function trimTrailingSlash(value) {
  return String(value || "").replace(/\/$/, "");
}
