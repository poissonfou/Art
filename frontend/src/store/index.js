import { createSlice, configureStore } from "@reduxjs/toolkit";

let search = { artists: [], paintings: [] };
let painting = {
  details: {
    showTab: false,
    country: "",
    year: "",
    url: "",
    originalName: "",
    source: "",
    artists: [],
    name: "",
    id: "",
  },
  disableBookMark: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState: search,
  reducers: {
    sendSearch(state, action) {
      state.artists = action.payload.artists;
      state.paintings = action.payload.paintings;
    },
  },
});

const paintingDetailsSlice = createSlice({
  name: "paintingDetails",
  initialState: painting,
  reducers: {
    setPaintingDetails(state, { payload }) {
      if (payload.disableBookMark) {
        state.disableBookMark = true;
      }
      let displayTab = state.details.id !== payload.details.id;
      state.details = payload.details;
      if (!displayTab) state.details.id = "";
      state.details.showTab = displayTab;
    },
    closeTab(state, { payload }) {
      state.details.showTab = payload;
    },
  },
});

export const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
    paintingDetails: paintingDetailsSlice.reducer,
  },
});

export const searchActions = searchSlice.actions;
export const paintingDetailsActions = paintingDetailsSlice.actions;
