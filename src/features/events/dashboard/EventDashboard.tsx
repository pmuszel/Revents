import EventCard from "./EventCard";
import Counter from "../../counter/Counter";
import { useCollection } from "../../../lib/hooks/useCollection";
import type { AppEvent } from "../../../lib/types";

export default function EventDashboard() {
  const { data: appEvents, loading } = useCollection<AppEvent>({
    path: "events",
  });

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
      <div className="w-3/5">
        <div className="flex flex-col gap-4">
          {appEvents?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
      <div className="w-2/5 overflow-hidden">
        <Counter />
      </div>
    </div>
  );
}
