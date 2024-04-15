import Header from "../components/Header";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import TopBarProgress from "react-topbar-progress-indicator";

TopBarProgress.config({
  barColors: {
    0: "#833ab4",
    0.5: "#1d5afd",
    1.0: "#fc459f",
  },
  barThickness: 10,
});

function Layout() {
  const [progress, setProgress] = useState(false);
  const [prevLoc, setPrevLoc] = useState("");
  let location = useLocation();

  useEffect(() => {
    setPrevLoc(location.pathname);
    setProgress(true);
    if (location.pathname === prevLoc) {
      setPrevLoc("");
    }
  }, [location]);

  useEffect(() => {
    setProgress(false);
  }, [prevLoc]);

  let route = useLocation();

  if (
    route.pathname == "/profile" ||
    route.pathname == "/board" ||
    route.pathname == "/search"
  ) {
    document.getElementsByTagName("body")[0].classList = "no_scroll";
  } else {
    document.getElementsByTagName("body")[0].classList = "";
  }

  return (
    <>
      {progress && <TopBarProgress />}
      <Header />
      <Outlet />
    </>
  );
}

export default Layout;
