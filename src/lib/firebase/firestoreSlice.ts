import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CollectionOptions } from "../types";

type FirestoreState = {
  collection: Record<string, unknown[]>;
  documents: Record<string, Record<string, unknown>>;
  loading: boolean;
  error: string | null;
  options: Record<string, CollectionOptions>;
};

const initialState: FirestoreState = {
  collection: {},
  documents: {},
  loading: false,
  error: null,
  options: {},
};

export const firestoreSlice = createSlice({
  name: "firestore",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCollections: (
      state,
      action: PayloadAction<{ path: string; data: unknown[] }>
    ) => {
      state.collection[action.payload.path] = action.payload.data;
    },
    setDocuments: (
      state,
      action: PayloadAction<{ path: string; id: string; data: unknown }>
    ) => {
      if (!state.documents[action.payload.path]) {
        state.documents[action.payload.path] = {};
      }
      state.documents[action.payload.path][action.payload.id] =
        action.payload.data;
    },
    setCollectionOptions: (
      state,
      action: PayloadAction<{ path: string; options: CollectionOptions }>
    ) => {
      const { path, options } = action.payload;
      state.options[path] = { ...state.options[path], ...options };
    },
  },
});

export const {
  setLoading,
  setError,
  setCollections,
  setDocuments,
  setCollectionOptions,
} = firestoreSlice.actions;
