import { createBrowserRouter } from "react-router-dom";
import { Root } from "../layout/Root";
import { Home, Project, CreateProject, Flow } from "../pages";
import { SignUp } from "../pages/SignUp";
import { Login } from "../pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />, // TODO: CHANGE BACK TO HOME
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
        path: "/create",
        element: <CreateProject />,
      },
      {
        path: "/project_dep/:projectId",
        element: <Project />,
      },
      {
        path: "/project/:projectId",
        element: <Flow />,
      },
    ],
  },
]);

export default router;
