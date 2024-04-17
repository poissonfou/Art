import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import SideTabProfile from "../components/SideTabProfile";
import SideTab from "../components/SideTab";

import classes from "./Search.module.css";

let detailsInitial = {
  set: false,
  country: "",
  year: "",
  url: "",
  originalName: "",
  source: "",
  artists: "",
  name: "",
  id: "",
};

function Search() {
  const search = useSelector((state) => state);
  const [artistsPaintings, setArtistsPaintings] = useState({
    paintings: [],
    name: "",
  });
  const [showArtist, setShowArtist] = useState({ displayed: false, idx: -1 });
  const [details, setDetails] = useState(detailsInitial);

  function getDetails(info) {
    setDetails((prevDetails) => {
      let newState = JSON.parse(JSON.stringify(prevDetails));
      newState.set = true;
      newState.country = info.country;
      newState.year = info.year;
      newState.url = info.url;
      newState.originalName = info.originalName;
      newState.source = info.source;
      if (showArtist.displayed) {
        newState.artists = [{ name: artistsPaintings.name }];
      } else {
        newState.artists = info.artists;
      }
      newState.name = info.name;
      newState.id = info._id;
      return newState;
    });
  }

  function closeTab() {
    setDetails((prevDetails) => {
      let newState = JSON.parse(JSON.stringify(prevDetails));
      newState.set = false;
      return newState;
    });
  }

  async function getArtistsPaintings(index) {
    setArtistsPaintings((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.paintings = search.artists[index].paintings;
      newState.name = search.artists[index].name;
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
  }, [search]);

  return (
    <main>
      {localStorage.getItem("token") !== "null" && <SideTabProfile />}
      {!search.artists.length && !search.paintings.length && (
        <div className={classes.no_result}>
          <h1>No Results</h1>
          <span className="material-symbols-outlined">cancel</span>
        </div>
      )}
      <div className={classes.search_display}>
        {search.artists.length ? (
          <div className={classes.artists_display}>
            <h1>Artists</h1>
            <div className={classes.artists_items}>
              {search.artists.map((artist, index) => {
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
            search.paintings.map((painting, index) => {
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
      <SideTab
        show={details.set}
        url={details.url}
        name={details.name}
        originalName={details.originalName}
        year={details.year}
        artistsProp={details.artists}
        country={details.country}
        source={details.source}
        paintingId={details.id}
        closeTab={closeTab}
      />
    </main>
  );
}

export default Search;
