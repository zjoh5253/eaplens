"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BarChart3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setError("Enter your email address above first.");
      return;
    }
    setError(null);
    setLoading(true);
    await signIn("email", { email, redirect: false, callbackUrl });
    setLoading(false);
    setMagicSent(true);
  }

  if (magicSent) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h2>
        <p className="text-sm text-gray-500">
          We sent a magic link to <strong>{email}</strong>. Click it to sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleCredentials} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Sign in
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs text-gray-400 uppercase">
          <span className="bg-white px-2">or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleMagicLink}
        disabled={loading}
      >
        Send magic link
      </Button>

      <p className="text-xs text-center text-gray-500">
        No account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline font-medium">
          Create one free
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <BarChart3 className="h-7 w-7 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">EAPLens</span>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your HR dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-sm text-gray-400">Loading...</div>}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
