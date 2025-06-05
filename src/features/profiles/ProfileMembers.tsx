import { useNavigate } from "react-router";
import { useCollection } from "../../lib/hooks/useCollection";
import type { CollectionOptions, Profile } from "../../lib/types";
import { formatDateTime } from "../../lib/util/util";
import { useFollowing } from "../../lib/hooks/useFollowing";
import { useMemo, useState } from "react";
import { useAppSelector } from "../../lib/stores/store";
import clsx from "clsx";

type Props = {
  profile: Profile;
  followFilter: string;
};

export default function ProfileMembers({ profile, followFilter }: Props) {
  const currentUser = useAppSelector((state) => state.account.user);
  const options = useMemo(() => {
    return {
      sort: { attribute: "displayName", direction: "asc" },
    } as CollectionOptions;
  }, []);

  const { data: members, loadedInitial } = useCollection<Profile>({
    path:
      followFilter === "followers"
        ? `profiles/${profile.id}/followers`
        : followFilter === "following"
        ? `profiles/${profile.id}/following`
        : "profiles",
    collectionOptions: options,
  });

  const navigate = useNavigate();
  const { followingIds, followUser, unfollowUser, loading } = useFollowing();
  const [target, setTarget] = useState("");

  const followToggle = (
    event: React.MouseEvent<HTMLButtonElement>,
    member: Profile
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setTarget(member.id);
    if (followingIds.includes(member.id)) {
      unfollowUser(member);
    } else {
      followUser(member);
    }
  };

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
          {members?.map((m) => (
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
                    {followingIds.includes(m.id) && (
                      <div className="badge badge-soft badge-info badge-sm px-1 rounded-none">
                        Following
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td>{formatDateTime(m.createdAt)}</td>
              <td>
                <button
                  onClick={(event) => followToggle(event, m)}
                  disabled={
                    (loading && target === m.id) || m.id === currentUser?.uid
                  }
                  className={clsx("btn btn-sm btn-outline w-24", {
                    "btn-error": followingIds.includes(m.id),
                    "btn-primary": !followingIds.includes(m.id),
                  })}
                >
                  {loading && target === m.id && (
                    <span className="loading loading-spinner"></span>
                  )}
                  {followingIds.includes(m.id) ? "Unfollow" : "Follow"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
