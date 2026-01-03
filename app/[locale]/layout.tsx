import Header from "@/app/components/Header";
import { ReactNode } from "react";

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
