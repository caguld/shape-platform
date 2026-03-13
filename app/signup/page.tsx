"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdaptigEmail = email.toLowerCase().endsWith("@adaptig.com");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Only allow @adaptig.com emails to sign up as trainers
    if (!email.toLowerCase().endsWith("@adaptig.com")) {
      setError(
        "Only @adaptig.com email addresses can register as trainers. If you're a client, please use the invitation link provided by your trainer."
      );
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: "trainer" },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight mb-2 block"
          >
            Adaptig
          </Link>
          <CardTitle>Trainer Registration</CardTitle>
          <CardDescription>
            Create your Adaptig trainer account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-adaptig-beige/50 border border-adaptig-orange/20 p-3">
            <ShieldCheck className="h-5 w-5 text-adaptig-orange shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Trainer registration is restricted to <strong>@adaptig.com</strong> email addresses.
              Clients receive invitations from their assigned trainer.
            </p>
          </div>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@adaptig.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {email && !isAdaptigEmail && (
                <p className="text-xs text-destructive">
                  Only @adaptig.com emails can register as trainers
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-adaptig-orange hover:bg-adaptig-orange-hover text-white"
              disabled={loading || (email.length > 0 && !isAdaptigEmail)}
            >
              {loading ? "Creating account..." : "Create trainer account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
