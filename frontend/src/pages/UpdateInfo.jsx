import { redirect, useActionData } from "react-router-dom";
import { useState, useRef } from "react";

import Form from "../components/Form";

import classes from "./UpdateInfo.module.css";

let hasError = false;

function UpdateInfo() {
  let [error, setError] = useState({
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
  });

  let password = useRef("");
  let confirm = useRef("");

  let errorAction = useActionData();

  if (!errorAction) {
    errorAction = { isError: false };
  }

  function inputAuth(field) {
    if (field == "password") {
      let passwordInput = password.current.value.trim();

      if (passwordInput.length < 6 && passwordInput !== "") {
        hasError = true;
        setError((prevState) => {
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

      if (passwordInput !== confirm.current.value.trim()) {
        hasError = true;
        setError((prevState) => {
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
      let confirmInput = confirm.current.value.trim();

      if (confirmInput !== password.current.value.trim()) {
        hasError = true;
        setError((prevState) => {
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

      if (confirmInput.length < 6 && confirmInput !== "") {
        hasError = true;
        setError((prevState) => {
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
      setError((prevState) => {
        let newState = JSON.parse(JSON.stringify(prevState));
        newState = {
          errors: {
            name: false,
            password: false,
            isEqual: false,
            email: false,
            confirm: false,
            emailLogin: false,
            passwordLogin: false,
          },
          msg: {
            name: "",
            password: "",
            isEqual: "",
            email: "",
            confirm: "",
            emailLogin: false,
            passwordLogin: false,
          },
        };
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
            className={`${error.errors.password ? classes.error : ""} ${
              error.errors.isEqual ? classes.error : ""
            }`}
          />
          {error.errors.password && (
            <p className={classes.error_msg}>{error.msg.password}</p>
          )}
          {error.errors.isEqual && (
            <p className={classes.error_msg}>{error.msg.isEqual}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirm">Confirm password</label>
          <input
            type="text"
            name="confirm"
            ref={confirm}
            onBlur={() => inputAuth("confirm")}
            className={`${error.errors.confirm ? classes.error : ""} ${
              error.errors.isEqual ? classes.error : ""
            }`}
          />
          {error.errors.confirm && (
            <p className={classes.error_msg}>{error.msg.confirm}</p>
          )}
          {error.errors.isEqual && (
            <p className={classes.error_msg}>{error.msg.isEqual}</p>
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
  const data = await request.formData();

  let name = data.get("name").trim();
  let password = data.get("password").trim();
  let confirm = data.get("confirm").trim();
  let token = localStorage.getItem("token");

  if (password == "" && name == "" && confirm == "") {
    return redirect("/board");
  }

  let formData = {
    name,
    password,
    confirm,
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
    let error = await response.json();
    return { isError: true, message: error.message };
  }

  return redirect("/board");
}
