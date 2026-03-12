import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSessionPrep, generateFollowUp } from "@/lib/ai/claude";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, sessionId, clientName, clientTitle, clientCompany, topic, notes } = body;

  try {
    let result: string;

    if (type === "prep") {
      result = await generateSessionPrep(
        clientName,
        clientTitle,
        clientCompany,
        topic,
        notes
      );

      // Save to session if sessionId provided
      if (sessionId) {
        await supabase
          .from("sessions")
          .update({ ai_prep: result })
          .eq("id", sessionId)
          .eq("trainer_id", user.id);
      }
    } else if (type === "followup") {
      result = await generateFollowUp(
        clientName,
        clientTitle,
        clientCompany,
        topic,
        notes || ""
      );

      if (sessionId) {
        await supabase
          .from("sessions")
          .update({ ai_followup: result })
          .eq("id", sessionId)
          .eq("trainer_id", user.id);
      }
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
