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

function Auth() {
  const [searchParams] = useSearchParams();
  let query = searchParams.get("mode");

  let errorAction = useActionData();

  if (!errorAction) {
    errorAction = { isError: false };
  }

  let [error, setError] = useState({
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
  });

  let email = useRef("");
  let name = useRef("");
  let password = useRef("");
  let confirm = useRef("");
  let emailLogin = useRef("");
  let passwordLogin = useRef("");

  function inputAuth(field) {
    if (field == "name") {
      let nameInput = name.current.value.trim();
      if (nameInput == "") {
        hasError = true;
        setError((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.name = true;
          newState.msg.name = "Please enter your name.";
          return newState;
        });
        return;
      }
    }

    if (field == "email") {
      let emailInput = email.current.value.trim();
      if (emailInput == "") {
        hasError = true;
        setError((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.email = true;
          newState.msg.email = "Please enter your email.";
          return newState;
        });
        return;
      }

      if (emailInput.indexOf("@") == -1) {
        hasError = true;
        setError((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.email = true;
          newState.msg.email = "Please enter a valid email.";
          return newState;
        });
        return;
      }
    }

    if (field == "emailLogin") {
      let emailInput = emailLogin.current.value.trim();
      if (emailInput == "") {
        hasError = true;
        setError((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.emailLogin = true;
          newState.msg.emailLogin = "Please enter your email.";
          return newState;
        });
        return;
      }

      if (emailInput.indexOf("@") == -1) {
        hasError = true;
        setError((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.emailLogin = true;
          newState.msg.emailLogin = "Please enter a valid email.";
          return newState;
        });
        return;
      }
    }

    if (field == "password") {
      let passwordInput = password.current.value.trim();
      if (passwordInput == "") {
        hasError = true;
        setError((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.password = true;
          newState.msg.password = "Please enter your password.";
          if (newState.errors.isEqual) {
            newState.erros.isEqual = false;
            newState.msg.isEqual = "";
          }
          return newState;
        });
        return;
      }

      if (passwordInput.length < 6) {
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

    if (field == "passwordLogin") {
      let passwordInput = passwordLogin.current.value.trim();
      if (passwordInput == "") {
        hasError = true;
        setError((prevState) => {
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

      if (passwordInput.length < 6) {
        hasError = true;
        setError((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.errors.passwordLogin = true;
          newState.msg.passwordLogin =
            "Password must be longer then six digits.";
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
      let confirmInput = confirm.current.value.trim();
      if (confirmInput == "") {
        hasError = true;
        setError((prevState) => {
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

      if (confirmInput.length < 6) {
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
    <>
      {query == "signup" ? (
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
                className={error.errors.name ? classes.error : ""}
              />
            </div>
            {error.errors.name && (
              <p className={classes.error_msg}>{error.msg.name}</p>
            )}
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                ref={email}
                name="email"
                onBlur={() => inputAuth("email")}
                className={error.errors.email ? classes.error : ""}
              />
              {error.errors.email && (
                <p className={classes.error_msg}>{error.msg.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                ref={password}
                name="password"
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
              <label htmlFor="confirm">Confirm Password</label>
              <input
                type="password"
                ref={confirm}
                name="confirm"
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
                className={error.errors.emailLogin ? classes.error : ""}
              />
              {error.errors.emailLogin && (
                <p className={classes.error_msg}>{error.msg.emailLogin}</p>
              )}
            </div>
            <div>
              <label htmlFor="passwordLogin">Password</label>
              <input
                type="password"
                ref={passwordLogin}
                name="passwordLogin"
                onBlur={() => inputAuth("passwordLogin")}
                className={error.errors.passwordLogin ? classes.error : ""}
              />
              {error.errors.passwordLogin && (
                <p className={classes.error_msg}>{error.msg.passwordLogin}</p>
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
    const data = await request.formData();

    let email = data.get("emailLogin").trim();
    let password = data.get("passwordLogin").trim();

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

    let userData = await response.json();

    localStorage.setItem("token", userData.token);

    return redirect("/board");
  } else {
    const data = await request.formData();

    let name = data.get("name").trim();
    let email = data.get("email").trim();
    let password = data.get("password").trim();
    let confirm = data.get("confirm").trim();

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
