import { useNavigate, useParams } from "react-router";
import { users } from "../../../lib/data/sampleData";
import { useAppDispatch, useAppSelector } from "../../../lib/stores/store";
import type { AppEvent } from "../../../lib/types";
import { createEvent, selectEvent, updateEvent } from "../eventSlice";
import { useEffect } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import TextInput from "../../../app/shared/components/TextInput";
import {
  eventFormSchema,
  type EventFormSchema,
} from "../../../lib/schemas/eventFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextArea from "../../../app/shared/components/TextArea";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import PlaceInput from "../../../app/shared/components/PlaceInput";

export default function EventForm() {
  const dispatch = useAppDispatch();
  const selectedEvent = useAppSelector((state) => state.event.selectedEvent);
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<EventFormSchema>({
    mode: "onTouched",
    resolver: zodResolver(eventFormSchema),
  });

  useEffect(() => {
    if (id) {
      dispatch(selectEvent(id));
      if (selectedEvent) {
        reset({
          ...selectedEvent,
          date: new Date(selectedEvent.date).toISOString().slice(0, 16),
          venue: {
            venue: selectedEvent.venue,
            latitude: selectedEvent.latitude,
            longitude: selectedEvent.longitude,
          },
        });
      }
    } else {
      dispatch(selectEvent(null));
    }
  }, [id, dispatch, reset, selectedEvent]);

  const onSubmit = (data: FieldValues) => {
    console.log("Form data", data);

    if (selectedEvent) {
      dispatch(
        updateEvent({
          ...selectedEvent,
          ...data,
          venue: data.venue.venue,
          latitude: data.venue.latitude,
          longitude: data.venue.longitude,
        })
      );

      navigate(`/events/${selectedEvent.id}`);
    } else {
      const eventId = crypto.randomUUID();
      const newEvent = {
        ...data,
        id: eventId,
        venue: data.venue.venue,
        latitude: data.venue.latitude,
        longitude: data.venue.longitude,
        hostUid: users[0].uid,
        attendees: [
          {
            id: users[0].uid,
            displayName: users[0].displayName,
            photoURL: users[0].photoURL,
            isHost: true,
          },
        ],
      };
      dispatch(createEvent(newEvent as AppEvent));
      navigate(`/events/${eventId}`);
    }
  };

  return (
    <div className="card bg-base-100 p-4 flex flex-col gap-3 w-full">
      <h3 className="text-2xl font-semibild text-center text-primary">
        {selectedEvent ? "Edit" : "Create"} event
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        <TextInput control={control} name="title" label="Title" />
        {/* <UncontrolledInput
          register={register}
          name="title"
          errors={errors}
          optons={{ required: "Title is required :(" }}
          label="Title"
        /> */}
        {/* <input
          {...register("title", { required: "Title is required" })}
          type="text"
          className={`input input-lg w-full ${
            errors.title ? "input-error" : ""
          }`}
          placeholder="Event title"
        />
        {errors.title && (
          <div className="text-error">{errors.title.message}</div>
        )} */}

        <TextArea
          control={control}
          name="description"
          label="Description"
          rows={4}
        />
        <div className="flex gap-3 items-center w-full">
          <SelectInput
            control={control}
            name="category"
            label="Category"
            options={categoryOptions}
          />
          <TextInput
            control={control}
            name="date"
            type="datetime-local"
            min={new Date()}
            label="Date"
          />
        </div>
        {/* <TextInput control={control} name="city" label="City" /> */}
        <PlaceInput control={control} name="venue" label="Venue" />

        <div className="flex justify-end w-full gap-3">
          <button
            type="button"
            className="btn btn-neutral"
            onClick={() => navigate(-1)}
            // onClick={() => dispatch(closeForm())}
          >
            Cancel
          </button>
          <button disabled={!isValid} type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
