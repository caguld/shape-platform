"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Send, Copy, Check } from "lucide-react";

interface InviteClientDialogProps {
  trainerId: string;
  companyId: string;
  companyName: string;
}

export function InviteClientDialog({
  trainerId,
  companyId,
  companyName,
}: InviteClientDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInviteLink("");

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { data, error: insertError } = await supabase
      .from("client_invitations")
      .insert({
        trainer_id: trainerId,
        company_id: companyId,
        email: formData.get("email") as string,
        name: formData.get("name") as string,
        title: formData.get("title") as string,
        level: (formData.get("level") as string) || "C-Suite",
      })
      .select("invite_token")
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Generate the invitation link
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/join?token=${data.invite_token}`;
    setInviteLink(link);
    setLoading(false);
    router.refresh();
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setInviteLink("");
      setError("");
      setCopied(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger
        render={
          <Button variant="outline" className="gap-2" />
        }
      >
        <Send className="h-4 w-4" /> Invite Client
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Client to Portal</DialogTitle>
          <DialogDescription>
            Send an invitation for {companyName}. The client will receive a link to
            create their own account and access the client portal.
          </DialogDescription>
        </DialogHeader>

        {inviteLink ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-adaptig-green/5 border border-adaptig-green/20 p-4">
              <p className="text-sm font-medium text-adaptig-green mb-2 flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Invitation created!
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Share this link with the client:
              </p>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="text-xs bg-background"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="shrink-0 gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Button
              onClick={() => {
                setInviteLink("");
                setError("");
              }}
              variant="outline"
              className="w-full"
            >
              Invite another client
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Client Email *</Label>
              <Input
                id="invite-email"
                name="email"
                type="email"
                placeholder="client@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-name">Client Name</Label>
              <Input
                id="invite-name"
                name="name"
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-title">Title</Label>
              <Input
                id="invite-title"
                name="title"
                placeholder="CEO, CTO, VP..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-level">Level</Label>
              <select
                id="invite-level"
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
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-adaptig-orange hover:bg-adaptig-orange-hover text-white"
              disabled={loading}
            >
              {loading ? "Creating invitation..." : "Create invitation link"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
