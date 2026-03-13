"use client";

import { IconCircle } from "@/components/dashboard/icon-circle";
import {
  Search,
  Target,
  Zap,
  Sparkles,
  Workflow,
  Lightbulb,
  Code,
  Presentation,
  Rocket,
  Gift,
  Brain,
  Wrench,
} from "lucide-react";

interface ActivityCardProps {
  icon: React.ReactNode;
  title: string;
  color?: "green" | "blue" | "orange" | "purple" | "red";
}

function ActivityCard({ icon, title, color = "green" }: ActivityCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-background rounded-lg ring-1 ring-foreground/5">
      <IconCircle color={color} size="sm">
        {icon}
      </IconCircle>
      <span className="text-sm font-medium text-foreground">{title}</span>
    </div>
  );
}

interface SessionBlockProps {
  number: number;
  week: string;
  title: string;
  subtitle: string;
  activities: { icon: React.ReactNode; title: string; color?: "green" | "blue" | "orange" | "purple" | "red" }[];
}

function SessionBlock({
  number,
  week,
  title,
  subtitle,
  activities,
}: SessionBlockProps) {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold bg-adaptig-green-light text-adaptig-green-dark px-2 py-0.5 rounded-full">
            Session {number}
          </span>
          <span className="text-xs text-muted-foreground">{week}</span>
        </div>
        <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {activities.map((activity, i) => (
          <ActivityCard key={i} {...activity} />
        ))}
      </div>
    </div>
  );
}

export function CoachingSessionsContent() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Personalized one-to-one AI coaching sessions designed for senior
        leaders. Each session builds on the previous, creating a progressive
        learning journey from first AI impressions to building custom AI
        solutions.
      </p>

      <div>
        <h3 className="font-semibold text-sm mb-4 text-foreground">
          Suggested Session Schedule
        </h3>

        <div className="space-y-6">
          <SessionBlock
            number={1}
            week="Week 1"
            title='The WOW Session — First Impressions Matter'
            subtitle="Create immediate excitement and demonstrate AI's power with personalized demonstrations"
            activities={[
              {
                icon: <Search className="h-4 w-4" />,
                title: "Deep Research",
                color: "blue",
              },
              {
                icon: <Target className="h-4 w-4" />,
                title: "Ambitions & Level",
                color: "green",
              },
              {
                icon: <Zap className="h-4 w-4" />,
                title: "Quick Wins",
                color: "orange",
              },
              {
                icon: <Sparkles className="h-4 w-4" />,
                title: "+1 WOW Moment",
                color: "purple",
              },
            ]}
          />

          <SessionBlock
            number={2}
            week="Week 3"
            title='Their Favourite Process — AI-Powered Workflow'
            subtitle="Take a real daily workflow and transform it with AI assistance"
            activities={[
              {
                icon: <Workflow className="h-4 w-4" />,
                title: "Process Mapping",
                color: "blue",
              },
              {
                icon: <Lightbulb className="h-4 w-4" />,
                title: "AI Opportunities",
                color: "green",
              },
              {
                icon: <Wrench className="h-4 w-4" />,
                title: "Build Together",
                color: "orange",
              },
              {
                icon: <Rocket className="h-4 w-4" />,
                title: "Deploy & Test",
                color: "purple",
              },
            ]}
          />

          <SessionBlock
            number={3}
            week="Week 5"
            title='Building AI — From PowerPoints to Products'
            subtitle="Move beyond prompting to building real AI-powered tools and workflows"
            activities={[
              {
                icon: <Code className="h-4 w-4" />,
                title: "No-Code AI Tools",
                color: "blue",
              },
              {
                icon: <Presentation className="h-4 w-4" />,
                title: "Use Case Design",
                color: "green",
              },
              {
                icon: <Brain className="h-4 w-4" />,
                title: "Build a Prototype",
                color: "orange",
              },
              {
                icon: <Gift className="h-4 w-4" />,
                title: "Present & Iterate",
                color: "purple",
              },
            ]}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          Recommended cadence: bi-weekly sessions over 6 sessions
        </p>
      </div>
    </div>
  );
}
