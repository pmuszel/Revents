import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../stores/store";
import type { CollectionOptions } from "../types";
import { setCollectionOptions } from "../firebase/firestoreSlice";

export const useEventFilters = () => {
  const dispatch = useAppDispatch();
  const options = useAppSelector((state) => state.firestore.options["events"]);

  const startDateOpt = options?.queries?.find((q) => q.attribute === "date")
    ?.value as string;
  const queryOpt = options?.queries?.find((q) =>
    ["attendeeIds", "hostUid"].includes(q.attribute)
  );

  const filterFromOpt =
    queryOpt?.attribute === "attendeeIds"
      ? "going"
      : queryOpt?.attribute === "hostUid"
      ? "hosting"
      : "all";

  const initialState = {
    query: "all",
    startDate: new Date().toISOString(),
  };

  const [filter, setFilter] = useState({
    query: filterFromOpt || initialState.query,
    startDate: startDateOpt || initialState.startDate,
  });

  const resetFilters = () => {
    dispatch(
      setCollectionOptions({ path: "events", options: collectionOptions })
    );
    setFilter(initialState);
  };

  const collectionOptions: CollectionOptions = useMemo(() => {
    return {
      queries: [
        {
          attribute: "date",
          operator: ">=",
          value: new Date().toISOString(),
          isDate: true,
        },
      ],
      sort: { attribute: "date", direction: "asc" },
      limit: 2,
      pageNumber: 1,
    };
  }, []);

  return {
    filter,
    setFilter,
    resetFilters,
    collectionOptions,
  };
};
