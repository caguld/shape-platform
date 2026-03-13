import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  User,
  Building2,
  Clock,
  FileText,
  Sparkles,
} from "lucide-react";

export default async function PortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get the client's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get the client's record(s) — linked via email
  const { data: clientRecords } = await supabase
    .from("clients")
    .select("*, companies(name)")
    .eq("email", user.email);

  // Get upcoming sessions for this client
  const clientIds = clientRecords?.map((c) => c.id) || [];
  const { data: sessions } = clientIds.length > 0
    ? await supabase
        .from("sessions")
        .select("*")
        .in("client_id", clientIds)
        .order("date", { ascending: true })
    : { data: [] };

  const upcomingSessions =
    sessions?.filter((s) => new Date(s.date) >= new Date() && s.status === "scheduled") || [];
  const completedSessions =
    sessions?.filter((s) => s.status === "completed") || [];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, {profile?.full_name || user.email}
        </h1>
        <p className="text-muted-foreground mt-1">
          Your AI coaching portal — view your sessions and resources
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-adaptig-orange/10 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-adaptig-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingSessions.length}</p>
              <p className="text-xs text-muted-foreground">Upcoming Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-adaptig-green/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-adaptig-green" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedSessions.length}</p>
              <p className="text-xs text-muted-foreground">Completed Sessions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-adaptig-blue/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-adaptig-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold">{clientRecords?.length || 0}</p>
              <p className="text-xs text-muted-foreground">
                {clientRecords?.length === 1 ? "Program" : "Programs"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Your Programs */}
      {clientRecords && clientRecords.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            Your Programs
          </h2>
          <div className="grid gap-3">
            {clientRecords.map((client) => (
              <Card key={client.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{client.title || "Participant"}</p>
                      <p className="text-sm text-muted-foreground">
                        {(client.companies as { name: string } | null)?.name || "—"}
                      </p>
                    </div>
                    <Badge
                      variant={client.status === "active" ? "default" : "secondary"}
                      className={
                        client.status === "active"
                          ? "bg-adaptig-green/10 text-adaptig-green border-adaptig-green/20"
                          : ""
                      }
                    >
                      {client.status}
                    </Badge>
                  </div>
                  {client.notes && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {client.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Sessions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-muted-foreground" />
          Upcoming Sessions
        </h2>
        {upcomingSessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No upcoming sessions scheduled yet.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your trainer will schedule sessions for you.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {upcomingSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Session {session.session_number} · {session.duration_minutes} min
                      </p>
                    </div>
                    <Badge className="bg-adaptig-orange/10 text-adaptig-orange border-adaptig-orange/20">
                      {session.status}
                    </Badge>
                  </div>
                  {session.ai_prep && (
                    <div className="mt-3 rounded-lg bg-adaptig-beige/50 p-3">
                      <p className="text-xs font-medium flex items-center gap-1 mb-1">
                        <Sparkles className="h-3 w-3 text-adaptig-orange" />
                        Session Prep
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {session.ai_prep}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Completed Sessions
          </h2>
          <div className="grid gap-3">
            {completedSessions.map((session) => (
              <Card key={session.id} className="opacity-80">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge variant="secondary">completed</Badge>
                  </div>
                  {session.ai_followup && (
                    <div className="mt-3 rounded-lg bg-muted/50 p-3">
                      <p className="text-xs font-medium flex items-center gap-1 mb-1">
                        <Sparkles className="h-3 w-3 text-adaptig-green" />
                        Follow-up Summary
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {session.ai_followup}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
