import { useEffect } from "react";
import { Link } from "react-router";
import { useCollection } from "../../lib/hooks/useCollection";
import type { AppEvent, CollectionOptions, Profile } from "../../lib/types";
import { useAppDispatch } from "../../lib/stores/store";
import { setCollectionOptions } from "../../lib/firebase/firestoreSlice";
import { formatDateTime } from "../../lib/util/util";

export default function ProfileEvents({
  profile,
  selectedTab,
}: {
  profile: Profile;
  selectedTab: string;
}) {
  const { data: appEvents, loading } = useCollection<AppEvent>({
    path: "events",
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    const optionsMap: Record<string, CollectionOptions> = {
      past: {
        queries: [
          {
            attribute: "attendeeIds",
            operator: "array-contains",
            value: profile.id,
          },
          {
            attribute: "date",
            operator: "<=",
            value: new Date().toISOString(),
            isDate: true,
          },
        ],
        sort: { attribute: "date", direction: "desc" },
      },
      hosting: {
        queries: [
          {
            attribute: "hostUid",
            operator: "==",
            value: profile.id,
          },
        ],
        sort: { attribute: "date", direction: "asc" },
      },
      future: {
        queries: [
          {
            attribute: "attendeeIds",
            operator: "array-contains",
            value: profile.id,
          },
          {
            attribute: "date",
            operator: ">=",
            value: new Date().toISOString(),
            isDate: true,
          },
        ],
        sort: { attribute: "date", direction: "desc" },
      },
    };

    dispatch(
      setCollectionOptions({ path: "events", options: optionsMap[selectedTab] })
    );
  }, [dispatch, profile.id, selectedTab]);

  // useEffect(() => {
  //   if (!currentUser) return;

  //   const q: QueryOptions[] = [];

  //   if (selectedTab === "future") {
  //     q.push({
  //       attribute: "date",
  //       operator: ">=",
  //       value: new Date(),
  //       isDate: true,
  //     });
  //   } else if (selectedTab === "past") {
  //     q.push({
  //       attribute: "date",
  //       operator: "<",
  //       value: new Date(),
  //       isDate: true,
  //     });
  //   } else {
  //     q.push({ attribute: "hostUid", operator: "==", value: currentUser.uid });
  //   }

  //   dispatch(
  //     setCollectionOptions({
  //       options: {
  //         queries: q,
  //         sort: { attribute: "date", direction: "asc" },
  //       },
  //       path: "events",
  //     })
  //   );
  // }, [dispatch, selectedTab, currentUser]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex w-full flex-col h-[50vh]">
      <div className="grid grid-cols-3 gap-3 mt-3 overflow-y-auto">
        {!loading && appEvents?.length === 0 && <div>No events found.</div>}
        {!loading &&
          appEvents?.map((event) => (
            <Link
              to={`/events/${event.id}`}
              key={event.id}
              className="card bg-base-100 shadow-sm text-white"
            >
              <figure className="relative">
                <img
                  className="h-45 w-full object-cover brightness-50 rounded-xl"
                  src={`/categoryImages/${event.category}.jpg`}
                  alt="category image"
                />
                <div className="card-title text-2xl absolute top-1 left-3">
                  {event.title}
                </div>
                <div className="absolute bottom-1 left-3">
                  <p className="text-lg font-semibold">
                    {event.venue.split(",")[0]}
                  </p>
                  <p className="text-sm font-semibold">
                    {formatDateTime(event.date)}
                  </p>
                </div>
              </figure>
            </Link>
          ))}
      </div>
    </div>
  );
}
