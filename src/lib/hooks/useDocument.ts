import { doc, onSnapshot, type DocumentData } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../stores/store";
import { useCallback, useRef, useSyncExternalStore } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase/firebase";
import { setLoading, setError, setDocuments } from "../firebase/firestoreSlice";
import { convertTimestamps } from "../util/util";

type Options = {
  path: string;
  id?: string;
  listen?: boolean;
};

export const useDocument = <T extends DocumentData>({
  path,
  id,
  listen = true,
}: Options) => {
  const dispatch = useAppDispatch();
  const documentData = useAppSelector((state) =>
    id ? (state.firestore.documents[path]?.[id] as T) : undefined
  );
  const loading = useAppSelector((state) => state.firestore.loading);
  const hasSetLoading = useRef(false);
  const loadedInitial = useRef(false);

  const subscribeToDocument = useCallback(() => {
    if (!listen || !id) return () => {}; //no-op

    if (!hasSetLoading.current) {
      dispatch(setLoading(true));
      hasSetLoading.current = true;
    }

    const docRef = doc(db, path, id);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists) {
          dispatch(setLoading(false));
          dispatch(setError("Document does not exist"));
          toast.error("Document does not exist");
          return;
        }

        const converted = convertTimestamps(snapshot.data() as T);

        dispatch(
          setDocuments({
            path,
            id,
            data: { id: snapshot.id, ...(converted as T) },
          })
        );

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
  }, [dispatch, listen, path, id]);

  useSyncExternalStore(subscribeToDocument, () => documentData);

  return { data: documentData, loading, loadedInitial: loadedInitial.current };
};
