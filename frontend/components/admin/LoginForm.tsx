"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";
import { AdminField, AdminInput } from "./ui/fields";
import { Button } from "../ui/Button";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-signal">
            Dev by Manan
          </p>
          <h1 className="mt-2 font-display text-2xl text-ink">Admin sign in</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-line bg-raised/50 p-8"
        >
          <AdminField label="Username">
            <AdminInput
              type="text"
              required
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </AdminField>

          <AdminField label="Password">
            <AdminInput
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </AdminField>

          {error && (
            <p className="flex items-center gap-2 text-sm text-red-400" role="alert">
              <AlertCircle size={15} /> {error}
            </p>
          )}

          <Button type="submit" variant="primary" disabled={submitting} className="mt-2">
            {submitting ? (
              "Signing in…"
            ) : (
              <>
                Sign in <LogIn size={15} />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
