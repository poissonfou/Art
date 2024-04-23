import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchActions } from "../store";
import { useRef, useState } from "react";

import classes from "./Header.module.css";

import Popup from "./Popup";

function handleLogout() {
  localStorage.setItem("token", null);
}

function Header() {
  let navigate = useNavigate();
  let dispatch = useDispatch();

  let colapseValue = false;
  if (window.innerWidth < 500) colapseValue = true;

  let [error, setError] = useState({ isError: false });
  let [colapseHeader, setColapseHeader] = useState(colapseValue);
  let [showMenu, setShowMenu] = useState(false);
  let searchRef = useRef("");

  let token = localStorage.getItem("token");

  function redirectBoard() {
    navigate("/board");
  }

  async function search(event) {
    event.preventDefault();
    const QUERY = searchRef.current.value;

    if (QUERY == "") return;

    let response = await fetch(`http://localhost:3000/search?q=${QUERY}`);

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

    let search = {
      artists: results.results.artists,
      paintings: results.results.paintings,
    };

    dispatch(searchActions.sendSearch(search));
    searchRef.current.value = "";

    navigate("/search");
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 500 && !colapseHeader) {
      setColapseHeader(true);
    }
    if (window.innerWidth > 500 && colapseHeader) {
      setColapseHeader(false);
      if (showMenu) setShowMenu(false);
    }
  });

  return (
    <>
      {error.isError && (
        <Popup message={error.message} redirect={error.redirect} />
      )}
      <header className={classes.header}>
        {!colapseHeader && (
          <Link to={token !== "null" ? "/board" : "/"}>
            <h1 className={classes.logo}>ART</h1>
          </Link>
        )}
        {colapseHeader && (
          <h1
            className={classes.logo}
            onClick={() => {
              if (!colapseHeader) return "";
              setShowMenu((prevState) => !prevState);
            }}
          >
            ART
          </h1>
        )}
        {showMenu && (
          <div className={classes.dropdown_menu}>
            <p onClick={redirectBoard}>Explore</p>
            <Link to={token !== "null" ? "/board" : "/"}>
              <button>Home</button>
            </Link>
            {token == "null" || !token ? (
              <Link to="/auth?mode=login">
                <button>Login</button>
              </Link>
            ) : (
              <>
                <Link to="/profile">
                  <button>Profile</button>
                </Link>
                <Link to="/auth/update">
                  <button>Update Info</button>
                </Link>
                <Link to="/" onClick={handleLogout}>
                  <button>Logout</button>
                </Link>
              </>
            )}
          </div>
        )}
        <div className={classes.header_actions}>
          <form action="GET" onSubmit={search}>
            <label htmlFor="search" style={{ display: "none" }}></label>
            <input
              type="text"
              name="search"
              ref={searchRef}
              placeholder="search"
            />
          </form>
          {!colapseHeader && (
            <>
              <p onClick={redirectBoard}>Explore</p>
              {token == "null" || !token ? (
                <Link to="/auth?mode=login">
                  <button>Login</button>
                </Link>
              ) : (
                <Link to="/" onClick={handleLogout}>
                  <button>Logout</button>
                </Link>
              )}
            </>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
