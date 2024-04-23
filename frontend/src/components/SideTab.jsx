import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import classes from "./SideTab.module.css";

import { paintingDetailsActions } from "../store";

function SideTab({ updatedBoard }) {
  const ROUTE = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const PAINTING_DETAILS = useSelector(
    (state) => state.paintingDetails.details
  );
  const SHOW_BOOKMARK = useSelector(
    (state) => state.paintingDetails.disableBookmark
  );

  const API_TOKEN = localStorage.getItem("token");

  const [error, setError] = useState({ isError: false });
  const [userPaintings, setUserPaintings] = useState({});

  const ARTISTS = PAINTING_DETAILS.artists
    .map((artist) => artist.name)
    .toString()
    .replaceAll(",", ", ");

  useEffect(() => {
    async function fetchPaintings() {
      let data = await fetch("http://localhost:3000/paintings/user", {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
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

      const SAVED_PAINTINGS = await data.json();

      for (let i = 0; i < SAVED_PAINTINGS.paintings.length; i++) {
        setUserPaintings((prevState) => {
          let newPaintings = JSON.parse(JSON.stringify(prevState));
          newPaintings[SAVED_PAINTINGS.paintings[i]._id] =
            SAVED_PAINTINGS.paintings[i];
          return newPaintings;
        });
      }
    }
    if (API_TOKEN !== "null" && API_TOKEN) {
      fetchPaintings();
    }
  }, []);

  const URL = PAINTING_DETAILS.url.split("/");
  const FILE_NAME = URL[URL.length - 1];

  function closeTab() {
    dispatch(paintingDetailsActions.closeTab(false));
  }

  async function savePainting(paintingId) {
    if (API_TOKEN == "null" && !API_TOKEN) {
      navigate("/auth?mode=login");
    }

    if (error.isError) return;

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

    setUserPaintings((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState[paintingId] = paintingId;
      return newState;
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

    setUserPaintings((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      delete newState[paintingId];
      return newState;
    });

    if (ROUTE.pathname == "/profile") {
      let paintings = JSON.parse(JSON.stringify(userPaintings));

      delete paintings[paintingId];

      paintings = Object.values(paintings);

      updatedBoard((prevState) => {
        let newState = JSON.parse(JSON.stringify(prevState));
        newState.paintings = paintings;
        return newState;
      });

      closeTab();
    }
  }

  return (
    <div
      className={`${classes.tab_container} ${classes.absolute} ${
        PAINTING_DETAILS.showTab ? classes.show : ""
      }`}
    >
      <span
        className={`${"material-symbols-outlined"} ${classes.close}`}
        onClick={closeTab}
      >
        navigate_next
      </span>
      <img src={PAINTING_DETAILS.url} alt={PAINTING_DETAILS.name} />
      <div className={classes.info_actions}>
        <div>
          {!SHOW_BOOKMARK ? (
            <>
              <a
                href={`http://localhost:3000/imgs/download/` + FILE_NAME}
                download={FILE_NAME}
              >
                <button>
                  <span className="material-symbols-outlined">download</span>
                </button>
              </a>
              {userPaintings[PAINTING_DETAILS.id] ? (
                <button onClick={() => dropPainting(PAINTING_DETAILS.id)}>
                  <span className="material-symbols-outlined">
                    bookmark_added
                  </span>
                </button>
              ) : (
                <button onClick={() => savePainting(PAINTING_DETAILS.id)}>
                  <span className="material-symbols-outlined">
                    bookmark_add
                  </span>
                </button>
              )}
            </>
          ) : (
            <a
              href={`http://localhost:3000/imgs/download/` + FILE_NAME}
              download={FILE_NAME}
            >
              <button>
                <span className="material-symbols-outlined">download</span>
              </button>
            </a>
          )}
          {error.isError && <p>Couldn't get user paintings, please reload.</p>}
        </div>
        <div className={classes.info}>
          <p>{`${PAINTING_DETAILS.originalName} | ${PAINTING_DETAILS.year} (${PAINTING_DETAILS.name})`}</p>
          <p>{`${ARTISTS} | ${PAINTING_DETAILS.country}`}</p>
          <a href={PAINTING_DETAILS.source}>Learn more.</a>
        </div>
      </div>
    </div>
  );
}

export default SideTab;
