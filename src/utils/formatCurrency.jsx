export const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const formatCurrency = (
  amount,
  targetCurrency = "INR",
  exchangeRates = {}
) => {
  const symbol = currencySymbols[targetCurrency] || targetCurrency;
  const rate = exchangeRates?.[targetCurrency];

  if (!rate) return `${symbol} ${amount.toFixed(2)}`;

  const convertedAmount = amount * rate;

  return `${symbol} ${convertedAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
