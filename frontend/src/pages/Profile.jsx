import { useLoaderData } from "react-router-dom";
import { useState } from "react";

import SideTab from "../components/SideTab";
import SideTabProfile from "../components/SideTabProfile";

import classes from "./Profile.module.css";

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

function Profile() {
  const paintingsLoader = useLoaderData();
  const [details, setDetails] = useState(detailsInitial);
  const [paintings, setPaintings] = useState(paintingsLoader);

  function getDetails(info) {
    setDetails((prevDetails) => {
      let newState = JSON.parse(JSON.stringify(prevDetails));
      newState.set = true;
      newState.country = info.country;
      newState.year = info.year;
      newState.url = info.url;
      newState.originalName = info.originalName;
      newState.source = info.source;
      newState.artists = info.artists;
      newState.name = info.name;
      newState.id = info._id;
      return newState;
    });
  }

  function closeTab() {
    setDetails((prevDetails) => {
      let newState = JSON.parse(JSON.stringify(prevDetails));
      newState.set = false;
      newState.country = "";
      newState.year = "";
      newState.url = "";
      newState.originalName = "";
      newState.source = "";
      newState.artists = "";
      newState.name = "";
      return newState;
    });
  }

  return (
    <main className={classes.container}>
      <SideTabProfile className={classes.profile_tab} />
      <div className={classes.main}>
        <div className={classes.main_board} id="display">
          {paintings.map((painting, index) => {
            return (
              <div
                className={classes.img}
                key={index}
                onClick={() => getDetails(painting)}
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
        updatedBoard={setPaintings}
      />
    </main>
  );
}

export default Profile;

export async function loader() {
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

  return paintings.paintings;
}
