import { useState } from "react";
import { useAppSelector } from "../stores/store";

export const useEventFilters = () => {
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
    setFilter(initialState);
  };

  return {
    filter,
    setFilter,
    resetFilters,
  };
};
