import { MapPinIcon } from "@heroicons/react/24/outline";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../../../lib/stores/store";

export default function EventDetailedInfo() {
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
        <div className="flex items-center gap-x-3 py-3 pl-3">
          <MapPinIcon className="size-8" />
          <span>{event.venue}</span>
        </div>
      </div>
    </div>
  );
}
