import { MapPinIcon } from "@heroicons/react/24/outline";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../../../lib/stores/store";
import { useState } from "react";
import MapComponent from "../../../app/shared/components/MapComponent";

export default function EventDetailedInfo() {
  const [mapOpen, setMapOpen] = useState(false);
  const event = useAppSelector((state) => state.event.selectedEvent);

  if (!event) return <div>Event not fount</div>;

  return (
    <div className="card bg-base-100">
      <div className="flex flex-col align-middle">
        <div className="flex items-center gap-x-3 border-b border-neutral-300 py-3 pl-3">
          <InformationCircleIcon className="size-8" />
          <span>{event.description}</span>
        </div>
        <div className="flex items-center gap-x-3 border-b border-neutral-300 py-3 pl-3">
          <CalendarIcon className="size-8" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3 py-3 pl-3">
            <MapPinIcon className="size-8" />
            <span>{event.venue}</span>
          </div>
          <button
            onClick={() => setMapOpen(!mapOpen)}
            className="btn btn-info btn-outline mr-2"
          >
            {mapOpen ? "Close Map" : "Show Map"}
          </button>
        </div>
      </div>
      {mapOpen && event && (
        <div className="h-64">
          <MapComponent
            position={[event.latitude, event.longitude]}
            venue={event.venue}
          />
        </div>
      )}
    </div>
  );
}
