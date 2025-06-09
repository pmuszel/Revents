import { Link } from "react-router";
import type { AppEvent } from "../../../lib/types";
import EventAttendees from "./EventAttendees";
import { useFirestoreActions } from "../../../lib/hooks/useFirestoreActions";
import { useEvent } from "../../../lib/hooks/useEvent";
import { formatDateTime } from "../../../lib/util/util";
import { useFollowing } from "../../../lib/hooks/useFollowing";

type Props = {
  event: AppEvent;
};

export default function EventCard({ event }: Props) {
  const { host, isGoing, isHost } = useEvent(event);
  const { remove, submitting } = useFirestoreActions({ path: "events" });

  const { followingIds } = useFollowing();
  const count = event.attendees.filter((a) =>
    followingIds.includes(a.id)
  ).length;

  return (
    <div className="card card-border bg-base-100 w-full">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <figure className="card-figure w-14 rounded-lg">
              <img src={host?.photoURL || "/user.png"} alt="User avatar" />
            </figure>
            <div className="">
              <h2 className="card-title">{event.title}</h2>
              <p className="text-sm">Hosted by {host?.displayName}</p>
            </div>
          </div>
          {event.isCancelled && (
            <div className="alert alert-error alert-soft">
              <span>This event has been cancelled</span>
            </div>
          )}
        </div>

        <div className="bg-base-200 -mx-6 my-3 px-4 py-2 border-y border-neutral/20">
          <EventAttendees attendees={event.attendees} />
        </div>

        <div className="card-actions flex items-center">
          <div className="flex flex-1">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-2 items-center">
                <span>{formatDateTime(event.date)}</span>
                {isHost && (
                  <span className="badge badge-info badge-soft">Hosting</span>
                )}
                {!isHost && isGoing && (
                  <span className="badge badge-success badge-soft">
                    Attending
                  </span>
                )}
                {count > 0 && (
                  <div className="badge badge-primary badge-soft">
                    {count + " "}
                    {count > 1 ? "people" : "person"} going that you follow
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            disabled={submitting}
            onClick={async () => await remove(event.id)}
            className="btn btn-error"
          >
            Delete
          </button>
          <Link to={`/events/${event.id}`} className="btn btn-primary">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
