import { useEffect, useState } from "react";
import { events } from "../../../lib/data/sampleData";
import EventForm from "../form/EventForm";
import EventCard from "./EventCard";
import type { AppEvent } from "../../../lib/types";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  formOpen: boolean;
  setFormOpen: (isOpen: boolean) => void;
  selectedEvent: AppEvent | null;
  selectEvent: (event: AppEvent) => void;
};

export default function EventDashboard({
  formOpen,
  selectedEvent,
  setFormOpen,
  selectEvent,
}: Props) {
  const [appEvents, setAppEvents] = useState<AppEvent[]>([]);

  const handleCreateEvent = (event: AppEvent) => {
    setAppEvents((prevEvents) => [...prevEvents, event]);
  };

  const handleEditEvent = (updatedEvent: AppEvent) => {
    console.log("Updated event", updatedEvent);
    setAppEvents((prevEvents) => {
      return prevEvents.map((prevEvent) =>
        prevEvent.id === updatedEvent.id ? updatedEvent : prevEvent
      );
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setAppEvents((prevEvents) => {
      return prevEvents.filter((event) => event.id !== eventId);
    });
  };

  useEffect(() => {
    setAppEvents(events);
  }, []);

  return (
    <div className="flex flex-row w-full gap-6">
      <div className="w-3/5">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.3, type: "easeInOut" }}
          >
            <div className="flex flex-col gap-4">
              {appEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  selectEvent={selectEvent}
                  deleteEvent={handleDeleteEvent}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-2/5 overflow-hidden">
        {/* {formOpen ? <EventForm setFormOpen={setFormOpen} /> : null} */}
        <AnimatePresence>
          {formOpen && (
            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 200 }}
              transition={{ duration: 0.3, type: "easeInOut" }}
            >
              <EventForm
                key={selectedEvent?.id || "new-event"}
                setFormOpen={setFormOpen}
                createEvent={handleCreateEvent}
                updateEvent={handleEditEvent}
                selectedEvent={selectedEvent}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
