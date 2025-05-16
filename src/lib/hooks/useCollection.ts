import { collection, onSnapshot, type DocumentData } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../stores/store";
import { useCallback, useSyncExternalStore } from "react";
import {
  setCollections,
  setError,
  setLoading,
} from "../firebase/firestoreSlice";
import { db } from "../firebase/firebase";
import { toast } from "react-toastify";
import { convertTimestamps } from "../util/util";

type Options = {
  path: string;
  listen?: boolean;
};

export const useCollection = <T extends DocumentData>({
  path,
  listen = true,
}: Options) => {
  const dispatch = useAppDispatch();
  const collectionData = useAppSelector(
    (state) => state.firestore.collection[path]
  ) as T[];
  const loading = useAppSelector((state) => state.firestore.loading);

  const subscribeToCollection = useCallback(() => {
    if (!listen) return () => {}; //no-op

    dispatch(setLoading(true));

    const colRef = collection(db, path);

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const data: T[] = [];
        snapshot.forEach((doc) => {
          const converted = convertTimestamps(doc.data());
          data.push({ ...(converted as T), id: doc.id });
        });
        dispatch(setCollections({ path, data }));
        dispatch(setLoading(false));
      },
      (error) => {
        console.error("Error fetching collection:", error);
        dispatch(setLoading(false));
        dispatch(setError(error.message));
        toast.error(error.message);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, listen, path]);

  useSyncExternalStore(subscribeToCollection, () => collectionData);
  return { data: collectionData, loading };
};
