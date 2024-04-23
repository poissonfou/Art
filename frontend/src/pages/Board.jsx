import { useLoaderData } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";

import SideTab from "../components/SideTab";
import SideTabProfile from "../components/SideTabProfile";
import Popup from "../components/Popup";

import classes from "./Board.module.css";

import { paintingDetailsActions } from "../store";

function Board() {
  const paintings = useLoaderData();
  const dispatch = useDispatch();
  const IS_TOUCH_SCREEN = "ontouchmove" in window;

  const showTab = window.innerWidth > 500;
  const [showProfileTab, setShowProfileTab] = useState(showTab);

  window.addEventListener("resize", () => {
    if (window.innerWidth < 500 && showProfileTab) {
      setShowProfileTab(false);
    }
    if (window.innerWidth > 500 && !showProfileTab) {
      setShowProfileTab(true);
    }
  });

  function moveDisplay(event) {
    let display = document.getElementById("display");
    let x, y;

    x = event.clientX;
    y = event.clientY;

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
    let newPainting = {
      country: info.country,
      year: info.year,
      url: info.url,
      originalName: info.originalName,
      source: info.source,
      artists: info.artists,
      name: info.name,
      id: info._id,
    };

    dispatch(
      paintingDetailsActions.setPaintingDetails({ details: newPainting })
    );
  }

  return (
    <>
      {paintings.isError && (
        <Popup message={paintings.message} redirect={paintings.redirect} />
      )}
      <main className={classes.main}>
        {localStorage.getItem("token") !== "null" && showProfileTab && (
          <SideTabProfile />
        )}
        <div
          className={
            !IS_TOUCH_SCREEN ? classes.main_board : classes.main_board_mobile
          }
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
        <SideTab />
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
