import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type FirestoreState = {
  collection: Record<string, unknown[]>;
  documents: Record<string, Record<string, unknown>>;
  loading: boolean;
  error: string | null;
};

const initialState: FirestoreState = {
  collection: {},
  documents: {},
  loading: false,
  error: null,
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
  },
});

export const { setLoading, setError, setCollections, setDocuments } =
  firestoreSlice.actions;
