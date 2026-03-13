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

interface AddClientDialogProps {
  trainerId: string;
  companyId?: string;
  variant?: "default" | "outline";
}

export function AddClientDialog({
  trainerId,
  companyId,
  variant = "default",
}: AddClientDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    await supabase.from("clients").insert({
      trainer_id: trainerId,
      company_id: companyId || null,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      title: formData.get("title") as string,
      level: formData.get("level") as string || "C-Suite",
      notes: formData.get("notes") as string,
    });

    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  const buttonClasses =
    variant === "outline"
      ? "gap-2"
      : "gap-2 bg-adaptig-orange hover:bg-adaptig-orange-hover text-white";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant={variant === "outline" ? "outline" : "default"}
            className={buttonClasses}
          />
        }
      >
        <Plus className="h-4 w-4" /> Add Client
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" placeholder="John Smith" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="CEO, CTO, VP..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <select
              id="level"
              name="level"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm"
              defaultValue="C-Suite"
            >
              <option value="C-Suite">C-Suite</option>
              <option value="VP">VP</option>
              <option value="Director">Director</option>
              <option value="Manager">Manager</option>
              <option value="Individual">Individual</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Background, goals, etc."
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-adaptig-orange hover:bg-adaptig-orange-hover text-white"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Client"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
