import { useEffect, useState } from "react";

import classes from "./SideTabProfile.module.css";

let user = {
  name: "ddd",
  email: "ddd",
};

function SideTabProfile() {
  const [userInfo, setUserInfo] = useState(user);
  const [showTab, setShowTab] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let id = localStorage.getItem("id");
      let user = await fetch("http://localhost:3000/user/" + id);
      user = await user.json();
      console.log(user.user[0]);
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

  return (
    <div className={` ${classes.profile_tab} ${showTab ? classes.show : ""}`}>
      <p>{userInfo.name}</p>
      <p>{userInfo.email}</p>
      <button>Change Password</button>
      <div className={classes.mini_profile} onClick={showProfile}>
        <p>{userInfo.name[0]}</p>
      </div>
    </div>
  );
}

export default SideTabProfile;
