"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/admin/AuthContext";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { token, ready } = useAuth();

  useEffect(() => {
    if (ready && !token) {
      router.push("/admin/login");
    }
  }, [ready, token, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <p className="text-sm text-ink-muted">Loading…</p>
      </div>
    );
  }

  if (!token) {
    // Redirect is in flight — render nothing to avoid a flash of the dashboard.
    return null;
  }

  return <AdminShell />;
}
