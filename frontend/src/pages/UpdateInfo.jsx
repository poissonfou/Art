import { redirect, useActionData } from "react-router-dom";
import { useState, useRef } from "react";

import Form from "../components/Form";

import classes from "./UpdateInfo.module.css";

let hasError = false;

const INITIAL_AUTH = {
  errors: {
    password: false,
    isEqual: false,
    confirm: false,
  },
  msg: {
    password: "",
    isEqual: "",
    confirm: "",
  },
};

function UpdateInfo() {
  const [auth, setAuth] = useState(INITIAL_AUTH);

  let password = useRef("");
  let confirm = useRef("");

  let errorAction = useActionData();

  if (!errorAction) {
    errorAction = { isError: false };
  }

  function inputAuth(field) {
    if (field == "password") {
      const PASSWORD_INPUT = password.current.value.trim();

      if (PASSWORD_INPUT.length < 6 && PASSWORD_INPUT !== "") {
        hasError = true;
        setAuth((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.password = true;
          newState.msg.password = "Password must be longer then six digits.";
          if (newState.errors.isEqual) {
            newState.erros.isEqual = false;
            newState.msg.isEqual = "";
          }
          return newState;
        });
        return;
      }

      if (PASSWORD_INPUT !== confirm.current.value.trim()) {
        hasError = true;
        setAuth((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.isEqual = true;
          newState.msg.isEqual = "Passwords don't match";
          if (newState.errors.password) {
            newState.erros.password = false;
            newState.msg.password = "";
          }
          return newState;
        });
        return;
      }
    }

    if (field == "confirm") {
      const CONFIRM_INPUT = confirm.current.value.trim();

      if (CONFIRM_INPUT !== password.current.value.trim()) {
        hasError = true;
        setAuth((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.isEqual = true;
          newState.msg.isEqual = "Passwords don't match";
          if (newState.errors.password) {
            newState.erros.password = false;
            newState.msg.password = "";
          }
          return newState;
        });
        return;
      }

      if (CONFIRM_INPUT.length < 6 && CONFIRM_INPUT !== "") {
        hasError = true;
        setAuth((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.confirm = true;
          newState.msg.confirm = "Password must be longer then six digits.";
          if (newState.errors.isEqual) {
            newState.erros.isEqual = false;
            newState.msg.isEqual = "";
          }
          return newState;
        });
        return;
      }
    }

    if (hasError) {
      setAuth((prevState) => {
        let newState = JSON.parse(JSON.stringify(prevState));
        newState = INITIAL_AUTH;
        return newState;
      });
    }

    hasError = false;
  }

  return (
    <main className={classes.update_main}>
      <Form>
        <h1>Update</h1>
        {errorAction.isError && <p>{errorAction.message}</p>}
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="text"
            name="password"
            ref={password}
            onBlur={() => inputAuth("password")}
            className={`${auth.errors.password ? classes.error : ""} ${
              auth.errors.isEqual ? classes.error : ""
            }`}
          />
          {auth.errors.password && (
            <p className={classes.error_msg}>{auth.msg.password}</p>
          )}
          {auth.errors.isEqual && (
            <p className={classes.error_msg}>{auth.msg.isEqual}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirm">Confirm password</label>
          <input
            type="text"
            name="confirm"
            ref={confirm}
            onBlur={() => inputAuth("confirm")}
            className={`${auth.errors.confirm ? classes.error : ""} ${
              auth.errors.isEqual ? classes.error : ""
            }`}
          />
          {auth.errors.confirm && (
            <p className={classes.error_msg}>{auth.msg.confirm}</p>
          )}
          {auth.errors.isEqual && (
            <p className={classes.error_msg}>{auth.msg.isEqual}</p>
          )}
        </div>
        <p>Enter only the info you wish to change.</p>
        <button type="submit">Update</button>
      </Form>
    </main>
  );
}

export default UpdateInfo;

export async function action({ request }) {
  if (hasError) return;
  const INPUT_DATA = await request.formData();

  const name = INPUT_DATA.get("name").trim();
  const password = INPUT_DATA.get("password").trim();
  const confirm = INPUT_DATA.get("confirm").trim();
  const API_TOKEN = localStorage.getItem("token");

  if (password == "" && name == "" && confirm == "") {
    return redirect("/board");
  }

  const formData = {
    name,
    password,
    confirm,
  };

  const response = await fetch("http://localhost:3000/user/update", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    let error = await response.json();
    return { isError: true, message: error.message };
  }

  return redirect("/board");
}
