"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AddClientDialog } from "@/components/forms/add-client-dialog";
import {
  Users,
  FolderOpen,
  BookOpen,
  Target,
  ArrowRightLeft,
  Lightbulb,
  BarChart3,
  Building2,
  Mail,
  User,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string | null;
  title: string | null;
  level: string | null;
  status: string;
  notes: string | null;
}

interface CompanyDetailTabsProps {
  companyId: string;
  trainerId: string;
  clients: Client[];
}

function ComingSoonPlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-card rounded-xl p-8 ring-1 ring-foreground/10 text-center">
      <p className="text-muted-foreground text-sm">
        {title} &mdash; Coming soon
      </p>
    </div>
  );
}

export function CompanyDetailTabs({
  companyId,
  trainerId,
  clients,
}: CompanyDetailTabsProps) {
  return (
    <Tabs defaultValue="clients">
      <TabsList variant="line" className="w-full overflow-x-auto flex-nowrap">
        <TabsTrigger value="clients" className="gap-1.5">
          <Users className="h-3.5 w-3.5" />
          Clients
        </TabsTrigger>
        <TabsTrigger value="ai-processes" className="gap-1.5">
          <FolderOpen className="h-3.5 w-3.5" />
          AI Processes
        </TabsTrigger>
        <TabsTrigger value="prompts" className="gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          Prompts
        </TabsTrigger>
        <TabsTrigger value="goals" className="gap-1.5">
          <Target className="h-3.5 w-3.5" />
          Goals & Strategy
        </TabsTrigger>
        <TabsTrigger value="shift" className="gap-1.5">
          <ArrowRightLeft className="h-3.5 w-3.5" />
          SHIFT
        </TabsTrigger>
        <TabsTrigger value="idea-hub" className="gap-1.5">
          <Lightbulb className="h-3.5 w-3.5" />
          AI Idea Hub
        </TabsTrigger>
        <TabsTrigger value="okrs" className="gap-1.5">
          <BarChart3 className="h-3.5 w-3.5" />
          OKRs/KPIs
        </TabsTrigger>
        <TabsTrigger value="strategy" className="gap-1.5">
          <Building2 className="h-3.5 w-3.5" />
          AI Strategy
        </TabsTrigger>
      </TabsList>

      {/* Clients Tab */}
      <TabsContent value="clients" className="mt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Team Members</h3>
            <AddClientDialog
              trainerId={trainerId}
              companyId={companyId}
              variant="outline"
            />
          </div>

          {clients.length > 0 ? (
            <div className="grid gap-3">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="bg-card rounded-xl p-4 ring-1 ring-foreground/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-adaptig-green-light flex items-center justify-center">
                      <User className="h-4 w-4 text-adaptig-green-dark" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {client.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {client.title && (
                          <span className="text-xs text-muted-foreground">
                            {client.title}
                          </span>
                        )}
                        {client.level && (
                          <Badge variant="secondary" className="text-[10px] h-4">
                            {client.level}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {client.email && (
                      <a
                        href={`mailto:${client.email}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    <Badge
                      variant={
                        client.status === "active" ? "default" : "secondary"
                      }
                      className={
                        client.status === "active"
                          ? "bg-adaptig-green-light text-adaptig-green-dark"
                          : ""
                      }
                    >
                      {client.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-8 ring-1 ring-foreground/10 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                No team members yet. Add clients to start coaching.
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Placeholder tabs */}
      <TabsContent value="ai-processes" className="mt-6">
        <ComingSoonPlaceholder title="AI Processes" />
      </TabsContent>
      <TabsContent value="prompts" className="mt-6">
        <ComingSoonPlaceholder title="Prompts Library" />
      </TabsContent>
      <TabsContent value="goals" className="mt-6">
        <ComingSoonPlaceholder title="Goals & Strategy (SHAPE)" />
      </TabsContent>
      <TabsContent value="shift" className="mt-6">
        <ComingSoonPlaceholder title="SHIFT Organisational Plan" />
      </TabsContent>
      <TabsContent value="idea-hub" className="mt-6">
        <ComingSoonPlaceholder title="AI Idea Hub" />
      </TabsContent>
      <TabsContent value="okrs" className="mt-6">
        <ComingSoonPlaceholder title="OKRs / KPIs" />
      </TabsContent>
      <TabsContent value="strategy" className="mt-6">
        <ComingSoonPlaceholder title="AI Strategy / Plan" />
      </TabsContent>
    </Tabs>
  );
}
