import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateSessionPrep(
  clientName: string,
  clientTitle: string,
  clientCompany: string,
  sessionTopic: string,
  notes?: string
) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are an expert AI training coach preparing for a CxO coaching session.

Client: ${clientName}, ${clientTitle} at ${clientCompany}
Session Topic: ${sessionTopic}
${notes ? `Additional Notes: ${notes}` : ""}

Generate a structured session preparation document including:
1. Key talking points (5-7 points)
2. Suggested agenda with time allocations (for a 60-minute session)
3. Questions to ask the client
4. Potential challenges and how to address them
5. Follow-up action items to propose

Format the output in clear markdown.`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

export async function generateFollowUp(
  clientName: string,
  clientTitle: string,
  clientCompany: string,
  sessionTitle: string,
  sessionNotes: string
) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are an expert AI training coach writing a follow-up after a CxO coaching session.

Client: ${clientName}, ${clientTitle} at ${clientCompany}
Session: ${sessionTitle}
Session Notes: ${sessionNotes}

Generate a professional follow-up email that includes:
1. A brief thank you and session recap
2. Key takeaways from the session (3-5 points)
3. Action items with clear next steps
4. Resources or recommendations
5. Scheduling prompt for the next session

Write in a warm but professional tone. Format as an email with subject line.`,
      },
    ],
  });

  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}
