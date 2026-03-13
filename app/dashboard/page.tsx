import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  Monitor,
  Video,
  BookOpen,
  FolderOpen,
  Zap,
  Lightbulb,
  BarChart3,
  Building2,
  ArrowRight,
} from "lucide-react";
import { SectionLabel } from "@/components/dashboard/section-label";
import { IconCircle } from "@/components/dashboard/icon-circle";
import { ExpandableCard } from "@/components/dashboard/expandable-card";
import { CoachingSessionsContent } from "@/components/dashboard/coaching-sessions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { count: companyCount } = await supabase
    .from("companies")
    .select("*", { count: "exact", head: true });

  const { count: activeClientCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: completedClientCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  return (
    <div className="space-y-8 pb-12">
      {/* CORE SERVICES */}
      <section>
        <SectionLabel>Core Services</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* SHAPE Card */}
          <div className="md:col-span-3 bg-adaptig-green-light rounded-xl p-6 ring-1 ring-green-200">
            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-bold text-foreground">SHAPE</h3>
                <p className="text-sm font-medium text-muted-foreground">
                  Goals & Strategy
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Define and track strategic objectives for AI adoption across
                  your organisation
                </p>
              </div>
              <div className="border-t border-green-200 pt-3">
                <p className="text-sm font-semibold text-adaptig-green-dark">
                  100% AI Smart Leaders
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Our proven framework ensures every executive in your
                  organisation becomes AI-fluent through structured coaching and
                  hands-on experience.
                </p>
              </div>
            </div>
          </div>

          {/* SHIFT Card */}
          <div className="md:col-span-2 bg-card rounded-xl p-6 ring-1 ring-foreground/10 border-l-4 border-l-adaptig-blue">
            <h3 className="text-2xl font-bold text-foreground">SHIFT</h3>
            <p className="text-sm font-medium text-muted-foreground">
              Organisational Plan
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Your enterprise AI adoption roadmap — from pilots to
              organisation-wide transformation
            </p>
          </div>
        </div>
      </section>

      {/* FORMATS */}
      <section>
        <SectionLabel>Formats</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExpandableCard
            icon={
              <IconCircle color="green">
                <Users className="h-5 w-5" />
              </IconCircle>
            }
            title="One-to-one AI Coaching"
            subtitle="Personalised executive coaching"
            defaultExpanded={false}
          >
            <CoachingSessionsContent />
          </ExpandableCard>

          <ExpandableCard
            icon={
              <IconCircle color="green">
                <Monitor className="h-5 w-5" />
              </IconCircle>
            }
            title="Workshops"
            subtitle="Group learning sessions"
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Interactive group workshops designed for teams of 8-20
                participants. Hands-on AI exercises with real business use
                cases.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Half-day or full-day formats</li>
                <li>Customised to your industry and workflows</li>
                <li>Includes follow-up materials and resources</li>
              </ul>
            </div>
          </ExpandableCard>

          <ExpandableCard
            icon={
              <IconCircle color="red">
                <Video className="h-5 w-5" />
              </IconCircle>
            }
            title="Videos"
            subtitle="On-demand learning"
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Curated video library covering AI fundamentals, advanced
                techniques, and industry-specific use cases. Self-paced
                learning for busy executives.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                <li>Short-form micro-lessons (5-15 minutes)</li>
                <li>In-depth tutorials and walkthroughs</li>
                <li>Updated regularly with new AI developments</li>
              </ul>
            </div>
          </ExpandableCard>
        </div>
      </section>

      {/* TOOLS & RESOURCES */}
      <section>
        <SectionLabel>Tools & Resources</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExpandableCard
            icon={
              <IconCircle color="red">
                <BookOpen className="h-5 w-5" />
              </IconCircle>
            }
            title="Prompt Library"
            subtitle="Curated prompt templates"
          >
            <p className="text-sm text-muted-foreground">
              A comprehensive collection of tested prompts for common
              executive workflows — from strategic analysis to communication,
              decision-making, and data analysis. Each prompt includes
              instructions and examples.
            </p>
          </ExpandableCard>

          <ExpandableCard
            icon={
              <IconCircle color="green">
                <FolderOpen className="h-5 w-5" />
              </IconCircle>
            }
            title="AI Processes"
            subtitle="Workflow templates"
          >
            <p className="text-sm text-muted-foreground">
              Step-by-step AI-enhanced process templates for common business
              workflows. Each process includes the AI tools needed, prompts to
              use, and expected outcomes.
            </p>
          </ExpandableCard>

          <ExpandableCard
            icon={
              <IconCircle color="blue">
                <Zap className="h-5 w-5" />
              </IconCircle>
            }
            title="Automations"
            subtitle="AI-powered workflows"
          >
            <p className="text-sm text-muted-foreground">
              Pre-built automation templates that connect AI models to business
              tools. From email triage to report generation — ready to deploy
              in minutes.
            </p>
          </ExpandableCard>
        </div>
      </section>

      {/* STRATEGY & PLANNING */}
      <section>
        <SectionLabel>Strategy & Planning</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExpandableCard
            icon={
              <IconCircle color="green">
                <Lightbulb className="h-5 w-5" />
              </IconCircle>
            }
            title="AI Idea Hub"
            subtitle="Capture & prioritise ideas"
          >
            <p className="text-sm text-muted-foreground">
              A centralised place to collect, evaluate, and prioritise AI use
              case ideas from across the organisation. Score ideas by impact,
              feasibility, and strategic alignment.
            </p>
          </ExpandableCard>

          <ExpandableCard
            icon={
              <IconCircle color="green">
                <BarChart3 className="h-5 w-5" />
              </IconCircle>
            }
            title="OKRs / KPIs"
            subtitle="Measure AI adoption"
          >
            <p className="text-sm text-muted-foreground">
              Track objectives and key results for AI adoption initiatives.
              Set measurable goals and monitor progress across teams and
              departments.
            </p>
          </ExpandableCard>

          <ExpandableCard
            icon={
              <IconCircle color="green">
                <Building2 className="h-5 w-5" />
              </IconCircle>
            }
            title="AI Strategy / Plan"
            subtitle="Enterprise AI roadmap"
          >
            <p className="text-sm text-muted-foreground">
              Create and manage a comprehensive AI strategy document including
              vision, goals, timeline, resource allocation, risk management,
              and success metrics.
            </p>
          </ExpandableCard>
        </div>
      </section>

      {/* ACTIVE COMPANIES BANNER */}
      <section>
        <Link href="/dashboard/companies" className="block group">
          <div className="bg-adaptig-dark rounded-xl p-6 flex items-center justify-between text-white hover:bg-adaptig-dark/90 transition-colors">
            <div>
              <h3 className="text-lg font-bold">Active Companies</h3>
              <p className="text-sm text-white/70 mt-1">
                {companyCount ?? 0} companies &middot;{" "}
                {activeClientCount ?? 0} active clients &middot;{" "}
                {completedClientCount ?? 0} completed
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </section>

      {/* COMMERCIAL MODEL */}
      <section>
        <SectionLabel>Commercial Model</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl p-6 ring-1 ring-foreground/10">
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  &euro;9,800
                  <span className="text-base font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-adaptig-green shrink-0" />
                  6 one-to-one coaching sessions included
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-adaptig-green shrink-0" />
                  Full access to prompt library & tools
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-adaptig-green shrink-0" />
                  AI strategy consultation
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 ring-1 ring-foreground/10 ring-2 ring-adaptig-orange/30">
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-foreground">
                  &euro;14,800
                  <span className="text-base font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-adaptig-green shrink-0" />
                  6 one-to-one coaching sessions included
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-adaptig-green shrink-0" />
                  1 leadership workshop per month
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-adaptig-green shrink-0" />
                  Full access to prompt library & tools
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-adaptig-green shrink-0" />
                  Priority AI strategy consultation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
