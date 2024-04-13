import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchActions } from "../store";
import { useRef, useState } from "react";

import classes from "./Header.module.css";

import Popup from "./Popup";

function handleLogout() {
  localStorage.setItem("token", null);
  localStorage.setItem("id", null);
}

function Header() {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  let [error, setError] = useState({ isError: false });
  let searchRef = useRef("");

  let userId = localStorage.getItem("id");

  function redirectBoard() {
    navigate("/board");
  }

  async function search(event) {
    event.preventDefault();
    let query = searchRef.current.value;

    if (query == "") return;

    let response = await fetch(`http://localhost:3000/search?q=${query}`);

    if (!response.ok) {
      response = await response.json();

      setError((prevState) => {
        let newState = JSON.parse(JSON.stringify(prevState));
        newState.isError = true;
        newState.message = "Could not send search.";
        newState.redirect = "reload";
        return newState;
      });
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
    <>
      {error.isError && (
        <Popup message={error.message} redirect={error.redirect} />
      )}
      <header>
        <Link to={localStorage.getItem("token") !== "null" ? "/board" : "/"}>
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
    </>
  );
}

export default Header;
