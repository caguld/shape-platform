import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CompanyDetailTabs } from "@/components/dashboard/company-detail-tabs";
import {
  EditCompanyDetailButton,
  DeleteCompanyDetailButton,
} from "@/components/dashboard/company-detail-actions";

export default async function CompanyDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!company) {
    notFound();
  }

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("company_id", params.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/companies"
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-adaptig-green-light flex items-center justify-center">
              <Building2 className="h-5 w-5 text-adaptig-green-dark" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {company.name}
              </h1>
              {company.industry && (
                <p className="text-sm text-muted-foreground">
                  {company.industry}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={company.status === "active" ? "default" : "secondary"}
            className={
              company.status === "active"
                ? "bg-adaptig-green-light text-adaptig-green-dark"
                : ""
            }
          >
            {company.status}
          </Badge>
          <EditCompanyDetailButton company={company} />
          <DeleteCompanyDetailButton companyId={company.id} />
        </div>
      </div>

      {/* Tabs */}
      <CompanyDetailTabs
        companyId={company.id}
        trainerId={user.id}
        companyName={company.name}
        clients={clients ?? []}
      />
    </div>
  );
}
