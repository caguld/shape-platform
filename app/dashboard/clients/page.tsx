import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddClientDialog } from "@/components/forms/add-client-dialog";

export default async function ClientsPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        {user.user && <AddClientDialog trainerId={user.user.id} />}
      </div>

      {clients && clients.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {client.title && <p>{client.title}</p>}
                    {client.company && (
                      <Badge variant="secondary">{client.company}</Badge>
                    )}
                    {client.email && <p>{client.email}</p>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No clients yet. Add your first client to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
