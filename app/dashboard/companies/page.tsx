import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Building2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddCompanyDialog } from "@/components/forms/add-company-dialog";
import { AddClientDialog } from "@/components/forms/add-client-dialog";
import {
  EditCompanyButton,
  DeleteCompanyButton,
} from "@/components/dashboard/company-card-actions";
import { CompaniesSearch } from "@/components/dashboard/companies-search";
import { Suspense } from "react";

interface SearchParams {
  q?: string;
  status?: string;
}

export default async function CompaniesPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Build query
  let query = supabase
    .from("companies")
    .select("*, clients(id, status)")
    .order("created_at", { ascending: false });

  if (searchParams.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status);
  }

  if (searchParams.q) {
    query = query.ilike("name", `%${searchParams.q}%`);
  }

  const { data: companies } = await query;

  // Stats
  const { count: totalCompanies } = await supabase
    .from("companies")
    .select("*", { count: "exact", head: true });

  const { count: activeClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: completedClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Active Companies
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <AddCompanyDialog trainerId={user.id} />
          <AddClientDialog trainerId={user.id} variant="outline" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold">{totalCompanies ?? 0}</p>
          <p className="text-xs text-muted-foreground">Companies</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{activeClients ?? 0}</p>
          <p className="text-xs text-muted-foreground">Active Clients</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{completedClients ?? 0}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
      </div>

      {/* Search & Filter */}
      <Suspense fallback={null}>
        <CompaniesSearch />
      </Suspense>

      {/* Companies Grid */}
      {companies && companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companies.map((company) => {
            const activeCount = (
              company.clients as Array<{ id: string; status: string }>
            )?.filter((c) => c.status === "active").length ?? 0;

            return (
              <Link
                key={company.id}
                href={`/dashboard/companies/${company.id}`}
                className="block"
              >
                <div className="bg-card rounded-xl p-4 ring-1 ring-foreground/10 hover:ring-primary/30 transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-adaptig-green-light flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-adaptig-green-dark" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {company.name}
                        </h3>
                        {company.industry && (
                          <p className="text-xs text-muted-foreground">
                            {company.industry}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <EditCompanyButton company={company} />
                      <DeleteCompanyButton companyId={company.id} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{activeCount} active</span>
                    </div>
                    <Badge
                      variant={
                        company.status === "active" ? "default" : "secondary"
                      }
                      className={
                        company.status === "active"
                          ? "bg-adaptig-green-light text-adaptig-green-dark"
                          : ""
                      }
                    >
                      {company.status}
                    </Badge>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-card rounded-xl p-8 ring-1 ring-foreground/10 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            No companies yet. Add your first company to get started.
          </p>
        </div>
      )}
    </div>
  );
}
