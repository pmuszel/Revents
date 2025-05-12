import clsx from "clsx";
import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  errors: FieldErrors<T>;
  optons?: RegisterOptions<T>;
  type?: string;
  label: string;
};

export default function UncontrolledInput<T extends FieldValues>({
  register,
  name,
  errors,
  optons,
  type = "text",
  label,
}: Props<T>) {
  return (
    <label className="floating-label text-left">
      <span>{label}</span>
      <input
        {...register(name, optons)}
        type={type}
        className={clsx("input input-lg w-full", {
          "input-error": errors[name],
        })}
        placeholder={label}
      />
      {errors.title && (
        <div className="text-error">{errors[name]?.message as string}</div>
      )}
    </label>
  );
}
