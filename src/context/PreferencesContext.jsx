import React, { createContext, useEffect, useState } from "react";
import { fetchExchangeRates } from "../utils/fetchExchangeRates";

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [prefs, setPrefs] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
      user?.preferences || {
        dateFormat: "dd/MM/yyyy",
        theme: "light",
        currency: "INR",
      }
    );
  });

  const [exchangeRates, setExchangeRates] = useState({});

  // 💱 Fetch exchange rates when currency changes
  useEffect(() => {
    if (prefs.currency) {
      fetchExchangeRates("INR").then((rates) => {
        setExchangeRates(rates);
      });
    }
  }, [prefs.currency]); 

  // 🌗 Theme toggle
  useEffect(() => {
    document.body.classList.toggle("dark-theme", prefs.theme === "dark");
  }, [prefs.theme]);

  return (
    <PreferencesContext.Provider value={{ prefs, setPrefs, exchangeRates }}>
      {children}
    </PreferencesContext.Provider>
  );
};
