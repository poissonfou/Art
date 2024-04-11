import { useLoaderData } from "react-router-dom";
import { useState } from "react";

import SideTab from "../components/SideTab";
import SideTabProfile from "../components/SideTabProfile";
import Form from "../components/Form";

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

let paintingsCopy = {};

function Profile() {
  const { paintings, collections } = useLoaderData();

  const [details, setDetails] = useState(detailsInitial);
  const [paintingsState, setPaintingsState] = useState(paintings);
  const [selectedPainting, setSelectedPainting] = useState({});
  const [showForm, setShowForm] = useState(false);

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

  function selectPainting(painting) {
    setSelectedPainting((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState[painting._id] = painting;
      paintingsCopy[painting._id] = painting;
      return newState;
    });
  }

  function changeShowForm() {
    setShowForm((prevState) => !prevState);
    setSelectedPainting((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState = {};
      return newState;
    });
  }

  return (
    <main className={classes.container}>
      <SideTabProfile className={classes.profile_tab} />
      <div className={classes.middle_section}>
        <div className={classes.collections}>
          {collections.map((collection, index) => {
            return (
              <div className={classes.collection_item} key={index}>
                <img src={collection.paintings[0].url} alt="collection cover" />
                <p>{collection.name}</p>
              </div>
            );
          })}
          <span
            className={`${"material-symbols-outlined"} ${classes.add}`}
            onClick={changeShowForm}
          >
            add
          </span>
        </div>
        <div className={classes.main}>
          {showForm && (
            <Form>
              <div>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" />
              </div>
              <button>Create</button>
            </Form>
          )}
          <div className={classes.main_board} id="display">
            {paintingsState.map((painting, index) => {
              return (
                <div
                  className={`${classes.img} ${
                    showForm && selectedPainting[painting._id]
                      ? classes.selected
                      : classes.border
                  }`}
                  key={index}
                  onClick={
                    !showForm
                      ? () => getDetails(painting)
                      : () => selectPainting(painting)
                  }
                >
                  <img src={painting.url} alt="paintings" id={painting._id} />
                </div>
              );
            })}
          </div>
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
        updatedBoard={setPaintingsState}
      />
    </main>
  );
}

export default Profile;

export async function loader() {
  let token = localStorage.getItem("token");

  let [painting, collections] = await Promise.all([
    fetch("http://localhost:3000/paintings/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((paintings) => paintings.json()),
    fetch("http://localhost:3000/user/collections", {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    }).then((collections) => collections.json()),
  ]);

  return {
    paintings: painting.paintings,
    collections: collections.collections,
  };
}

export async function action({ request }) {
  let token = localStorage.getItem("token");
  let data = await request.formData();
  let name = data.get("name");

  if (name == "") {
    return;
  }

  let paintings = Object.values(paintingsCopy);

  const formData = {
    collection: {
      name,
      paintings,
    },
  };

  let response = await fetch("http://localhost:3000/user/collections", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    console.log(response);
    return;
  }

  let collections = await response.json();

  console.log(collections);
  paintingsCopy = {};
  return window.location.reload();
}
