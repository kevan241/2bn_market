import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";       // Client
import AdminApp from "./AdminApp"; // Admin

const isAdminRoute = window.location.pathname.startsWith("/admin");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {isAdminRoute ? <AdminApp /> : <App />}
    </BrowserRouter>
  </StrictMode>
);
