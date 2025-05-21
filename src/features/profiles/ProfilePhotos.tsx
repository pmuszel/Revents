import type { Profile } from "../../lib/types";

type Props = {
  profile: Profile;
  editMode: boolean;
};

export default function ProfilePhotos({ profile, editMode }: Props) {
  return (
    <div>
      {editMode ? (
        <div>TODO: Photo upload goes here</div>
      ) : (
        <div className="grid grid-cols-5 gap-3 h-[50vh] overflow-auto">
          <img
            className="rounded-lg w-full"
            src={profile.photoURL}
            alt="user main photo"
          />
          {Array.from({ length: 20 }).map((_, index) => (
            <img
              className="rounded-lg w-full"
              key={index}
              src="/user.png"
              alt="photo"
            />
          ))}
        </div>
      )}
    </div>
  );
}
