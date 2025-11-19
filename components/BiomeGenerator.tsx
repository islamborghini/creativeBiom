"use client";

import { useState } from "react";

export default function BiomeGenerator() {
  const [description, setDescription] = useState("");
  const [biomeName, setBiomeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError("Please enter a biome description");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          biomeName: biomeName || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate biome");
      }

      // Get the blob (zip file)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${biomeName || "custom_biome"}_datapack.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Reset form
      setDescription("");
      setBiomeName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setDescription(example);
  };

  const examples = [
    "A mystical purple forest with glowing mushrooms and fireflies",
    "A volcanic wasteland with rivers of lava and obsidian spires",
    "A cherry blossom meadow with pink petals floating in the air",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <div className="space-y-6">
          {/* Biome Name Input */}
          <div>
            <label
              htmlFor="biomeName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Biome Name (optional)
            </label>
            <input
              type="text"
              id="biomeName"
              value={biomeName}
              onChange={(e) => setBiomeName(e.target.value)}
              placeholder="my_custom_biome"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to auto-generate from description
            </p>
          </div>

          {/* Description Textarea */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Describe Your Biome
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: A mystical purple forest with glowing mushrooms, floating particles, and peaceful creatures. The trees have dark bark and luminescent leaves..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Be specific about colors, vegetation, atmosphere, and features
            </p>
          </div>

          {/* Quick Examples */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Quick examples:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(example)}
                  className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-full transition-colors"
                >
                  {example.substring(0, 40)}...
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Generating your biome...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Generate Biome Datapack</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="text-blue-400 text-xl">ℹ️</div>
          <div>
            <p className="text-blue-300 text-sm font-medium mb-1">
              How to install:
            </p>
            <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
              <li>Download the generated datapack</li>
              <li>
                Place it in your world&apos;s datapacks folder:
                <code className="ml-1 px-1.5 py-0.5 bg-gray-900 rounded text-xs">
                  saves/[world_name]/datapacks/
                </code>
              </li>
              <li>Run /reload in-game or restart the world</li>
              <li>
                Your biome will spawn naturally in newly generated chunks
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
