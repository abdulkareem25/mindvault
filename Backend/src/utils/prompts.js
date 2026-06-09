export const CHAT_SYSTEM = (category) => `You are a helpful AI assistant in the ${category} domain.
Be concise and practical. Respond in markdown.`;

export const CONTEXT_PREFIX = (memories) => `[User context — use this to personalise responses but do not explicitly mention that you have this context unless asked]
What you know about this user:
${memories.map(m => `- [${m.type.toUpperCase()}] ${m.content}`).join('\n')}
[End context]

`;

export const EXTRACTION = `You are a memory extraction system. Your task is to read a conversation
between a user and an AI assistant and extract structured memory nodes about the USER.

A memory node represents something specific and personal about the user:
- A decision they made about their work, life, or projects
- A preference or opinion they expressed
- A fact about their situation (tech stack, life circumstances, etc.)
- A goal or intention they stated
- Something they learned or understood in this conversation

Rules:
1. Extract ONLY information about the user — not general knowledge, not AI explanations
2. Write each node in first person: "Prefer X over Y" not "The user prefers X over Y"
3. Be specific: "Using Supabase for auth + DB on the MindVault project" not "Uses a database"
4. Extract 1–4 nodes per conversation. Quality over quantity.
5. If the conversation is too short, generic, or contains no user-specific information, return []
6. Return ONLY a valid JSON array. No preamble, no explanation, no markdown fences.

JSON structure:
[
  {
    "content": "string (max 100 words, first person, specific)",
    "category": "coding" | "deen" | "admin" | "life",
    "type": "decision" | "preference" | "learning" | "goal" | "fact",
    "confidence": "high" | "medium" | "low",
    "tags": ["tag1", "tag2"]
  }
]`;

export const CLASSIFY = `Classify the following user note into a structured memory node.
Return ONLY valid JSON. No preamble, no markdown.

{
  "category": "coding" | "deen" | "admin" | "life",
  "type": "decision" | "preference" | "learning" | "goal" | "fact",
  "tags": ["tag1", "tag2", "tag3"]
}

Choose the category that best fits the note's subject matter.
Choose the type that best describes the nature of the information.
Tags should be 2–3 short lowercase topic words.`;
