import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const MODEL = "claude-3-haiku-20240307";

export async function runAgent(
  role: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    return textBlock?.text || "No response generated";
  } catch (error) {
    console.error(`[Agent ${role} Error]`, error);
    return `Agent ${role} encountered an error: ${(error as Error).message}`;
  }
}

export { anthropic, MODEL };
