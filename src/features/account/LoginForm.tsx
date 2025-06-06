import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import TextInput from "../../app/shared/components/TextInput";
import { handleError } from "../../lib/util/util";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase/firebase";
import CenteredCard from "../../app/shared/components/CenteredCard";
import SocialLogin from "./SocialLogin";

export default function LoginForm() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);

      // dispatch(signIn(result.user));
      navigate("/events");
    } catch (error) {
      handleError(error);
    }
    // const user = users.find((x) => x.email === data.email);
    // if (user) {
    //   dispatch(signIn(user));
    //   navigate("/events");
    // } else {
    //   toast.error("Invalid email or password");
    // }
  };

  return (
    <CenteredCard icon={LockClosedIcon} title="Sign in">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput label="Email address" control={control} name="email" />
        <TextInput
          label="Password"
          control={control}
          name="password"
          type="password"
        />
        <button
          className="btn btn-primary w-full"
          disabled={!isValid || isSubmitting}
          type="submit"
        >
          {isSubmitting && <span className="loading loading-spinner"></span>}
          Sign in
        </button>
        <div className="divider">OR</div>
        <SocialLogin />
      </form>
    </CenteredCard>
  );
}
