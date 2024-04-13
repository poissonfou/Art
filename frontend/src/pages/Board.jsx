import { useLoaderData } from "react-router-dom";
import { useState } from "react";

import SideTab from "../components/SideTab";
import SideTabProfile from "../components/SideTabProfile";
import Popup from "../components/Popup";

import classes from "./Board.module.css";

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

function Board() {
  const [details, setDetails] = useState(detailsInitial);
  const paintings = useLoaderData();

  function moveDisplay(event) {
    let display = document.getElementById("display");
    let x = event.clientX;
    let y = event.clientY;

    let xDecimal = x / window.innerWidth;
    let yDecimal = y / window.innerHeight;

    let maxX = display.offsetWidth - window.innerWidth;
    let maxY = display.offsetHeight - window.innerHeight;

    const panX = maxX * xDecimal * -1;
    const panY = maxY * yDecimal * -1;

    display.animate(
      {
        transform: `translate(${panX}px, ${panY}px)`,
      },
      {
        duration: 4000,
        fill: "forwards",
        easing: "ease",
      }
    );
  }

  function getDetails(info) {
    setDetails((prevDetails) => {
      let newState = JSON.parse(JSON.stringify(prevDetails));
      if (newState.set && newState.name == info.name) {
        newState.set = false;
        return newState;
      }
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
      return newState;
    });
  }
  return (
    <>
      {paintings.isError && (
        <Popup message={paintings.message} redirect={paintings.redirect} />
      )}
      <main className={classes.main}>
        {localStorage.getItem("token") !== "null" && <SideTabProfile />}
        <div
          className={classes.main_board}
          onMouseMove={moveDisplay}
          id="display"
        >
          {paintings.paintings.map((painting, index) => {
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
    </>
  );
}

export default Board;

export async function loader() {
  const data = await fetch("http://localhost:3000/paintings");

  if (!data.ok) {
    let response = await data.json();

    return {
      isError: true,
      message: response.message,
      redirect: "reload",
      paintings: [],
    };
  }

  let paintings = await data.json();

  return paintings;
}
