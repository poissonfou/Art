import { Link, useSearchParams, useNavigate } from "react-router-dom";

import classes from "./Header.module.css";

function handleLogout() {
  localStorage.setItem("token", null);
  localStorage.setItem("id", null);
}

function Header() {
  let navigate = useNavigate();

  const [queries] = useSearchParams();
  let loggedIn = queries.get("loggedIn");

  let userId = localStorage.getItem("id");

  function redirectBoard() {
    let token = localStorage.getItem("token");
    if (token == "null") {
      navigate("/board?loggedIn=false");
    } else {
      navigate("/board?loggedIn=true");
    }
  }
  return (
    <header>
      <Link to="/">
        <h1 className={classes.logo}>ART</h1>
      </Link>
      <div>
        <input type="text" placeholder="search" />
        <p onClick={redirectBoard}>Explore</p>
        {userId == "null" || !userId ? (
          <Link to="/auth?mode=login">
            <button>Login</button>
          </Link>
        ) : (
          <Link to="/" onClick={handleLogout}>
            <button>Logout</button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
