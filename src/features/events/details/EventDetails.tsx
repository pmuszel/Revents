import { useParams } from "react-router";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedSidebar from "./EventDetailedSidebar";
import { useDocument } from "../../../lib/hooks/useDocument";
import type { AppEvent } from "../../../lib/types";
import { useState } from "react";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: selectedEvent, loading } = useDocument<AppEvent>({
    path: "events",
    id,
  });

  const [expandedChat, setExpandedChat] = useState(false);

  // useEffect(() => {
  //   if (id) {
  //     console.log(id);
  //     dispatch(selectEvent(id));
  //   }

  //   return () => {
  //     dispatch(selectEvent(null)); // Clear selected event on unmount
  //   };
  // }, [dispatch, id]);

  // const listenToEventDetails = useCallback(() => {
  //   if (!id) return () => {}; //no-op

  //   const unsubscribe = onSnapshot(doc(db, "events", id), (doc) => {
  //     if (doc.exists()) {
  //       dispatch(
  //         selectEvent({ ...doc.data(), id: doc.id } as FirestoreAppEvent)
  //       );
  //     }
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, [id, dispatch]);

  // useSyncExternalStore(listenToEventDetails, () => selectedEvent);

  if (loading) return <div>Loading...</div>;
  if (!selectedEvent) return <div>Event not found!</div>;

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col w-2/3 gap-3">
        <EventDetailedHeader event={selectedEvent} />
        {!expandedChat && <EventDetailedInfo event={selectedEvent} />}

        <EventDetailedChat
          expandedChat={expandedChat}
          setExpandedChat={setExpandedChat}
        />
      </div>
      <div className="w-1/3">
        <EventDetailedSidebar event={selectedEvent} />
      </div>
    </div>
  );
}
