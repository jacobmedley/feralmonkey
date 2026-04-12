import type { ReactNode } from "react";
import { DocsShell } from "@/components/docs/docs-shell";

type ComponentsLayoutProps = {
  children: ReactNode;
};

export default function ComponentsLayout({ children }: ComponentsLayoutProps) {
  return <DocsShell>{children}</DocsShell>;
}
