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
}) {
  let route = useLocation();

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
        console.log(data);
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
    fetchPaintings();
  }, []);

  const [queries] = useSearchParams();
  let loggedIn = queries.get("loggedIn");

  let fileChunks = url.split("/");
  let fileName = fileChunks[fileChunks.length - 1];

  async function savePainting(paintingId) {
    if (loggedIn == "false") {
      navigate("/auth?mode=login");
    }

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
      console.log(response);
      return;
    }

    setSavedPaintings((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      delete newState[paintingId];
      return newState;
    });

    console.log(route);

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

    console.log(await response.json());
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
              <span className="material-symbols-outlined">bookmark_added</span>
            </button>
          ) : (
            <button onClick={() => savePainting(paintingId)}>
              <span className="material-symbols-outlined">bookmark_add</span>
            </button>
          )}
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
