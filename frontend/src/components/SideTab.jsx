import { useSearchParams, useNavigate, useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";

import classes from "./SideTab.module.css";

function SideTab({
  url,
  name,
  originalName,
  year,
  author,
  country,
  source,
  show,
  closeTab,
  paintingId,
}) {
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

  return (
    <div className={`${classes.tab_container} ${show ? classes.show : ""}`}>
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
            <button>
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
          <p>{`${author} | ${country}`}</p>
          <a href={source}>Learn more.</a>
        </div>
      </div>
    </div>
  );
}

export default SideTab;
