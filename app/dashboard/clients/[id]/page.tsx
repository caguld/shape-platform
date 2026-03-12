import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (!client) notFound();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("client_id", id)
    .order("date", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/clients"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Clients
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-2">
          {client.name}
        </h1>
        <div className="flex gap-2 mt-2">
          {client.title && (
            <span className="text-muted-foreground">{client.title}</span>
          )}
          {client.company && <Badge variant="secondary">{client.company}</Badge>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {client.email && (
              <div>
                <span className="text-muted-foreground">Email:</span>{" "}
                {client.email}
              </div>
            )}
            {client.company && (
              <div>
                <span className="text-muted-foreground">Company:</span>{" "}
                {client.company}
              </div>
            )}
            {client.title && (
              <div>
                <span className="text-muted-foreground">Title:</span>{" "}
                {client.title}
              </div>
            )}
            {client.notes && (
              <div>
                <span className="text-muted-foreground">Notes:</span>
                <p className="mt-1 whitespace-pre-wrap">{client.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions ({sessions?.length ?? 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions && sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/dashboard/sessions/${session.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{session.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
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
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No sessions yet for this client.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
