import { createBrowserRouter } from "react-router-dom";
import { Root } from "../layout/Root";
import { Home, Project, CreateProject, Flow } from "../pages";

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
        path: "/create",
        element: <CreateProject />,
      },
      {
        path: "/project/:projectId",
        element: <Project />,
      },
      {
        path: "/project_test",
        element: <Flow />,
      },
    ],
  },
]);

export default router;
