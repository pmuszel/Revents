import { onSnapshot, type DocumentData } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../stores/store";
import { useCallback, useRef, useSyncExternalStore } from "react";
import {
  setCollections,
  setError,
  setLoading,
} from "../firebase/firestoreSlice";
import { toast } from "react-toastify";
import { convertTimestamps } from "../util/util";
import { getQuery } from "../firebase/getQuery";

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
  const options = useAppSelector((state) => state.firestore.options[path]);
  const hasSetLoading = useRef(false);
  const loadedInitial = useRef(false);

  const subscribeToCollection = useCallback(() => {
    if (!listen) return () => {}; //no-op

    if (!hasSetLoading.current) {
      dispatch(setLoading(true));
      hasSetLoading.current = true;
    }

    const query = getQuery(path, options);

    // const colRef = collection(db, path);

    // const q = query(
    //   colRef,
    //   where("date", ">=", new Date()),
    //   orderBy("date", "asc")
    // );

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const data: T[] = [];
        snapshot.forEach((doc) => {
          const converted = convertTimestamps(doc.data());
          data.push({ ...(converted as T), id: doc.id });
        });
        dispatch(setCollections({ path, data }));
        dispatch(setLoading(false));
        loadedInitial.current = true;
      },
      (error) => {
        console.error("Error fetching collection:", error);
        dispatch(setLoading(false));
        dispatch(setError(error.message));
        toast.error(error.message);
        loadedInitial.current = true;
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, listen, path, options]);

  useSyncExternalStore(subscribeToCollection, () => collectionData);
  return {
    data: collectionData,
    loading,
    loadedInitial: loadedInitial.current,
  };
};
