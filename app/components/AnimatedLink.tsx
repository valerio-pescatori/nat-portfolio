"use client";

import Link, { type LinkProps } from "next/link";
import { ReactNode, type CSSProperties } from "react";

type AnimatedLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};
export default function AnimatedLink({ href, children, className = "", style, ...props }: AnimatedLinkProps) {
  return (
    <Link href={href} className={`group ${className} animated-link-item`} {...props} style={style}>
      <div className="inline-block">
        <span className="block underline md:no-underline">{children}</span>
        <span className="hidden md:block h-0.5 bg-foreground transition-transform duration-300 origin-left md:scale-x-0 md:group-hover:scale-x-100" />
      </div>
    </Link>
  );
}
