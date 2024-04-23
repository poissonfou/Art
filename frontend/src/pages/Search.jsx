import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import SideTabProfile from "../components/SideTabProfile";
import SideTab from "../components/SideTab";

import classes from "./Search.module.css";

import { paintingDetailsActions } from "../store";

function Search() {
  const SEARCH_RESULT = useSelector((state) => state.search);

  const [artistsPaintings, setArtistsPaintings] = useState({
    paintings: [],
    name: "",
  });
  const [showArtist, setShowArtist] = useState({ displayed: false, idx: -1 });

  let showTab = window.innerWidth > 500;
  let [showProfileTab, setShowProfileTab] = useState(showTab);

  const dispatch = useDispatch();

  window.addEventListener("resize", () => {
    if (window.innerWidth < 500 && showProfileTab) {
      setShowProfileTab(false);
    }
    if (window.innerWidth > 500 && !showProfileTab) {
      setShowProfileTab(true);
    }
  });

  function getDetails(info) {
    let newPainting = {
      country: info.country,
      year: info.year,
      url: info.url,
      originalName: info.originalName,
      source: info.source,
      name: info.name,
      id: info._id,
    };

    if (showArtist.displayed) {
      newPainting.artists = [{ name: artistsPaintings.name }];
    } else {
      newPainting.artists = info.artists;
    }

    dispatch(
      paintingDetailsActions.setPaintingDetails({ details: newPainting })
    );
  }

  function closeTab() {
    dispatch(paintingDetailsActions.closeTab(false));
  }

  function getArtistsPaintings(index) {
    setArtistsPaintings((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.paintings = SEARCH_RESULT.artists[index].paintings;
      newState.name = SEARCH_RESULT.artists[index].name;
      return newState;
    });

    setShowArtist((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.displayed = true;
      newState.idx = index;
      return newState;
    });
  }

  useEffect(() => {
    closeTab();
  }, [SEARCH_RESULT]);

  return (
    <main>
      {localStorage.getItem("token") !== "null" && showProfileTab && (
        <SideTabProfile />
      )}
      {!SEARCH_RESULT.artists.length && !SEARCH_RESULT.paintings.length && (
        <div className={classes.no_result}>
          <h1>No Results</h1>
          <span className="material-symbols-outlined">cancel</span>
        </div>
      )}
      <div className={classes.search_display}>
        {SEARCH_RESULT.artists.length ? (
          <div className={classes.artists_display}>
            <h1>Artists</h1>
            <div className={classes.artists_items}>
              {SEARCH_RESULT.artists.map((artist, index) => {
                return (
                  <div
                    onClick={
                      showArtist.displayed && showArtist.idx == index
                        ? () =>
                            setShowArtist((prevState) => {
                              let newState = JSON.parse(
                                JSON.stringify(prevState)
                              );
                              newState.displayed = false;
                              newState.idx = -1;
                              return newState;
                            })
                        : () => getArtistsPaintings(index)
                    }
                    key={index}
                    className={classes.artists_item}
                  >
                    <p>{artist.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className={classes.paintings_display}>
          {showArtist.displayed &&
            artistsPaintings.paintings.map((painting, index) => {
              return (
                <div
                  className={classes.img}
                  key={index}
                  onClick={() => getDetails(painting)}
                  title={painting.name}
                >
                  <img src={painting.url} alt="paintings" id={painting._id} />
                </div>
              );
            })}
          {!showArtist.displayed &&
            SEARCH_RESULT.paintings.map((painting, index) => {
              return (
                <div
                  className={classes.img}
                  key={index}
                  onClick={() => getDetails(painting)}
                  title={painting.name}
                >
                  <img src={painting.url} alt="paintings" id={painting._id} />
                </div>
              );
            })}
        </div>
      </div>
      <SideTab />
    </main>
  );
}

export default Search;
