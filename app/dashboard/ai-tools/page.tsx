"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, FileText, Mail } from "lucide-react";

interface Session {
  id: string;
  title: string;
  clients: { name: string; title: string; company: string };
}

export default function AIToolsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    async function loadSessions() {
      const supabase = createClient();
      const { data } = await supabase
        .from("sessions")
        .select("id, title, clients(name, title, company)")
        .order("date", { ascending: false });
      if (data) setSessions(data as unknown as Session[]);
    }
    loadSessions();
  }, []);

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>, type: string) {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        sessionId: formData.get("sessionId") || undefined,
        clientName: formData.get("clientName"),
        clientTitle: formData.get("clientTitle"),
        clientCompany: formData.get("clientCompany"),
        topic: formData.get("topic"),
        notes: formData.get("notes"),
      }),
    });

    const data = await res.json();
    setResult(data.result || data.error || "Something went wrong");
    setLoading(false);
  }

  function SessionSelector() {
    return (
      <div className="space-y-2">
        <Label htmlFor="sessionId">Link to Session (optional)</Label>
        <select
          id="sessionId"
          name="sessionId"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          onChange={(e) => {
            const session = sessions.find((s) => s.id === e.target.value);
            if (session) {
              const form = e.target.closest("form");
              if (form) {
                const nameInput = form.querySelector<HTMLInputElement>('[name="clientName"]');
                const titleInput = form.querySelector<HTMLInputElement>('[name="clientTitle"]');
                const companyInput = form.querySelector<HTMLInputElement>('[name="clientCompany"]');
                if (nameInput) nameInput.value = session.clients?.name || "";
                if (titleInput) titleInput.value = session.clients?.title || "";
                if (companyInput) companyInput.value = session.clients?.company || "";
              }
            }
          }}
        >
          <option value="">None — enter details manually</option>
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} — {s.clients?.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Brain className="h-8 w-8" /> AI Tools
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate session prep materials and follow-up emails powered by Claude AI.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <Tabs defaultValue="prep">
          <TabsList className="w-full">
            <TabsTrigger value="prep" className="flex-1 gap-2">
              <FileText className="h-4 w-4" /> Session Prep
            </TabsTrigger>
            <TabsTrigger value="followup" className="flex-1 gap-2">
              <Mail className="h-4 w-4" /> Follow-up Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prep">
            <Card>
              <CardHeader>
                <CardTitle>Generate Session Prep</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => handleGenerate(e, "prep")}
                  className="space-y-4"
                >
                  <SessionSelector />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input id="clientName" name="clientName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientTitle">Title</Label>
                      <Input id="clientTitle" name="clientTitle" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCompany">Company</Label>
                    <Input id="clientCompany" name="clientCompany" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic">Session Topic *</Label>
                    <Input
                      id="topic"
                      name="topic"
                      placeholder="AI Strategy for Digital Transformation"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any specific areas to focus on..."
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Generating..." : "Generate Session Prep"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followup">
            <Card>
              <CardHeader>
                <CardTitle>Generate Follow-up Email</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => handleGenerate(e, "followup")}
                  className="space-y-4"
                >
                  <SessionSelector />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName2">Client Name *</Label>
                      <Input id="clientName2" name="clientName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientTitle2">Title</Label>
                      <Input id="clientTitle2" name="clientTitle" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCompany2">Company</Label>
                    <Input id="clientCompany2" name="clientCompany" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic2">Session Title *</Label>
                    <Input
                      id="topic2"
                      name="topic"
                      placeholder="AI Strategy Workshop"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes2">Session Notes *</Label>
                    <Textarea
                      id="notes2"
                      name="notes"
                      placeholder="Key discussion points, decisions made, action items..."
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Generating..." : "Generate Follow-up"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {result}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Generated content will appear here.</p>
                <p className="text-xs mt-1">
                  Fill in the form and click generate to get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
