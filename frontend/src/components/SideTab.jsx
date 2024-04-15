import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import classes from "./SideTab.module.css";

function SideTab({
  url,
  name,
  originalName,
  year,
  artistsProp,
  country,
  source,
  show,
  closeTab,
  paintingId,
  updatedBoard,
  disableBookmark = false,
}) {
  let route = useLocation();

  let [error, setError] = useState({ isError: false });

  let artists = artistsProp;
  let artistsNames = [];

  for (let i = 0; i < artists.length; i++) {
    artistsNames.push(artists[i].name);
  }

  artistsNames = artistsNames.toString();
  artistsNames = artistsNames.replaceAll(",", ", ");

  const navigate = useNavigate();

  const [savedPaintings, setSavedPaintings] = useState({});

  useEffect(() => {
    async function fetchPaintings() {
      let token = localStorage.getItem("token");

      let data = await fetch("http://localhost:3000/paintings/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data.ok) {
        data = await data.json();

        setError((prevState) => {
          let newState = JSON.parse(JSON.stringify(prevState));
          newState.isError = true;
          newState.message = "Could not fetch user paintings.";
          newState.redirect = "reload";
          return newState;
        });
        return;
      }

      const paintings = await data.json();

      for (let i = 0; i < paintings.paintings.length; i++) {
        setSavedPaintings((prevState) => {
          let newPaintings = JSON.parse(JSON.stringify(prevState));
          newPaintings[paintings.paintings[i]._id] = paintings.paintings[i];
          return newPaintings;
        });
      }
    }
    if (
      localStorage.getItem("token") !== "null" &&
      localStorage.getItem("token")
    ) {
      fetchPaintings();
    }
  }, []);

  const [queries] = useSearchParams();
  let loggedIn = queries.get("loggedIn");

  let fileChunks = url.split("/");
  let fileName = fileChunks[fileChunks.length - 1];

  async function savePainting(paintingId) {
    if (loggedIn == "false") {
      navigate("/auth?mode=login");
    }

    if (error.isError) return;

    if (savedPaintings[paintingId]) return;

    let token = localStorage.getItem("token");

    let response = await fetch(
      "http://localhost:3000/paintings/" + paintingId,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return;
    }

    setSavedPaintings((prevState) => {
      let newObject = JSON.parse(JSON.stringify(prevState));
      newObject[paintingId] = paintingId;
      return newObject;
    });
  }

  async function dropPainting(paintingId) {
    if (error.isError) return;

    let token = localStorage.getItem("token");

    let response = await fetch(
      "http://localhost:3000/paintings/" + paintingId,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return;
    }

    setSavedPaintings((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      delete newState[paintingId];
      return newState;
    });

    if (route.pathname == "/profile") {
      let paintings = JSON.parse(JSON.stringify(savedPaintings));

      delete paintings[paintingId];

      paintings = Object.values(paintings);

      updatedBoard((prevState) => {
        let newState = JSON.parse(JSON.stringify(prevState));
        newState = paintings;
        return newState;
      });

      closeTab();
    }
  }

  return (
    <div
      className={`${classes.tab_container} ${
        route.pathname == "/profile" ? classes.static : classes.absolute
      } ${show ? classes.show : ""}`}
    >
      <span
        className={`${"material-symbols-outlined"} ${classes.close}`}
        onClick={closeTab}
      >
        navigate_next
      </span>
      <img src={url} alt={name} />
      <div className={classes.info_actions}>
        <div>
          {!disableBookmark ? (
            <>
              <a
                href={`http://localhost:3000/imgs/download/` + fileName}
                download={fileName}
              >
                <button>
                  <span className="material-symbols-outlined">download</span>
                </button>
              </a>
              {savedPaintings[paintingId] ? (
                <button onClick={() => dropPainting(paintingId)}>
                  <span className="material-symbols-outlined">
                    bookmark_added
                  </span>
                </button>
              ) : (
                <button onClick={() => savePainting(paintingId)}>
                  <span className="material-symbols-outlined">
                    bookmark_add
                  </span>
                </button>
              )}
            </>
          ) : (
            <a
              href={`http://localhost:3000/imgs/download/` + fileName}
              download={fileName}
            >
              <button>
                <span className="material-symbols-outlined">download</span>
              </button>
            </a>
          )}

          {error.isError && <p>Couldn't get user paintings, please reload.</p>}
        </div>
        <div className={classes.info}>
          <p>{`${originalName} | ${year} (${name})`}</p>
          <p>{`${artistsNames} | ${country}`}</p>
          <a href={source}>Learn more.</a>
        </div>
      </div>
    </div>
  );
}

export default SideTab;
