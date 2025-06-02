import type {
  OrderByDirection,
  Timestamp,
  WhereFilterOp,
} from "firebase/firestore";

export type AppUser = {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  providerId: string;
};

export type Profile = {
  id: string;
  photoURL?: string;
  displayName: string;
  createdAt: string;
  description: string;
  followersCount: number;
  followingCount: number;
};

export type AppEvent = {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  city: string;
  venue: string;
  latitude: number;
  longitude: number;
  hostUid: string;
  isCancelled: boolean;
  attendees: Attendee[];
  attendeeIds: string[];
};

export type FirestoreAppEvent = Omit<AppEvent, "date"> & {
  date: Timestamp;
};

export type Attendee = {
  id: string;
  displayName: string;
  photoURL?: string;
  isHost: boolean;
};

export type Suggestion = {
  place_id: string;
  osm_id: string;
  osm_type: string;
  licence: string;
  lat: string;
  lon: string;
  boundingbox: string[];
  class: string;
  type: string;
  display_name: string;
  display_place: string;
  display_address: string;
  address: Address;
};

export type Address = {
  name: string;
  city: string;
  county: string;
  state: string;
  postcode: string;
  country: string;
  country_code: string;
  road: string;
  suburb: string;
  neighbourhood: string;
};

export type CollectionOptions = {
  queries?: QueryOptions[];
  sort: SortOptions;
};

export type QueryOptions = {
  attribute: string;
  operator: WhereFilterOp;
  value: string | number | boolean | Date | Timestamp;
  isDate?: boolean;
};

export type SortOptions = {
  attribute: string;
  direction: OrderByDirection;
};

export type Filter = {
  query: string;
  startDate: string;
};

export type ChatComment = {
  id: string;
  displayName: string;
  photoURL?: string;
  uid: string;
  text: string;
  date: string;
};
