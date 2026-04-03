import { NextResponse } from "next/server"
import { InferenceClient } from "@huggingface/inference"

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY!)

const SYSTEM_PROMPT = `
You are a professional culinary assistant.

You receive a list of ingredients provided by the user and must suggest a realistic recipe they could prepare using some or all of them.

Guidelines:
- You do NOT need to use every ingredient.
- You MAY include a few common additional ingredients if necessary.
- Keep the recipe practical and clear.
- Maintain a neutral, professional tone.
- Do not add emojis.

Format the response strictly in Markdown using this structure:

# Recipe Title

## Introduction
A short, concise introduction (1–2 sentences).

## Ingredients
A bullet list of ingredients.

## Steps
A numbered list of clear cooking steps.

## Optional Tip
One helpful optional tip or variation.
`

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json()

    if (
      typeof body !== "object" ||
      body === null ||
      !("ingredients" in body) ||
      !Array.isArray((body).ingredients)
    ) {
      return NextResponse.json(
        { error: "Invalid ingredients payload." },
        { status: 400 }
      )
    }

    const ingredients = (body as { ingredients: string[] }).ingredients

    if (ingredients.length < 5) {
      return NextResponse.json(
        { error: "At least 5 ingredients are required." },
        { status: 400 }
      )
    }

    const response = await client.chatCompletion({
      model: "Qwen/Qwen2.5-Coder-7B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have the following ingredients: ${ingredients.join(
            ", "
          )}. Please suggest a recipe.`,
        },
      ],
      max_tokens: 1024,
    })

    const recipe = response.choices[0]?.message?.content

    return NextResponse.json({ recipe })
  } catch (error: unknown) {
    console.error("AI route error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

