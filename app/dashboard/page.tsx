import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Brain } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { count: clientCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  const { count: sessionCount } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true });

  const { data: upcomingSessions } = await supabase
    .from("sessions")
    .select("*, clients(name, company)")
    .eq("status", "scheduled")
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true })
    .limit(5);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientCount ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionCount ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Tools
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link
              href="/dashboard/ai-tools"
              className="text-sm text-primary underline"
            >
              Generate session prep &rarr;
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/dashboard/sessions/${session.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {(session.clients as { name: string; company: string })?.name} &mdash;{" "}
                      {(session.clients as { name: string; company: string })?.company}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No upcoming sessions.{" "}
              <Link
                href="/dashboard/sessions"
                className="text-primary underline"
              >
                Schedule one
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
