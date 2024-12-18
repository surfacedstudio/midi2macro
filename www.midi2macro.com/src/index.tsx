import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ContactRoute } from "./routes/Contact";
import { HomeRoute } from "./routes/Home";
import { ErrorRoute } from "./routes/Error";
import reportWebVitals from "./reportWebVitals";
import MarketingPage from "./MarketingPage";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MarketingPage />,
    errorElement: <ErrorRoute />,
  },
  {
    path: "/contact",
    element: <ContactRoute />,
    errorElement: <ErrorRoute />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
