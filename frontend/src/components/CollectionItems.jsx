import classes from "./CollectionItems.module.css";

function CollectionItems({
  userActions,
  collectionsData,
  setUserActions,
  setCollectionsData,
  updateCollectionItem,
  deleteCollection,
  getDetails,
  selectPainting,
  paintingsData,
  error,
  displayClose,
}) {
  return (
    <div className={classes.collection_display}>
      {displayClose && (
        <span
          className="material-symbols-outlined"
          onClick={() =>
            setCollectionsData((prevState) => {
              let newState = JSON.parse(JSON.stringify(prevState));
              newState.displayingDetails = false;
              return newState;
            })
          }
        >
          close
        </span>
      )}
      <h1>{collectionsData.selectedCollection.name}</h1>
      <div className={classes.collections_actions}>
        <button
          onClick={
            !userActions.update
              ? () =>
                  setUserActions((prevState) => {
                    let newState = JSON.parse(JSON.stringify(prevState));
                    newState.update = !newState.update;
                    return newState;
                  })
              : () =>
                  updateCollectionItem(
                    collectionsData.selectedCollection,
                    false
                  )
          }
          className={userActions.update ? classes.highlight_button : ""}
        >
          Add
        </button>
        <button
          onClick={
            !userActions.delete
              ? () =>
                  setUserActions((prevState) => {
                    let newState = JSON.parse(JSON.stringify(prevState));
                    newState.delete = !newState.delete;
                    return newState;
                  })
              : () =>
                  updateCollectionItem(collectionsData.selectedCollection, true)
          }
          className={userActions.delete ? classes.highlight_button : ""}
        >
          Remove
        </button>
        <button
          onClick={() => deleteCollection(collectionsData.selectedCollection)}
        >
          Delete
        </button>
      </div>
      {error.isError && <p>{error.message}</p>}
      <div className={classes.collection_items_display}>
        {collectionsData.selectedCollection.paintings.map((painting, index) => {
          return (
            <div
              className={`${classes.collection_img} ${
                userActions.delete &&
                paintingsData.selectedPaintings[painting._id]
                  ? classes.selected
                  : classes.border
              }`}
              key={index}
              title={painting.name}
              onClick={
                !userActions.delete
                  ? () => getDetails(painting, true)
                  : () => selectPainting(painting)
              }
            >
              <img src={painting.url} alt="paintings" id={painting._id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CollectionItems;
