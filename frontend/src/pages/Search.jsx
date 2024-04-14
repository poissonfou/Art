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
  const [showArtist, setShowArtist] = useState(false);
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
      if (showArtist) {
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

  async function getArtistsPaintings(id) {
    let response = await fetch("http://localhost:3000/artists/" + id);

    if (!response.ok) {
      console.log(response);
      return;
    }

    let artist = await response.json();

    setArtistsPaintings((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.paintings = artist.artist.paintings;
      newState.name = artist.artist.name;
      return newState;
    });

    setShowArtist(true);
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
            <div>
              {search.artists.map((artist, index) => {
                return (
                  <div
                    onClick={
                      showArtist
                        ? () => setShowArtist((prevState) => !prevState)
                        : () => getArtistsPaintings(artist._id)
                    }
                    key={index}
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
          {showArtist &&
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
          {!showArtist &&
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
