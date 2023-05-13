import clsx from "clsx";

const colors = {
  primary: "bg-blue-400 hover:bg-blue-500",
  secondary: "bg-gray-400 hover:bg-gray-500",
};
export function Button(
  props: React.ComponentPropsWithoutRef<"button"> & {
    variant?: "primary" | "secondary";
  }
) {
  const { variant = "primary" } = props;

  const color = colors[variant];

  return (
    <button className={clsx(color, "px-4 py-2", "rounded")} {...props}>
      {props.children}
    </button>
  );
}
