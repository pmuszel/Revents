import {
  FirestoreError,
  getDocs,
  onSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
  type DocumentData,
} from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../stores/store";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import {
  setCollections,
  setError,
  setLoading,
} from "../firebase/firestoreSlice";
import { toast } from "react-toastify";
import { convertTimestamps } from "../util/util";
import { getQuery } from "../firebase/getQuery";
import type { CollectionOptions } from "../types";

type Options = {
  path: string;
  listen?: boolean;
  collectionOptions?: CollectionOptions;
  paginate?: boolean;
};

export const useCollection = <T extends DocumentData>({
  path,
  listen = true,
  collectionOptions,
  paginate,
}: Options) => {
  const dispatch = useAppDispatch();
  const collectionData = useAppSelector(
    (state) => state.firestore.collection[path]
  ) as T[];
  const loading = useAppSelector((state) => state.firestore.loading);
  const options = useAppSelector((state) => state.firestore.options[path]);
  // const hasSetLoading = useRef(false);
  const loadedInitial = useRef(false);
  const lastDocRef = useRef<QueryDocumentSnapshot | null>(null);
  const hasMore = useRef(false);

  const setUpQuery = useCallback(() => {
    dispatch(setLoading(true));

    const optionsToUse = options || collectionOptions;

    if (optionsToUse.pageNumber === 1) {
      lastDocRef.current = null; // Reset last document reference for new queries
      hasMore.current = false; // Reset hasMore for new queries
    }

    return getQuery(path, optionsToUse, lastDocRef.current, paginate);
  }, [collectionOptions, dispatch, options, path, paginate]);

  const processSnapshot = useCallback(
    (snapshot: QuerySnapshot) => {
      const data: T[] = [];
      snapshot.forEach((doc) => {
        const converted = convertTimestamps(doc.data());
        data.push({ ...(converted as T), id: doc.id });
      });

      const optionsToUse = options || collectionOptions;

      if (paginate && optionsToUse?.limit) {
        lastDocRef.current = snapshot.docs[snapshot.docs.length - 1];
        hasMore.current = !(snapshot.docs.length < optionsToUse.limit);
      }

      dispatch(setCollections({ path, data, paginate }));
      dispatch(setLoading(false));
      loadedInitial.current = true;
    },
    [dispatch, path, collectionOptions, options, paginate]
  );
  const handleSnapshotError = useCallback(
    (error: FirestoreError) => {
      console.error("Error fetching collection:", error);
      dispatch(setLoading(false));
      dispatch(setError(error.message));
      toast.error(error.message);
      loadedInitial.current = true;
    },
    [dispatch]
  );

  const subscribeToCollection = useCallback(() => {
    if (!listen || paginate) return () => {}; //no-op

    const query = setUpQuery();

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        processSnapshot(snapshot);
      },
      (error) => {
        handleSnapshotError(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [listen, handleSnapshotError, processSnapshot, setUpQuery, paginate]);

  const fetchCollection = useCallback(() => {
    if (listen) return; //no-op if listening
    const query = setUpQuery();
    getDocs(query)
      .then((snapshot) => {
        processSnapshot(snapshot);
      })
      .catch((error) => {
        handleSnapshotError(error);
      });
  }, [listen, processSnapshot, setUpQuery, handleSnapshotError]);

  useSyncExternalStore(subscribeToCollection, () => collectionData);

  useEffect(() => {
    if (listen || (paginate && !options)) return;

    fetchCollection();
  }, [listen, fetchCollection, options, paginate]);

  return {
    data: collectionData,
    loading,
    loadedInitial: loadedInitial.current,
    hasMore: hasMore.current,
  };
};
