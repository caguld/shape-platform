"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface Client {
  id: string;
  name: string;
  company: string;
}

export function AddSessionDialog({
  trainerId,
  clients,
}: {
  trainerId: string;
  clients: Client[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    await supabase.from("sessions").insert({
      trainer_id: trainerId,
      client_id: formData.get("client_id") as string,
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      duration_minutes: parseInt(formData.get("duration") as string) || 60,
      notes: formData.get("notes") as string,
    });

    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="h-4 w-4" /> Schedule Session
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule New Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client_id">Client *</Label>
            <select
              id="client_id"
              name="client_id"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} — {client.company}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Session Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="AI Strategy Workshop"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time *</Label>
            <Input id="date" name="date" type="datetime-local" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              defaultValue={60}
              min={15}
              max={480}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Session objectives, topics to cover..." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Scheduling..." : "Schedule Session"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
