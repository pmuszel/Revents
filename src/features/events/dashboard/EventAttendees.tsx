import { Link } from "react-router";
import type { Attendee } from "../../../lib/types";

type Props = {
  attendees: Attendee[];
};

export default function EventAttendees({ attendees }: Props) {
  return (
    <div className="avatar-group -space-x-5 hover:space-x-0">
      {attendees.map((attendee) => (
        <Link
          to={`/profiles/${attendee.id}`}
          className="avatar transition-all duration-300"
          key={attendee.id}
        >
          <div className="w-12">
            <img src={attendee.photoURL || "/user.png"} alt="attendee avatar" />
          </div>
        </Link>
      ))}
    </div>
  );
}
