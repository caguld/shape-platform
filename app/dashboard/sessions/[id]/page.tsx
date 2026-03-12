import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("sessions")
    .select("*, clients(name, company, title, email)")
    .eq("id", id)
    .single();

  if (!session) notFound();

  const client = session.clients as {
    name: string;
    company: string;
    title: string;
    email: string;
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/sessions"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Sessions
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {session.title}
          </h1>
          <Badge
            variant={
              session.status === "completed"
                ? "default"
                : session.status === "cancelled"
                ? "destructive"
                : "secondary"
            }
          >
            {session.status}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">
          {client?.name} &mdash; {client?.title} at {client?.company}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Session Details */}
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Date:</span>{" "}
              {new Date(session.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>{" "}
              {session.duration_minutes} minutes
            </div>
            {session.notes && (
              <div>
                <span className="text-muted-foreground">Notes:</span>
                <p className="mt-1 whitespace-pre-wrap">{session.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Session Prep</CardTitle>
            </CardHeader>
            <CardContent>
              {session.ai_prep ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {session.ai_prep}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No AI prep generated yet. Use the{" "}
                  <Link
                    href="/dashboard/ai-tools"
                    className="text-primary underline"
                  >
                    AI Tools
                  </Link>{" "}
                  to generate session prep.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Follow-up</CardTitle>
            </CardHeader>
            <CardContent>
              {session.ai_followup ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {session.ai_followup}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No follow-up generated yet. Use the{" "}
                  <Link
                    href="/dashboard/ai-tools"
                    className="text-primary underline"
                  >
                    AI Tools
                  </Link>{" "}
                  to generate a follow-up.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
