import { onAuthStateChanged } from "firebase/auth";
import { useAppDispatch } from "../../lib/stores/store";
import { auth } from "../../lib/firebase/firebase";
import { signIn, signOut } from "../../features/account/accountSlice";
import { handleError } from "../../lib/util/util";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, {
      next: (user) => {
        if (user) {
          dispatch(signIn(user));
        } else {
          dispatch(signOut());
        }
      },
      error: (error) => {
        handleError(error);
      },
      complete: () => {},
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}
