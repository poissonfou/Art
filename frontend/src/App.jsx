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
import UpdateInfo, { action as updateInfoAction } from "./pages/UpdateInfo";
import Profile, {
  loader as loaderProfile,
  action as actionProfile,
} from "./pages/Profile";
import Search from './pages/Search';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "auth",
        children: [
          {
            index: true,
            element: <Auth />,
            action: authActions,
          },
          {
            path: "update",
            element: <UpdateInfo />,
            action: updateInfoAction,
          },
        ],
      },
      {
        path: "board",
        element: <Board />,
        loader: loaderBoard,
      },
      {
        path: "profile",
        element: <Profile />,
        loader: loaderProfile,
        action: actionProfile,
      },
      {
        path: 'search',
        element: <Search />,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
