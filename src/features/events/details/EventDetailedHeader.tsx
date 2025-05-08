import { Link } from "react-router";
import { useAppSelector } from "../../../lib/stores/store";

export default function EventDetailedHeader() {
  const event = useAppSelector((state) => state.event.selectedEvent);

  if (!event) return <div>Event not fount</div>;

  const host = event.attendees.find((attendee) => attendee.isHost);

  return (
    <div className="card bg-base-100 r">
      <figure className="h-64 brightness-50 rounded-lg">
        <img
          className="w-full object-cover"
          src={`/categoryImages/${event.category}.jpg`}
          alt="event category image"
        />
      </figure>
      <div className="card-body text-white justify-end absolute bottom-0 w-full">
        <div className="flex justify-between">
          <div>
            <h2 className="card-title text-4xl">{event.title}</h2>
            <p>{event.date}</p>
            <p>Hosted by {host?.displayName}</p>
          </div>
          <div className="flex justify-denter gap-4">
            <div className="flex flex-col justify-end">
              <Link to={`/manage/${event.id}`} className="btn btn-secondary">
                Manage
              </Link>
            </div>
            <div className="flex flex-col justify-end">
              <button className="btn btn-primary">Join event</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
