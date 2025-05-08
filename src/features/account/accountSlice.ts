import { createSlice } from "@reduxjs/toolkit";
import { users } from "../../lib/data/sampleData";
import type { AppUser } from "../../lib/types";

type State = {
  user: AppUser | null;
};

const initialState: State = {
  user: null,
};

export const accountSlice = createSlice({
  name: "acount",
  initialState,
  reducers: {
    signIn: (state) => {
      state.user = users[0];
    },
    signOut: (state) => {
      state.user = null;
    },
  },
});

export const { signIn, signOut } = accountSlice.actions;
