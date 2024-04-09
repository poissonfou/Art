import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Layout from "./components/Layout";
import Auth, { action as authActions } from "./pages/Auth";
import Board, { loader as loaderBoard } from "./pages/Board";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "auth",
        element: <Auth />,
        action: authActions,
      },
      {
        path: "board",
        element: <Board />,
        loader: loaderBoard,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
