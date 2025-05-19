import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useState } from "react";

type Options = {
  path: string;
};

export const useFirestoreActions = <T extends DocumentData>({
  path,
}: Options) => {
  const [submitting, setSubmitting] = useState(false);

  const create = async (data: T) => {
    try {
      setSubmitting(true);
      const ref = doc(collection(db, path));
      await setDoc(ref, data);
      return ref;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const setDocument = async (id: string, data: T) => {
    try {
      setSubmitting(true);
      await setDoc(doc(db, path, id), data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const update = async (id: string, data: T) => {
    try {
      setSubmitting(true);
      const ref = doc(db, path, id);
      await updateDoc(ref, data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setSubmitting(true);
      const ref = doc(db, path, id);
      await deleteDoc(ref);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return { create, update, remove, setDocument, submitting };
};
