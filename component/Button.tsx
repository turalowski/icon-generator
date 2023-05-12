import clsx from "clsx";

export function Button(props: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button className={clsx("bg-blue-400", "px-4 py-2", "rounded")} {...props}>
      {props.children}
    </button>
  );
}
