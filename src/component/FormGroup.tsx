import clsx from "clsx";

export function FormGroup(props: React.ComponentPropsWithoutRef<"div">) {
  const { className, ...propsWithoutClassName } = props;
  return (
    <div
      className={clsx("flex flex-col gap-1", className)}
      {...propsWithoutClassName}
    >
      {props.children}
    </div>
  );
}
