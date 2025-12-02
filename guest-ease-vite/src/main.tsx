import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import "./index.css";
import SiteHeader from "./components/siteHeader/siteHeader";
import { BookingProvider } from "./context/bookingContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <BookingProvider>
        <SiteHeader />
        <App />
      </BookingProvider>
    </BrowserRouter>
  </React.StrictMode>
);
