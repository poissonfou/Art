import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchActions } from "../store";
import { useRef } from "react";

import classes from "./Header.module.css";

function handleLogout() {
  localStorage.setItem("token", null);
  localStorage.setItem("id", null);
}

function Header() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let router = useLocation();

  let searchRef = useRef("");

  let userId = localStorage.getItem("id");

  function redirectBoard() {
    let token = localStorage.getItem("token");
    if (token == "null") {
      navigate("/board?loggedIn=false");
    } else {
      navigate("/board?loggedIn=true");
    }
  }

  async function search(event) {
    event.preventDefault();
    let querry = searchRef.current.value;

    if (querry == "") return;

    let response = await fetch(`http://localhost:3000/search?q=${querry}`);

    if (!response.ok) {
      console.log(response);
      return;
    }

    let results = await response.json();

    let update = {
      artists: results.results.artists,
      paintings: results.results.paintings,
    };

    dispatch(searchActions.sendSearch(update));
    searchRef.current.value = "";

    navigate("/search");
  }

  return (
    <header>
      <Link
        to={
          localStorage.getItem("token") !== "null"
            ? "/board?loggedIn=true"
            : "/"
        }
      >
        <h1 className={classes.logo}>ART</h1>
      </Link>
      <div>
        <form action="GET" onSubmit={search}>
          <label htmlFor="search" style={{ display: "none" }}></label>
          <input
            type="text"
            name="search"
            ref={searchRef}
            placeholder="search"
          />
        </form>
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
