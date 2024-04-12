import { createSlice, configureStore } from "@reduxjs/toolkit";

let search = { artists: [], paintings: [] };

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

export const store = configureStore({
  reducer: searchSlice.reducer,
});

export const searchActions = searchSlice.actions;
