import { createBrowserRouter, Link } from "react-router-dom";
import App from "./App";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: App,
    },
    {
      path: "/test",
      element: (
        <div>
          <h1>APP test page</h1>

          <Link to="/">home app</Link>
          <br />
          <a href="/">WWW home</a>
        </div>
      ),
    },
  ],
  { basename: "/app" },
);
