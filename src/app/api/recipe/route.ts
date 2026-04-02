import { NextResponse } from "next/server"
import { InferenceClient } from "@huggingface/inference"

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY)

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
    const { ingredients } = await req.json()

    if (!Array.isArray(ingredients) || ingredients.length < 5) {
      return NextResponse.json(
        { error: "At least 5 ingredients are required." },
        { status: 400 }
      )
    }

    const ingredientsString = ingredients.join(", ")

    const response = await client.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have the following ingredients: ${ingredientsString}. Please suggest a recipe.`,
        },
      ],
      max_tokens: 1024,
    })

    const recipe = response.choices[0].message.content
    console.log("API key:", process.env.HUGGINGFACE_API_KEY ? "Present" : "Missing")

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error("AI error:", error)
    return NextResponse.json(
      { error: "Failed to generate recipe." },
      { status: 500 }
    )
  }
}