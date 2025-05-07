import { useState } from "react";
import EventDashboard from "../../features/events/dashboard/EventDashboard";
import Navbar from "./nav/Navbar";
import type { AppEvent } from "../../lib/types";

function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);

  const handleSelectEvent = (event: AppEvent | null) => {
    if (formOpen) {
      setFormOpen(false);
      setTimeout(() => {
        setSelectedEvent(event);
        setFormOpen(true);
      }, 300);
    } else {
      setSelectedEvent(event);
      setFormOpen(true);
    }
  };

  return (
    <div>
      <Navbar selectEvent={handleSelectEvent} />
      <div className="container mx-auto px-10 mt-24">
        <EventDashboard
          formOpen={formOpen}
          setFormOpen={setFormOpen}
          selectedEvent={selectedEvent}
          selectEvent={handleSelectEvent}
        />
      </div>
    </div>
  );
}

export default App;
