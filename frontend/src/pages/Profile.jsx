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
  const [deletingItems, setDeletingItems] = useState(false);
  const [addingItems, setAddingItems] = useState(false);
  const [collection, setCollection] = useState({ show: false });
  const [collectionsState, setCollectionsState] = useState(collections);

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

  function changeShowCollection(collection) {
    setCollection((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.show = !newState.show;
      newState.paintings = collection.paintings;
      newState.name = collection.name;
      return newState;
    });
  }

  async function deleteCollection(collection) {
    let token = localStorage.getItem("token");

    let response = await fetch(
      "http://localhost:3000/user/collections/" + collection.name,
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

    setCollectionsState((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      let index;
      for (let i = 0; i < newState.length; i++) {
        if (newState[i].name == collection.name) {
          index = i;
          break;
        }
      }

      newState.splice(index, 1);
      return newState;
    });

    setCollection((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState = { show: false };
      return newState;
    });

    let data = await response.json();

    console.log(data);
  }

  async function removeCollectionItem(collection, deleting) {
    let selectedItems = Object.keys(selectedPainting);
    let selectedItemsVals = Object.values(selectedPainting);
    let token = localStorage.getItem("token");
    let currentPaintings = [];
    let updatedPaintings = [];

    setDeletingItems((prevState) => {
      if (prevState) {
        return !prevState;
      }
      return prevState;
    });

    setAddingItems((prevState) => {
      if (prevState) {
        return !prevState;
      }
      return prevState;
    });

    if (!selectedItems.length) return;

    if (deleting) {
      for (let i = 0; i < collection.paintings.length; i++) {
        if (!selectedItems.includes(collection.paintings[i]._id)) {
          updatedPaintings.push(collection.paintings[i]);
        }
      }
    } else {
      for (let i = 0; i < collection.paintings.length; i++) {
        currentPaintings.push(collection.paintings[i]._id);
      }

      for (let i = 0; i < selectedItems.length; i++) {
        if (!currentPaintings.includes(selectedItems[i])) {
          updatedPaintings.push(selectedItemsVals[i]);
        }
      }

      updatedPaintings = [...collection.paintings, ...updatedPaintings];
    }

    let updatedCollection = {
      name: collection.name,
      paintings: updatedPaintings,
    };

    const formData = {
      name: collection.name,
      collection: updatedCollection,
    };

    let response = await fetch("http://localhost:3000/user/collection", {
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

    setCollection((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.show = true;
      newState.paintings = updatedPaintings;
      newState.name = collection.name;
      return newState;
    });

    setSelectedPainting((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState = {};
      return newState;
    });

    paintingsCopy = {};
  }

  return (
    <main className={classes.container}>
      <SideTabProfile className={classes.profile_tab} />
      <div className={classes.middle_section}>
        <div className={classes.collections}>
          <h2>Collections</h2>
          <div className={classes.collections_icons}>
            {collectionsState.map((collection, index) => {
              return (
                <div
                  className={classes.collection_item}
                  key={index}
                  onClick={() => changeShowCollection(collection)}
                >
                  <img
                    src={collection.paintings[0].url}
                    alt="collection cover"
                  />
                  <p title={collection.name}>{collection.name}</p>
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
                    (showForm || addingItems) && selectedPainting[painting._id]
                      ? classes.selected
                      : classes.border
                  }`}
                  key={index}
                  onClick={
                    !showForm && !addingItems
                      ? () => getDetails(painting)
                      : () => selectPainting(painting)
                  }
                  title={painting.name}
                >
                  <img src={painting.url} alt="paintings" id={painting._id} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {collection.show && (
        <div className={classes.collection_display}>
          <span
            className="material-symbols-outlined"
            onClick={() =>
              setCollection((prevState) => {
                let newState = JSON.parse(JSON.stringify(prevState));
                newState = { show: false };
                return newState;
              })
            }
          >
            close
          </span>
          <h1>{collection.name}</h1>
          <div className={classes.collections_actions}>
            <button
              onClick={
                !addingItems
                  ? () => setAddingItems((prevState) => !prevState)
                  : () => removeCollectionItem(collection, false)
              }
              className={addingItems ? classes.highlight_button : ""}
            >
              Add
            </button>
            <button
              onClick={
                !deletingItems
                  ? () => setDeletingItems((prevState) => !prevState)
                  : () => removeCollectionItem(collection, true)
              }
              className={deletingItems ? classes.highlight_button : ""}
            >
              Remove
            </button>
            <button onClick={() => deleteCollection(collection)}>Delete</button>
          </div>
          <div className={classes.collection_items_display}>
            {collection.paintings.map((painting, index) => {
              return (
                <div
                  className={`${classes.collection_img} ${
                    deletingItems && selectedPainting[painting._id]
                      ? classes.selected
                      : classes.border
                  }`}
                  key={index}
                  title={painting.name}
                  onClick={
                    !deletingItems
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
      )}
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
