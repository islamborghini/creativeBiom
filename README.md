# Minecraft Biome AI Generator

An AI-powered web application that generates custom Minecraft biomes from natural language descriptions. Built with Next.js, TypeScript, and OpenAI.

## Features

- 🤖 **AI-Powered Generation**: Describe your biome in plain English
- 📦 **Ready-to-Use Datapacks**: Download working Minecraft datapacks instantly
- 🎨 **Full Customization**: Custom colors, vegetation, mobs, and atmosphere
- ⚡ **Fast & Modern**: Built with Next.js 14+ and TypeScript
- 🌍 **Minecraft 1.20+ Compatible**: Uses latest datapack format

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (get one at https://platform.openai.com/api-keys)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Add your OpenAI API key to `.env.local`:
```env
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Describe Your Biome**: Enter a detailed description of your dream biome
   - Example: "A mystical purple forest with glowing mushrooms and fireflies"

2. **Generate**: Click the generate button and wait for AI to create your biome

3. **Download**: Download the generated datapack as a .zip file

4. **Install in Minecraft**:
   - Place the .zip file in `saves/[world_name]/datapacks/`
   - Run `/reload` in-game or restart the world
   - Your biome will spawn in newly generated chunks

## Project Structure

```
biome-generator/
├── app/
│   ├── api/
│   │   └── generate/          # API endpoint for biome generation
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Homepage
├── components/
│   └── BiomeGenerator.tsx     # Main generator component
├── lib/
│   ├── types/
│   │   └── biome.ts          # TypeScript type definitions
│   ├── templates/
│   │   └── base-biome.ts     # Base biome template
│   └── utils/                 # Utility functions
├── minecraft-reference/       # Vanilla biome examples (for reference)
│   └── vanilla-biomes/
└── public/                    # Static assets
```

## How It Works

1. **User Input**: User describes their biome in natural language
2. **AI Processing**: OpenAI GPT-4 analyzes the description and generates:
   - Biome configuration (temperature, precipitation, colors)
   - Custom features (trees, flowers, vegetation)
   - Mob spawning rules
   - Visual effects (particles, fog, sky colors)
3. **Datapack Creation**: Server bundles all files into a valid Minecraft datapack
4. **Download**: User downloads a ready-to-use .zip file

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4
- **Packaging**: JSZip
- **Validation**: Zod

## Examples

Try these example descriptions:

- "A volcanic wasteland with rivers of lava and obsidian spires"
- "A cherry blossom meadow with pink petals floating in the air"
- "A frozen tundra with aurora borealis and ice crystals"
- "A tropical paradise with palm trees and turquoise water"
- "A dark swamp with dead trees and eerie fog"

## Acknowledgments

- Built as a demo project for CreativeMode (YC S2024) internship application
- Minecraft biome format based on Mojang's datapack specification
- Inspired by CreativeMode's vision for AI-powered game modding

---

Built with ❤️ for the Minecraft community
