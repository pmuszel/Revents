import { useNavigate } from "react-router";
import { useCollection } from "../../lib/hooks/useCollection";
import type { Profile } from "../../lib/types";
import { formatDateTime } from "../../lib/util/util";

export default function ProfileMembers() {
  const { data: members, loadedInitial } = useCollection<Profile>({
    path: "profiles",
  });

  const navigate = useNavigate();

  if (!loadedInitial) return <div>Loading...</div>;
  return (
    <div className="h-[50vh] overflow-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr
              key={m.id}
              onClick={() => navigate(`/profiles/${m.id}`)}
              className="hover:bg-base-300 cursor-pointer"
            >
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img src={m?.photoURL || "/user.png"} alt="user avatar" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <div>{m.displayName}</div>
                    <div className="badge badge-soft badge-info badge-sm px-1 rounded-none">
                      Following
                    </div>
                  </div>
                </div>
              </td>
              <td>{formatDateTime(m.createdAt)}</td>
              <td>
                <button className="btn btn-sm btn-outline">Follow</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
