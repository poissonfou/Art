import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import classes from "./SideTabProfile.module.css";

let user = {
  name: "",
  email: "",
};

function SideTabProfile() {
  const [userInfo, setUserInfo] = useState(user);
  const [showTab, setShowTab] = useState(false);
  let [error, setError] = useState({ isError: false });

  const navigate = useNavigate();
  let route = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem("token");
      let user = await fetch("http://localhost:3000/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!user.ok) {
        setError((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.isError = true;
          newState.message = "Could not fetch user.";
          newState.redirect = "reload";
          return newState;
        });
        return;
      }

      user = await user.json();
      setUserInfo((prevState) => {
        let newState = JSON.parse(JSON.stringify(prevState));
        newState = user.user[0];
        return newState;
      });
    };
    fetchData();
  }, []);

  function showProfile() {
    setShowTab((prevState) => !prevState);
  }

  function redirectUpdate() {
    if (error.isError) return;
    navigate("/auth/update");
  }

  function redirectProfile() {
    if (error.isError) return;
    navigate("/profile");
  }

  return (
    <div
      className={`${classes.profile_tab} ${
        route.pathname == "/profile" ? classes.static : classes.absolute
      } ${showTab ? classes.show : ""}`}
    >
      {error.isError ? (
        <p>Could not fetch</p>
      ) : (
        <>
          <p>{userInfo.name}</p>
          <p>{userInfo.email}</p>
        </>
      )}

      <button onClick={redirectProfile}>Profile</button>
      <button onClick={redirectUpdate}>Update Info</button>
      <div
        className={`${classes.mini_profile} ${
          route.pathname == "/profile" ? classes.hidden : ""
        }`}
        onClick={showProfile}
      >
        <p>{!error.isError ? userInfo.name[0] : "!"}</p>
      </div>
      <div className={classes.author_info}>
        <p>Emerson Lima | 2024</p>
        <a href="https://www.linkedin.com/in/emerson-lima-%F0%9F%8F%B3%EF%B8%8F%E2%80%8D%F0%9F%8C%88-000986237/">
          <i className="bi bi-linkedin"></i>
        </a>
        <a href="https://github.com/poissonfou">
          <i className="bi bi-github"></i>
        </a>
      </div>
    </div>
  );
}

export default SideTabProfile;
