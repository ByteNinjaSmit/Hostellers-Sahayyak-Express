import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import AppWrapper from "./App.jsx";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./store/auth.jsx";
import "react-toastify/dist/ReactToastify.css";


createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StrictMode>
      <NextUIProvider>
        <AppWrapper />
      </NextUIProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        bodyClassName="toastBody"
      />
    </StrictMode>
  </AuthProvider>
);
