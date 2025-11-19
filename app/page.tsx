import BiomeGenerator from "@/components/BiomeGenerator";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Minecraft Biome AI Generator
                </h1>
                <p className="text-sm text-gray-400">
                  Create custom biomes with natural language
                </p>
              </div>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Description */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Generate Custom Minecraft Biomes
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Describe your dream biome in plain English, and our AI will generate
            a working Minecraft datapack. No coding required.
          </p>
        </div>

        {/* Generator Component */}
        <BiomeGenerator />

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              AI-Powered
            </h3>
            <p className="text-gray-400">
              Advanced AI understands your description and generates complete
              biome configurations with custom features.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Ready to Use
            </h3>
            <p className="text-gray-400">
              Download a complete datapack that works immediately. Just drop it
              into your world folder.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Fully Customizable
            </h3>
            <p className="text-gray-400">
              Custom colors, vegetation, mobs, and atmosphere. Create anything
              from alien worlds to fantasy realms.
            </p>
          </div>
        </div>

        {/* Examples */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Try These Examples
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "A mystical purple forest with glowing mushrooms and fireflies",
              "A volcanic wasteland with rivers of lava and obsidian spires",
              "A cherry blossom meadow with pink petals floating in the air",
              "A frozen tundra with aurora borealis and ice crystals",
              "A tropical paradise with palm trees and turquoise water",
              "A dark swamp with dead trees and eerie fog",
            ].map((example, idx) => (
              <div
                key={idx}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer group"
              >
                <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
                  {example}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-20 bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <p className="text-gray-300">
                Describe your biome in natural language
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <p className="text-gray-300">
                AI generates biome configuration and features
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <p className="text-gray-300">Download your custom datapack</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                4
              </div>
              <p className="text-gray-300">
                Add to Minecraft and explore your creation
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            Built with Next.js, TypeScript, and AI. For Minecraft 1.20+
          </p>
        </div>
      </footer>
    </div>
  );
}
