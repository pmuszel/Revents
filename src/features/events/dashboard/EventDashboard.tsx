import EventCard from "./EventCard";
import { useCollection } from "../../../lib/hooks/useCollection";
import type { AppEvent } from "../../../lib/types";
import EventFilters from "./EventFilters";
import EmptyState from "../../../app/shared/components/EmptyState";
import { useEventFilters } from "../../../lib/hooks/useEventFilters";
import { useAppDispatch } from "../../../lib/stores/store";
import {
  setCollectionOptions,
  setNextPage,
} from "../../../lib/firebase/firestoreSlice";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export default function EventDashboard() {
  const dispatch = useAppDispatch();
  const { filter, setFilter, resetFilters, collectionOptions } =
    useEventFilters();

  const {
    data: appEvents,
    loadedInitial,
    hasMore,
    loading,
  } = useCollection<AppEvent>({
    path: "events",
    listen: false,
    paginate: true,
  });

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  const hasSetOptions = useRef(false);

  useEffect(() => {
    if (hasSetOptions.current) return;

    dispatch(
      setCollectionOptions({ path: "events", options: collectionOptions })
    );

    hasSetOptions.current = true;
  }, [collectionOptions, dispatch]);

  useEffect(() => {
    if (!appEvents || loading) return;

    if (inView && hasMore) {
      dispatch(setNextPage({ path: "events" }));
    }
  }, [inView, hasMore, dispatch, appEvents, loading]);

  // const dispatch = useAppDispatch();
  // const { events: appEvents } = useAppSelector((state) => state.event);

  // const listenToEvents = useCallback(() => {
  //   const q = query(collection(db, "events"));
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const events: FirestoreAppEvent[] = [];
  //     snapshot.forEach((doc) => {
  //       events.push({ ...doc.data(), id: doc.id } as FirestoreAppEvent);
  //     });
  //     dispatch(setEvents(events));
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [dispatch]);

  // useSyncExternalStore(listenToEvents, () => appEvents);

  if (!loadedInitial) return <div>Loading...</div>;

  return (
    <div className="flex flex-row w-full gap-6">
      <div className="w-2/3">
        <div className="flex flex-col gap-4">
          {loadedInitial && appEvents?.length === 0 ? (
            <EmptyState
              message="No events for this filter"
              onReset={resetFilters}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {appEvents?.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
              {hasMore && <div ref={ref} className="h-10" />}
              {/* <button
                disabled={!hasMore}
                onClick={() => {
                  dispatch(setNextPage({ path: "events" }));
                }}
                className="btn btn-primary self-end"
              >
                Load more
              </button> */}
            </div>
          )}
        </div>
      </div>
      <div className="w-1/3 overflow-hidden sticky top-[96px] self-start">
        {/* <Counter /> */}
        <EventFilters filter={filter} setFilter={setFilter} />
      </div>
    </div>
  );
}
