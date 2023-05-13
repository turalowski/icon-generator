import clsx from "clsx";
import { Spinner } from "./Spinner";

const colors = {
  primary: "bg-blue-400 hover:bg-blue-500",
  secondary: "bg-gray-400 hover:bg-gray-500",
};
export function Button(
  props: React.ComponentPropsWithoutRef<"button"> & {
    variant?: "primary" | "secondary";
    isLoading?: boolean;
  }
) {
  const { variant = "primary" } = props;

  const color = colors[variant];

  return (
    <button
      className={clsx(
        color,
        "flex items-center justify-center gap-2",
        "px-4 py-2",
        "disabled:bg-gray-600",
        "rounded"
      )}
      {...props}
    >
      {props.isLoading && <Spinner />}
      {props.children}
    </button>
  );
}
