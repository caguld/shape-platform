"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { UserCheck, AlertCircle, Loader2 } from "lucide-react";

interface InvitationData {
  id: string;
  email: string;
  name: string;
  title: string;
  level: string;
  status: string;
  trainer_name: string;
  company_name: string;
}

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(true);
  const [inviteError, setInviteError] = useState("");

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchInvitation() {
      if (!token) {
        setInviteError("No invitation token provided.");
        setLoadingInvite(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_invitation_by_token", {
        token,
      });

      if (error || !data || data.length === 0) {
        setInviteError(
          "This invitation is invalid or has already been used."
        );
        setLoadingInvite(false);
        return;
      }

      const inv = data[0] as InvitationData;
      setInvitation(inv);
      setFullName(inv.name || "");
      setLoadingInvite(false);
    }

    fetchInvitation();
  }, [token]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!invitation || !token) return;
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invitation.email,
      password,
      options: {
        data: { full_name: fullName, role: "client" },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { error: acceptError } = await supabase.rpc("accept_invitation", {
        token,
        user_id: authData.user.id,
      });

      if (acceptError) {
        console.error("Failed to accept invitation:", acceptError);
      }
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push("/portal");
      router.refresh();
    }, 2000);
  }

  if (loadingInvite) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-adaptig-orange mb-4" />
          <p className="text-sm text-muted-foreground">
            Verifying your invitation...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (inviteError) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight mb-2 block"
          >
            Adaptig
          </Link>
          <CardTitle>Invalid Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 mb-4">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{inviteError}</p>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Please contact your trainer for a new invitation link.
          </p>
          <div className="mt-4 text-center">
            <Link href="/login" className="text-sm text-primary underline">
              Already have an account? Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 rounded-full bg-adaptig-green/10 flex items-center justify-center mb-4">
            <UserCheck className="h-6 w-6 text-adaptig-green" />
          </div>
          <h3 className="text-lg font-medium mb-2">Welcome aboard!</h3>
          <p className="text-sm text-muted-foreground text-center">
            Your account has been created. Redirecting to your portal...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight mb-2 block"
        >
          Adaptig
        </Link>
        <CardTitle>Join as Client</CardTitle>
        <CardDescription>
          You&apos;ve been invited to Adaptig
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-adaptig-beige/50 border border-adaptig-green/20 p-3">
          <UserCheck className="h-5 w-5 text-adaptig-green shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p>
              <strong>{invitation?.trainer_name || "Your trainer"}</strong>{" "}
              has invited you
              {invitation?.company_name && (
                <> from <strong>{invitation.company_name}</strong></>
              )}
            </p>
          </div>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={invitation?.email || ""}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Create Password</Label>
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
            disabled={loading}
          >
            {loading ? "Creating your account..." : "Create account & join"}
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
  );
}

export default function JoinPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-adaptig-orange mb-4" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        }
      >
        <JoinContent />
      </Suspense>
    </div>
  );
}
