import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { setRouterNavigate } from "@/shared/lib/router-navigate";
import { router } from "./router.tsx";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./global.css";

setRouterNavigate(router.navigate);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
