export type AppUser = {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
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
  attendees: Attendee[];
  attendeeIds: string[];
};

export type Attendee = {
  id: string;
  displayName: string;
  photoURL?: string;
  isHost: boolean;
};
