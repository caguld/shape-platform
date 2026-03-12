import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Brain, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">SHAPE</span>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          AI-Powered
          <br />
          <span className="text-primary/70">CxO Training Platform</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage your executive coaching clients, schedule sessions, and
          leverage AI to prepare talking points and follow-ups — all in one
          place.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Start Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Log in
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Client Management</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Keep track of your CxO clients, their companies, roles, and
              session history. Everything organized in one dashboard.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Session Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Schedule and manage training sessions with status tracking.
              Never miss a session or lose track of your coaching pipeline.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>AI Coaching Tools</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Generate session prep materials, talking points, and
              professional follow-up emails powered by Claude AI.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        SHAPE Platform &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
