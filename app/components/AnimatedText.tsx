import clsx, { ClassValue } from "clsx";
import { PropsWithChildren } from "react";

export type AnimatexTextProps = PropsWithChildren<{
  className?: ClassValue;
}>;

export default function AnimatedText({ children, className }: AnimatexTextProps) {
  return (
    <div className="overflow-hidden">
      <div className={clsx("animate-rise", className)} style={{ animationFillMode: "backwards" }}>
        {children}
      </div>
    </div>
  );
}
