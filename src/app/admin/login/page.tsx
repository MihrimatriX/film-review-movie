import { Suspense } from "react";
import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--cv-deep)] text-[var(--cv-muted)]">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
