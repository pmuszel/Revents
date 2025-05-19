import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/layout/globals.css";
import { Provider } from "react-redux";
import { store } from "./lib/stores/store.ts";
import { RouterProvider } from "react-router";
import { router } from "./app/router/Routes.tsx";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./app/providers/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          theme="colored"
        />
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </StrictMode>
);
