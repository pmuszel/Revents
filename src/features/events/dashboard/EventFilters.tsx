import {
  AcademicCapIcon,
  CalendarDaysIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAppDispatch, useAppSelector } from "../../../lib/stores/store";
import type { Filter, QueryOptions } from "../../../lib/types";
import { setCollectionOptions } from "../../../lib/firebase/firestoreSlice";

type Props = {
  filter: Filter;
  setFilter: (f: Filter) => void;
};

export default function EventFilters({ filter, setFilter }: Props) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.account.user);

  const [calendarViewDate, setCalendarViewDate] = useState(new Date());

  useEffect(() => {
    setCalendarViewDate(new Date(filter.startDate));
  }, [filter.startDate]);

  const items = [
    { key: "all", label: "All Events", icon: CalendarDaysIcon },
    { key: "going", label: "I'm going", icon: RocketLaunchIcon },
    { key: "hosting", label: "I'm hosting", icon: AcademicCapIcon },
  ];

  const handleFilterChange = ({
    query,
    startDate,
  }: {
    query?: string;
    startDate?: string;
  }) => {
    if (!currentUser && query) return;
    const q: QueryOptions[] = [
      {
        attribute: "date",
        operator: ">=",
        value: startDate || filter.startDate,
        isDate: true,
      },
    ];

    if (query === "going" && currentUser) {
      q.push({
        attribute: "attendeeIds",
        operator: "array-contains",
        value: currentUser.uid,
      });
    } else if (query === "hosting" && currentUser) {
      q.push({ attribute: "hostUid", operator: "==", value: currentUser.uid });
    }

    dispatch(
      setCollectionOptions({
        options: {
          queries: q,
          sort: { attribute: "date", direction: "asc" },
          pageNumber: 1,
        },
        path: "events",
      })
    );
    setFilter({
      ...filter,
      query: query || filter.query,
      startDate: startDate || filter.startDate,
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {currentUser && (
        <div className="card bg-base-100 w-full">
          <div className="card-title font-semibold bg-grad-primary">
            Event filters
          </div>
          <ul className="list space-y-2 py-2">
            {items.map(({ key, label, icon: Icon }) => (
              <li
                onClick={() =>
                  handleFilterChange({
                    query: key,
                    startDate: filter.startDate,
                  })
                }
                key={key}
                className={clsx(
                  "list-row w-full items-center py-2 hover:bg-primary/20 cursor-pointer",
                  { "text-primary font-bold": filter.query === key }
                )}
              >
                <Icon className="w-10 h-10" />
                <span className="text-lg">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="card bg-base-100 w-full">
        <div className="card-title bg-grad-primary">Start date</div>
        <Calendar
          value={filter.startDate}
          activeStartDate={calendarViewDate}
          onActiveStartDateChange={({ activeStartDate }) =>
            setCalendarViewDate(activeStartDate as Date)
          }
          onChange={(value) => {
            handleFilterChange({
              query: filter.query,
              startDate: (value as Date).toISOString(),
            });
          }}
        />
      </div>
    </div>
  );
}
