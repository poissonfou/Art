import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./SideTabProfile.module.css";

let user = {
  name: "ddd",
  email: "ddd",
};

function SideTabProfile() {
  const [userInfo, setUserInfo] = useState(user);
  const [showTab, setShowTab] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let id = localStorage.getItem("id");
      let user = await fetch("http://localhost:3000/user/" + id);
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
    navigate("/auth/update");
  }

  return (
    <div className={` ${classes.profile_tab} ${showTab ? classes.show : ""}`}>
      <p>{userInfo.name}</p>
      <p>{userInfo.email}</p>
      <button onClick={redirectUpdate}>Update Info</button>
      <div className={classes.mini_profile} onClick={showProfile}>
        <p>{userInfo.name[0]}</p>
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
