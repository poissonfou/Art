import { useLoaderData, useActionData } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";

import SideTab from "../components/SideTab";
import SideTabProfile from "../components/SideTabProfile";
import Form from "../components/Form";
import Popup from "../components/Popup";
import CollectionItem from "../components/CollectionItems";

import { paintingDetailsActions } from "../store";

import classes from "./Profile.module.css";

let selectedPaintingsCopy = {};

function Profile() {
  const { userPaintings, userCollections } = useLoaderData();
  let actionData = useActionData();
  const dispatch = useDispatch();
  const API_TOKEN = localStorage.getItem("token");

  let showTab = window.innerWidth < 500;
  let repositionCollectionDisplay = window.innerWidth < 800;
  let [showProfileTab, setShowProfileTab] = useState(showTab);
  let [repositionCollection, setRepositionCollection] = useState(
    repositionCollectionDisplay
  );

  window.addEventListener("resize", () => {
    if (window.innerWidth > 500 && showProfileTab) {
      setShowProfileTab(false);
    }

    if (window.innerWidth < 500 && !showProfileTab) {
      setShowProfileTab(true);
    }

    if (window.innerWidth > 900 && repositionCollection) {
      setRepositionCollection(false);
    }

    if (window.innerWidth < 900 && !repositionCollection) {
      setRepositionCollection(true);
    }
  });

  const [paintingsData, setPaintingsData] = useState({
    paintings: userPaintings.paintings,
    selectedPaintings: {},
  });
  const [userActions, setUserActions] = useState({
    create: false,
    delete: false,
    update: false,
  });
  const [collectionsData, setCollectionsData] = useState({
    displayingDetails: false,
    collections: userCollections.collections,
    selectedCollection: {
      name: "",
      paintings: [],
    },
  });
  const [error, setError] = useState({ isError: false });

  if (!actionData) {
    actionData = { isError: false, payload: false };
  }

  if (actionData.payload) {
    actionData.payload = false;
    setCollectionsData((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.collections = actionData.collections;
      return newState;
    });
    setUserActions((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.create = false;
      return newState;
    });
  }

  if (!error.isError) {
    let message;
    if (!userPaintings.ok) message = "Could not fetch user paintings.";
    if (!userCollections.ok) message = "Could not fetch collections.";
    if (message)
      setError((prevState) => {
        let newState = JSON.parse(JSON.stringify(prevState));
        newState.isError = true;
        newState.message = message;
        newState.redirect = "reload";
        return newState;
      });
  }

  function getDetails(info, isCollection) {
    let newPainting = {
      country: info.country,
      year: info.year,
      url: info.url,
      originalName: info.originalName,
      source: info.source,
      name: info.name,
      id: info._id,
      artists: info.artists,
    };

    let disableBookmark = collectionsData.displayingDetails && isCollection;

    dispatch(
      paintingDetailsActions.setPaintingDetails({
        details: newPainting,
        disableBookmark,
      })
    );
  }

  function selectPainting(painting) {
    setPaintingsData((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      if (newState.selectedPaintings[painting._id]) {
        delete newState.selectedPaintings[painting._id];
        return newState;
      }
      newState.selectedPaintings[painting._id] = painting;
      selectedPaintingsCopy[painting._id] = painting;
      return newState;
    });
  }

  function changeShowForm() {
    setUserActions((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.create = !newState.create;
      return newState;
    });

    setPaintingsData((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.selectedPaintings = {};
      return newState;
    });
  }

  function changeShowCollection(collection) {
    setCollectionsData((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.displayingDetails = !newState.displayingDetails;
      newState.selectedCollection = {
        name: collection.name,
        paintings: collection.paintings,
      };
      return newState;
    });
  }

  async function deleteCollection(collection) {
    let response = await fetch(
      "http://localhost:3000/user/collections/" + collection.name,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      setError({
        isError: true,
        message: "Could not delete collection. Please reload.",
        redirect: "reload",
      });
      return;
    }

    setCollectionsData((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      let collections = newState.collections;
      for (let i = 0; i < newState.collections; i++) {
        if (newState.collections[i].name == collection.name) {
          collections.split(i, 1);
        }
      }
      newState.displayingDetails = false;
      newState.collections = collections;
      return newState;
    });
  }

  async function updateCollectionItem(collection, deleting) {
    const SELECTED_PAINTINGS_IDS = Object.keys(paintingsData.selectedPaintings);
    const SELECTED_PAINTINGS_VALUES = Object.values(
      paintingsData.selectedPaintings
    );
    const CURRENT_PAINTINGS_IDS = collection.paintings.map(
      (painting) => painting._id
    );
    let updatedPaintings = [];

    setUserActions((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      if (newState.delete) {
        newState.delete = !newState.delete;
      }
      if (newState.update) {
        newState.update = !newState.update;
      }
      return newState;
    });

    if (!SELECTED_PAINTINGS_IDS.length) return;

    if (deleting) {
      for (let i = 0; i < collection.paintings.length; i++) {
        if (!SELECTED_PAINTINGS_IDS.includes(CURRENT_PAINTINGS_IDS[i])) {
          updatedPaintings.push(collection.paintings[i]);
        }
      }
    } else {
      for (let i = 0; i < SELECTED_PAINTINGS_IDS.length; i++) {
        if (!CURRENT_PAINTINGS_IDS.includes(SELECTED_PAINTINGS_IDS[i])) {
          updatedPaintings.push(SELECTED_PAINTINGS_VALUES[i]);
        }
      }

      updatedPaintings = [...collection.paintings, ...updatedPaintings];
    }

    const updatedCollection = {
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
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      setError({
        isError: true,
        message: "Could not save update. Please reload and try again.",
        redirect: "reload",
      });
      return;
    }

    setCollectionsData((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.displayingDetails = true;
      newState.selectedCollection = {
        name: collection.name,
        paintings: updatedPaintings,
      };
      return newState;
    });

    setPaintingsData((prevState) => {
      let newState = JSON.parse(JSON.stringify(prevState));
      newState.selectedPaintings = {};
      return newState;
    });

    selectedPaintingsCopy = {};
  }

  return (
    <>
      {error.isError && !userPaintings.ok && (
        <Popup message={error.message} redirect={error.redirect} />
      )}
      <main className={classes.container}>
        {!showProfileTab && <SideTabProfile />}
        <div className={classes.middle_section}>
          <div className={classes.collections}>
            <h2>Collections</h2>
            <div className={classes.collections_icons}>
              {error.isError && !userCollections.ok && (
                <p className={classes.error_message}>
                  {error.message + " Please reload"}
                </p>
              )}
              {userCollections.ok &&
                collectionsData.collections.map((collection, index) => {
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
              {userCollections.ok && (
                <span
                  className={`${"material-symbols-outlined"} ${classes.add}`}
                  onClick={changeShowForm}
                >
                  add
                </span>
              )}
            </div>
            {collectionsData.displayingDetails && repositionCollection && (
              <CollectionItem
                userActions={userActions}
                collectionsData={collectionsData}
                setUserActions={setUserActions}
                updateCollectionItem={updateCollectionItem}
                deleteCollection={deleteCollection}
                getDetails={getDetails}
                selectPainting={selectPainting}
                paintingsData={paintingsData}
                setCollectionsData={setCollectionsData}
                error={error}
                displayClose={false}
              />
            )}
          </div>
          <div className={classes.main}>
            {userActions.create && (
              <>
                <Form>
                  <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" placeholder="title" />
                    {actionData.isError && (
                      <p className={classes.error_message}>
                        {actionData.message}
                      </p>
                    )}
                  </div>
                  <button>Create</button>
                </Form>
              </>
            )}
            <div className={classes.main_board} id="display">
              {userPaintings.ok &&
                paintingsData.paintings.map((painting, index) => {
                  return (
                    <div
                      className={`${classes.img} ${
                        (userActions.create || userActions.update) &&
                        paintingsData.selectedPaintings[painting._id]
                          ? classes.selected
                          : classes.border
                      }`}
                      key={index}
                      onClick={
                        !userActions.create && !userActions.update
                          ? () => getDetails(painting)
                          : () => selectPainting(painting)
                      }
                      title={painting.name}
                    >
                      <img
                        src={painting.url}
                        alt="paintings"
                        id={painting._id}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {collectionsData.displayingDetails && !repositionCollection && (
          <div className={classes.collection_display}>
            <CollectionItem
              userActions={userActions}
              collectionsData={collectionsData}
              setUserActions={setUserActions}
              updateCollectionItem={updateCollectionItem}
              deleteCollection={deleteCollection}
              getDetails={getDetails}
              selectPainting={selectPainting}
              paintingsData={paintingsData}
              setCollectionsData={setCollectionsData}
              error={error}
              displayClose={true}
            />
          </div>
        )}
        <SideTab updatedBoard={setPaintingsData} />
      </main>
    </>
  );
}

export default Profile;

export async function loader() {
  const API_TOKEN = localStorage.getItem("token");

  const [userPaintings, userCollections] = await Promise.all([
    fetch("http://localhost:3000/paintings/user", {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }).then((paintings) => paintings.json()),
    fetch("http://localhost:3000/user/collections", {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }).then((collections) => collections.json()),
  ]);

  if (userPaintings.message == "Success") {
    userPaintings.ok = true;
  }

  if (userCollections.message == "Success") {
    userCollections.ok = true;
  }

  return {
    userCollections,
    userPaintings,
  };
}

export async function action({ request }) {
  const API_TOKEN = localStorage.getItem("token");
  const INPUT_DATA = await request.formData();
  const name = INPUT_DATA.get("title");

  if (name == "") {
    return {
      isError: true,
      message: "Please enter a title.",
      payload: false,
    };
  }

  const selectedPaintings = Object.values(selectedPaintingsCopy);

  if (!selectedPaintings.length) {
    return {
      isError: true,
      message: "Please select at least one painting.",
      payload: false,
    };
  }

  const formData = {
    collection: {
      name,
      paintings: selectedPaintings,
    },
  };

  let response = await fetch("http://localhost:3000/user/collections", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    response = await response.json();
    return {
      isError: true,
      message: response.message,
      payload: false,
    };
  }

  selectedPaintingsCopy = {};
  const collections = await response.json();
  return {
    isError: false,
    payload: true,
    collections: collections.collections,
  };
}
