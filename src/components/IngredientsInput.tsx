"use client"

import { useState } from "react"
import { FiPlus, FiX } from "react-icons/fi"

type IngredientsInputProps = {
  onReadyToGenerate?: (ingredients: string[]) => void
}

export default function IngredientsInput({
  onReadyToGenerate,
}: IngredientsInputProps) {
  const [ingredient, setIngredient] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([])

  const canGenerate = ingredients.length >= 5

  function addIngredient() {
    const value = ingredient.trim()
    if (!value) return
    if (ingredients.includes(value)) return

    const updated = [...ingredients, value]
    setIngredients(updated)
    setIngredient("")
  }

  function removeIngredient(value: string) {
    setIngredients((prev) => prev.filter((i) => i !== value))
  }

  function handleGenerate() {
    if (!canGenerate) return
    onReadyToGenerate?.(ingredients)
  }

  return (
    <section className="w-full max-w-md mx-auto space-y-6">
      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addIngredient()}
          placeholder="Add an ingredient"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-slate-400"
        />

        <button
          onClick={addIngredient}
          className="rounded-lg px-3 py-2 bg-slate-800 text-white
                     hover:bg-slate-700 active:scale-95 transition"
          aria-label="Add ingredient"
        >
          <FiPlus />
        </button>
      </div>

      {/* Ingredients list */}
      {ingredients.length > 0 && (
        <ul className="space-y-2">
          {ingredients.map((item) => (
            <li
              key={item}
              className="flex items-center justify-between
                         rounded-lg bg-slate-100 px-4 py-2"
            >
              <span className="text-slate-700">{item}</span>
              <button
                onClick={() => removeIngredient(item)}
                className="text-slate-500 hover:text-slate-800"
                aria-label={`Remove ${item}`}
              >
                <FiX />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`w-full rounded-lg px-4 py-3 font-semibold transition
          ${
            canGenerate
              ? "bg-slate-800 text-white hover:bg-slate-700"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
      >
        Generate recipe
      </button>

      {/* Helper text */}
      {!canGenerate && (
        <p className="text-sm text-slate-500 text-center">
          Add at least 5 ingredients to generate a recipe
        </p>
      )}
    </section>
  )
}