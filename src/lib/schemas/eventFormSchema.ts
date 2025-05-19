import { z } from "zod";

const requiredString = (fieldName: string) =>
  z
    .string({ required_error: `${fieldName} is required :((` })
    .min(1, `${fieldName} is required :((`);

const venueSchema = z.object({
  venue: requiredString("Venue"),
  latitude: z.number({ required_error: "Latitude is required" }),
  longitude: z.number({ required_error: "Longitude is required" }),
});

export const eventFormSchema = z.object({
  title: requiredString("Title"),
  category: requiredString("Category"),
  description: requiredString("Description").min(5, "Description is too short"),
  date: requiredString("Date"),

  // refine(
  //   (value) => {
  //     const selectedDate = new Date(value);
  //     return selectedDate > new Date();
  //   },
  //   { message: "Date must be in the future" }
  // ),
  city: z.string().optional(),
  venue: venueSchema,
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
