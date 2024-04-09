import { Link, redirect, useSearchParams } from "react-router-dom";

import Form from "../components/Form";

import classes from "./Auth.module.css";

function Login() {
  const [searchParams] = useSearchParams();
  let query = searchParams.get("mode");

  return (
    <>
      {query == "signup" ? (
        <main className={classes.main_signup}>
          <Form>
            <h1>Signup</h1>
            <div>
              <label htmlFor="name">Name</label>
              <input type="text" name="name" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input type="text" name="email" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="text" name="password" />
            </div>
            <div>
              <label htmlFor="password">Confirm Password</label>
              <input type="text" name="password" />
            </div>
            <button type="submit">Signup</button>
          </Form>
        </main>
      ) : (
        <main className={classes.main_login}>
          <Form>
            <h1>Login</h1>
            <div>
              <label htmlFor="email">Email</label>
              <input type="text" name="email" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="text" name="password" />
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

export default Login;

export async function action({ request, params }) {
  const searchParams = new URL(request.url).searchParams;

  if (searchParams.get("mode") == "login") {
    const data = await request.formData();

    const formData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    let userData = await response.json();

    localStorage.setItem("token", userData.token);
    localStorage.setItem("id", userData.userId);

    return redirect("/board?loggedIn=true");
  } else {
    const data = await request.formData();

    const formData = {
      email: data.get("email"),
      password: data.get("password"),
      name: data.get("name"),
    };

    const response = await fetch("http://localhost:3000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    return redirect("/auth?mode=login");
  }
}
