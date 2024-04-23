import Header from "../components/Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
  let navigate = useNavigate();
  const API_TOKEN = localStorage.getItem("token");
  const IS_MOBILE = "ontouchmove" in window;

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

  if (location.pathname == "/board" || location.pathname == "/search") {
    if (!IS_MOBILE) {
      document.getElementsByTagName("body")[0].classList = "no_scroll";
    } else {
      document.getElementById("wrapper").classList = "hide_overflow_mobile";
    }
  } else {
    document.getElementsByTagName("body")[0].classList = "";
    document.getElementById("wrapper").classList = "";
  }

  if (location.pathname == "/profile") {
    if (!IS_MOBILE) {
      document.getElementsByTagName("body")[0].classList = "y_scroll";
    } else {
      document.getElementById("wrapper").classList = "hide_overflow_mobile";
    }
  }

  async function checkToken() {
    let response = await fetch("http://localhost:3000/user", {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      localStorage.setItem("token", null);
      alert("Session expired. Please login again.");
      return navigate("/");
    }
  }

  if (API_TOKEN && API_TOKEN !== "null") {
    checkToken();
  }

  return (
    <>
      {progress && <TopBarProgress />}
      <Header key={prevLoc} />
      <Outlet />
    </>
  );
}

export default Layout;
