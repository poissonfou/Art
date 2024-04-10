import { useState, useEffect } from "react";
import { redirect } from "react-router-dom";

import Form from "../components/Form";

import classes from "./UpdateInfo.module.css";

let info = {
  name: "",
  password: "",
};

function UpdateInfo() {
  const [userInfo, setUserInfo] = useState(info);

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

  return (
    <main className={classes.update_main}>
      <Form>
        <h1>Update</h1>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="text" name="password" />
        </div>
        <div>
          <label htmlFor="reconfirm">Reconfirm password</label>
          <input type="text" name="reconfirm" />
        </div>
        <button type="submit">Update</button>
      </Form>
    </main>
  );
}

export default UpdateInfo;

export async function action({ request }) {
  const data = await request.formData();

  let name = data.get("name").trim();
  let password = data.get("password").trim();
  let reconfirm = data.get("reconfirm").trim();
  let token = localStorage.getItem("token");
  let id = localStorage.getItem("id");

  if (token == "null" || id == "null") return;

  if (password == "" && name == "") {
    return redirect("/");
  }

  if (password.length) {
    if (password !== reconfirm) {
      return null;
    }
    if (password.length < 6) {
      return null;
    }
  }

  let formData = {
    name,
    password,
    id,
  };

  const response = await fetch("http://localhost:3000/user/update", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    console.log(response);
    return response;
  }

  return redirect("/board?loggedIn=true");
}
