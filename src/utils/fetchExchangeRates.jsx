export const fetchExchangeRates = async (base = "INR") => {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    const data = await res.json();

    if (data.result === "success") {
      return data.rates;
    } else {
      console.error("Exchange rate API failed:", data);
      return {};
    }
  } catch (err) {
    console.error("Failed to fetch exchange rates:", err);
    return {};
  }
};
