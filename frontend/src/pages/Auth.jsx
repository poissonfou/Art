import {
  Link,
  redirect,
  useSearchParams,
  useActionData,
} from "react-router-dom";

import { useState, useRef } from "react";

import Form from "../components/Form";

import classes from "./Auth.module.css";

let hasError = false;
const INITIAL_AUTH = {
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
    emailLogin: "",
    passwordLogin: "",
  },
};

function Auth() {
  const [searchParams] = useSearchParams();
  const MODE = searchParams.get("mode");

  const [auth, setAuth] = useState(INITIAL_AUTH);

  let errorAction = useActionData();
  if (!errorAction) {
    errorAction = { isError: false };
  }

  let email = useRef("");
  let name = useRef("");
  let password = useRef("");
  let confirm = useRef("");
  let emailLogin = useRef("");
  let passwordLogin = useRef("");

  function inputAuth(field) {
    let message;

    if (field == "name") {
      const NAME_INPUT = name.current.value.trim();
      if (NAME_INPUT == "") {
        hasError = true;
        setAuth((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.name = true;
          newState.msg.name = "Please enter your name.";
          return newState;
        });
        return;
      }
    }

    if (field == "email") {
      const EMAIL_INPUT = email.current.value.trim();

      if (EMAIL_INPUT == "") message = "Please enter your email.";
      if (EMAIL_INPUT.indexOf("@") == -1)
        message = "Please enter a valid email.";

      if (message) {
        hasError = true;
        setAuth((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.email = true;
          newState.msg.email = message;
          return newState;
        });
        return;
      }
    }

    if (field == "emailLogin") {
      const EMAIL_LOGIN_INPUT = emailLogin.current.value.trim();

      if (EMAIL_LOGIN_INPUT == "") message = "Please enter your email.";
      if (EMAIL_LOGIN_INPUT.indexOf("@") == -1)
        message = "Please enter a valid email.";

      if (message) {
        hasError = true;
        setAuth((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.emailLogin = true;
          newState.msg.emailLogin = message;
          return newState;
        });
        return;
      }
    }

    if (field == "password") {
      const PASSWORD_INPUT = password.current.value.trim();

      if (PASSWORD_INPUT == "") message = "Please enter your password.";
      if (PASSWORD_INPUT.length < 6)
        message = "Password must be longer then six digits.";

      if (message) {
        hasError = true;
        setAuth((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.password = true;
          newState.msg.password = message;
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

    if (field == "passwordLogin") {
      const PASSWORD_LOGIN_INPUT = passwordLogin.current.value.trim();

      if (PASSWORD_LOGIN_INPUT == "") message = "Please enter your password.";
      if (PASSWORD_LOGIN_INPUT.length < 6)
        message = "Password must be longer then six digits.";

      if (message) {
        hasError = true;
        setAuth((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.passwordLogin = true;
          newState.msg.passwordLogin = "Please enter your password.";
          if (newState.errors.isEqual) {
            newState.erros.isEqual = false;
            newState.msg.isEqual = "";
          }
          return newState;
        });
        return;
      }
    }

    if (field == "confirm") {
      const CONFIRM_INPUT = confirm.current.value.trim();

      if (CONFIRM_INPUT == "") message = "Please enter your password.";
      if (CONFIRM_INPUT.length < 6)
        message = "Password must be longer then six digits.";

      if (message) {
        hasError = true;
        setAuth((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.confirm = true;
          newState.msg.confirm = "Please confirm your password.";
          if (newState.errors.isEqual) {
            newState.erros.isEqual = false;
            newState.msg.isEqual = "";
          }
          return newState;
        });
        return;
      }

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
    <>
      {MODE == "signup" ? (
        <main className={classes.main_signup}>
          <Form>
            <h1>Signup</h1>
            {errorAction.isError && <p>{errorAction.message}</p>}
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                ref={name}
                onBlur={() => inputAuth("name")}
                className={auth.errors.name ? classes.error : ""}
              />
            </div>
            {auth.errors.name && (
              <p className={classes.error_msg}>{auth.msg.name}</p>
            )}
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                ref={email}
                name="email"
                onBlur={() => inputAuth("email")}
                className={auth.errors.email ? classes.error : ""}
              />
              {auth.errors.email && (
                <p className={classes.error_msg}>{auth.msg.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                ref={password}
                name="password"
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
              <label htmlFor="confirm">Confirm Password</label>
              <input
                type="password"
                ref={confirm}
                name="confirm"
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
            <button type="submit">Signup</button>
          </Form>
        </main>
      ) : (
        <main className={classes.main_login}>
          <Form>
            <h1>Login</h1>
            {errorAction.isError && (
              <p className={classes.error_msg}>{errorAction.message}</p>
            )}
            <div>
              <label htmlFor="emailLogin">Email</label>
              <input
                type="email"
                ref={emailLogin}
                name="emailLogin"
                onBlur={() => inputAuth("emailLogin")}
                className={auth.errors.emailLogin ? classes.error : ""}
              />
              {auth.errors.emailLogin && (
                <p className={classes.error_msg}>{auth.msg.emailLogin}</p>
              )}
            </div>
            <div>
              <label htmlFor="passwordLogin">Password</label>
              <input
                type="password"
                ref={passwordLogin}
                name="passwordLogin"
                onBlur={() => inputAuth("passwordLogin")}
                className={auth.errors.passwordLogin ? classes.error : ""}
              />
              {auth.errors.passwordLogin && (
                <p className={classes.error_msg}>{auth.msg.passwordLogin}</p>
              )}
            </div>
            <p>
              Don't have an account?<Link to="/auth?mode=signup">Sign up.</Link>
            </p>
            <button type="submit">Login</button>
          </Form>
        </main>
      )}
    </>
  );
}

export default Auth;

export async function action({ request }) {
  if (hasError) return null;
  const searchParams = new URL(request.url).searchParams;

  if (searchParams.get("mode") == "login") {
    const INPUT_DATA = await request.formData();

    const email = INPUT_DATA.get("emailLogin").trim();
    const password = INPUT_DATA.get("passwordLogin").trim();

    const formData = {
      email,
      password,
    };

    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      let error = await response.json();
      return { isError: true, message: error.message };
    }

    const USER_DATA = await response.json();

    localStorage.setItem("token", USER_DATA.token);

    setTimeout(() => {
      localStorage.setItem("token", null);
      window.location.href = "/";
      alert("Session expired. Please login again.");
    }, 10800000);

    return redirect("/board");
  } else {
    const INPUT_DATA = await request.formData();

    const name = INPUT_DATA.get("name").trim();
    const email = INPUT_DATA.get("email").trim();
    const password = INPUT_DATA.get("password").trim();
    const confirm = INPUT_DATA.get("confirm").trim();

    const formData = {
      email,
      password,
      name,
      confirm,
    };

    const response = await fetch("http://localhost:3000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      let error = await response.json();
      return { isError: true, message: error.message };
    }

    return redirect("/auth?mode=login");
  }
}
