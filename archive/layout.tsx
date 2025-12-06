import { Suspense } from "react";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-dvh" />}>
      {children}
    </Suspense>
  );
}
