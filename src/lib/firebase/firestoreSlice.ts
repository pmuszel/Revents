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
      action: PayloadAction<{
        path: string;
        data: unknown[];
        paginate?: boolean;
      }>
    ) => {
      const { path, data, paginate } = action.payload;

      if (paginate && (state.options[path]?.pageNumber ?? 1) > 1) {
        const existing = state.collection[path] ?? [];
        const map = new Map<string, unknown>();

        for (const item of existing) {
          if (typeof item === "object" && item && "id" in item) {
            map.set((item as { id: string }).id, item);
          }
        }

        for (const item of data) {
          if (typeof item === "object" && item && "id" in item) {
            map.set((item as { id: string }).id, item);
          }
        }

        state.collection[path] = Array.from(map.values());
      } else {
        state.collection[path] = action.payload.data;
      }
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
    setNextPage: (state, action: PayloadAction<{ path: string }>) => {
      const { path } = action.payload;
      if (state.options[path]) {
        state.options[path].pageNumber =
          (state.options[path].pageNumber || 1) + 1;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setCollections,
  setDocuments,
  setCollectionOptions,
  setNextPage,
} = firestoreSlice.actions;
