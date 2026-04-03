"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import IngredientsInput from "@/components/IngredientsInput"
import { GiCookingPot } from "react-icons/gi";

export default function HomePage() {
  const [ingredients, setIngredients] = useState<string[] | null>(null)
  const [recipe, setRecipe] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleGenerate(items: string[]) {
    setIngredients(items)
    setIsLoading(true)

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: items }),
      })

      if (!res.ok) throw new Error("Failed to generate recipe")

      const data = await res.json()
      setRecipe(data.recipe)
    } catch (error) {
      console.error(error)
      alert("Something went wrong generating the recipe.")
      setIngredients(null)
    } finally {
      setIsLoading(false)
    }
  }

  function handleReset() {
    setIngredients(null)
    setRecipe(null)
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      {!ingredients && (
        <section className="relative  flex flex-col items-center text-center gap-4 py-20 px-4 bg-slate-50 overflow-hidden">
          {/* Decorative background shape */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 opacity-40 blur-3xl" />

          <h1 className="text-5xl font-bold text-slate-600 tracking-wide drop-shadow-lg flex items-center gap-2 relative z-10">
            <GiCookingPot className="text-slate-600" />
            AI Chef
          </h1>
          <p className="text-slate-500 max-w-md relative z-10 mb-10 ">
            Enter your ingredients and let AI suggest a delicious recipe for you!
          </p>
          {/* IngredientsInput above the background */}
          <div className="relative z-10 w-full max-w-md">
            <IngredientsInput onReadyToGenerate={handleGenerate} />
          </div>
        </section>
      )}

      {isLoading && (
        <section
          aria-live="polite"
          aria-busy="true"
          className="flex flex-col items-center justify-center gap-6 py-20 text-center"
        >
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="h-3 w-3 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
            <span className="h-3 w-3 rounded-full bg-slate-600 animate-bounce" />
          </div>
          <h2 className="text-xl font-semibold text-slate-700">Creating your recipe</h2>
          <p className="text-slate-500 max-w-sm">
            Our AI is combining your ingredients into something tasty.
            This usually takes a few seconds.
          </p>
        </section>
      )}

      {recipe && (
        <section className="min-h-screen flex flex-col items-center justify-start px-4 py-10 bg-slate-50">
          <section className="w-full max-w-3xl bg-white rounded-xl shadow-lg ring-1 ring-slate-200 overflow-hidden">
            <article className="prose prose-slate px-6 py-8">
              <ReactMarkdown
                components={{
                  h1: (props) => (
                    <h1 className="text-3xl font-bold text-center text-slate-800 mb-4" {...props} />
                  ),
                  h2: (props) => <h2 className="text-xl font-semibold mt-6" {...props} />,
                  p: (props) => <p className="leading-relaxed text-slate-700" {...props} />,
                  li: (props) => <li className="leading-relaxed ml-5" {...props} />,
                }}
              >
                {recipe}
              </ReactMarkdown>
            </article>
          </section>
          <button
            onClick={handleReset}
            className="mt-6 px-6 py-3 rounded-lg bg-slate-800 text-white font-semibold
             hover:bg-slate-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Start over
          </button>
        </section>
      )}
    </main>
  )
}


