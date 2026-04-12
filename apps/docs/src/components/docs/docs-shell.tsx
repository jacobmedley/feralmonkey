import type { ReactNode } from "react";
import { DocsSidebar } from "./docs-sidebar";

type DocsShellProps = {
  children: ReactNode;
};

export function DocsShell({ children }: DocsShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid w-full max-w-6xl lg:grid-cols-[220px_1fr]">
        <DocsSidebar />
        <main className="min-w-0 px-6 py-10 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
