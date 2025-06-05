import { useFollowing } from "../../../lib/hooks/useFollowing";
import type { AppEvent } from "../../../lib/types";
import { Link } from "react-router";

export default function EventDetailedSidebar({ event }: { event: AppEvent }) {
  const { followingIds } = useFollowing();
  return (
    <div className="card bg-base-100">
      <div className="card-title justify-center bg-gradient-to-r from-primary to-black py-2 text-white rounded-t-lg">
        {event?.attendees.length} People going
      </div>
      <div className="card-body">
        <div className="flex flex-col gap-3">
          {event?.attendees.map((attendee, index) => (
            <Link to={`/profiles/${attendee.id}`} key={attendee.id}>
              <div className="flex gap-3 align-middle justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="avatar">
                    <div className="w-16 rounded">
                      <img
                        src={attendee.photoURL || "/user.png"}
                        alt="user avatar"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl">{attendee.displayName}</span>
                    {followingIds.includes(attendee.id) && (
                      <span className="badge badge-primary badge-soft">
                        Following
                      </span>
                    )}
                  </div>
                </div>
                {attendee.isHost && (
                  <div className="badge badge-info">Host</div>
                )}
              </div>
              {event.attendees.length - 1 > index && (
                <div className="divider my-0"></div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
