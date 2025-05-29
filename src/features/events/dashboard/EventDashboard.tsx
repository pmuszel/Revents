import EventCard from "./EventCard";
import { useCollection } from "../../../lib/hooks/useCollection";
import type { AppEvent } from "../../../lib/types";
import EventFilters from "./EventFilters";
import EmptyState from "../../../app/shared/components/EmptyState";
import { useEventFilters } from "../../../lib/hooks/useEventFilters";

export default function EventDashboard() {
  const { data: appEvents, loading } = useCollection<AppEvent>({
    path: "events",
  });

  const { filter, setFilter, resetFilters } = useEventFilters();

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-row w-full gap-6">
      <div className="w-2/3">
        <div className="flex flex-col gap-4">
          {!loading && appEvents?.length === 0 ? (
            <EmptyState
              message="No events for this filter"
              onReset={resetFilters}
            />
          ) : (
            appEvents?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
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
