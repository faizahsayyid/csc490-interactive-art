import { createBrowserRouter } from "react-router-dom";
import { Root } from "../layout/Root";
import { Home, Flow, SignUp, Login, Help } from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <SignUp />,
      },
      {
        path: "/project/:projectId",
        element: <Flow />,
      },
      {
        path: "/help",
        element: <Help />,
      },
    ],
  },
]);

export default router;
