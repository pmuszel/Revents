import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/counter/counterSlice";
import { useDispatch, useSelector } from "react-redux";
import { eventSlice } from "../../features/events/eventSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    event: eventSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
