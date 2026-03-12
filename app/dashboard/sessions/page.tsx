import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddSessionDialog } from "@/components/forms/add-session-dialog";

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*, clients(name, company)")
    .order("date", { ascending: false });

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, company")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
        {user.user && clients && (
          <AddSessionDialog trainerId={user.user.id} clients={clients} />
        )}
      </div>

      {sessions && sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Link key={session.id} href={`/dashboard/sessions/${session.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {(session.clients as { name: string; company: string })?.name} &mdash;{" "}
                      {(session.clients as { name: string; company: string })?.company}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {new Date(session.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
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
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No sessions yet. Schedule your first session to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
