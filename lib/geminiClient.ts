import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// Zod schema for biome validation
const BiomeEffectsSchema = z.object({
  sky_color: z.number().int(),
  fog_color: z.number().int(),
  water_color: z.number().int(),
  water_fog_color: z.number().int(),
  foliage_color: z.number().int().optional(),
  grass_color: z.number().int().optional(),
  grass_color_modifier: z.enum(['swamp', 'dark_forest']).optional(),
  mood_sound: z.object({
    sound: z.string(),
    tick_delay: z.number(),
    block_search_extent: z.number(),
    offset: z.number()
  }).optional(),
  ambient_sound: z.string().optional(),
  music: z.object({
    sound: z.string(),
    min_delay: z.number(),
    max_delay: z.number(),
    replace_current_music: z.boolean()
  }).optional(),
  particle: z.object({
    options: z.object({
      type: z.string()
    }),
    probability: z.number()
  }).optional()
});

const SpawnerEntrySchema = z.object({
  type: z.string(),
  weight: z.number().int(),
  minCount: z.number().int(),
  maxCount: z.number().int()
});

const BiomeSpawnersSchema = z.object({
  monster: z.array(SpawnerEntrySchema),
  creature: z.array(SpawnerEntrySchema),
  ambient: z.array(SpawnerEntrySchema),
  water_creature: z.array(SpawnerEntrySchema),
  water_ambient: z.array(SpawnerEntrySchema),
  misc: z.array(SpawnerEntrySchema).optional()
});

const BiomeSchema = z.object({
  has_precipitation: z.boolean(),
  temperature: z.number(),
  temperature_modifier: z.enum(['frozen']).optional(),
  downfall: z.number(),
  effects: BiomeEffectsSchema,
  surface_builder: z.string(),
  carvers: z.object({
    air: z.array(z.string()).optional(),
    liquid: z.array(z.string()).optional()
  }).optional(),
  features: z.array(z.array(z.string())),
  starts: z.array(z.string()).optional(),
  spawners: BiomeSpawnersSchema,
  spawn_costs: z.record(z.object({
    energy_budget: z.number(),
    charge: z.number()
  })).optional(),
  player_spawn_friendly: z.boolean().optional(),
  creature_spawn_probability: z.number().optional()
});

export type BiomeConfiguration = z.infer<typeof BiomeSchema>;

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// Structured prompt for biome generation
const BIOME_GENERATION_PROMPT = `You are a Minecraft biome configuration expert. Generate a complete, valid Minecraft biome JSON configuration based on the user's description.

Requirements:
1. Return ONLY valid JSON, no markdown formatting or explanations
2. Follow the exact Minecraft biome specification structure
3. Use realistic values based on vanilla Minecraft biomes
4. Ensure all required fields are present
5. Color values must be packed RGB integers (R << 16 | G << 8 | B)
6. Temperature range: -0.5 to 2.0 (< 0.15 for snow, >= 0.15 for rain)
7. Downfall range: 0.0 to 1.0
8. Include appropriate spawners for the biome type
9. Include features array with 10 stages (0-9), can have empty arrays for unused stages
10. Use appropriate surface_builder: "minecraft:grass", "minecraft:desert", "minecraft:stone", etc.

Example color conversion:
- RGB(140, 180, 250) → 9232634
- RGB(192, 192, 192) → 12638463

Common surface builders:
- minecraft:grass (for grassy biomes)
- minecraft:desert (for sandy biomes)
- minecraft:stone (for mountainous biomes)
- minecraft:mycelium (for mushroom biomes)
- minecraft:nether (for nether biomes)

Common carvers:
- minecraft:cave
- minecraft:canyon

Common features by stage:
- Stage 1: minecraft:lake_water, minecraft:lake_lava
- Stage 6: Ores (minecraft:ore_coal, minecraft:ore_iron, minecraft:ore_gold, etc.)
- Stage 8: Vegetation (minecraft:patch_grass, minecraft:trees, minecraft:flowers, etc.)
- Stage 9: minecraft:freeze_top_layer

Common spawner types:
- Monsters: minecraft:zombie, minecraft:skeleton, minecraft:creeper, minecraft:spider, minecraft:enderman, minecraft:witch
- Creatures: minecraft:cow, minecraft:pig, minecraft:sheep, minecraft:chicken, minecraft:horse
- Ambient: minecraft:bat
- Water creatures: minecraft:squid, minecraft:dolphin
- Water ambient: minecraft:cod, minecraft:salmon, minecraft:tropical_fish

User description: {description}

Generate the biome JSON now:`;

// Helper function to sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

/**
 * Generate a Minecraft biome configuration from a text description using Gemini AI
 * @param description - Natural language description of the desired biome
 * @returns Promise resolving to a validated BiomeConfiguration object
 * @throws Error if generation fails after retries or validation fails
 */
export async function generateBiomeFromDescription(
  description: string
): Promise<BiomeConfiguration> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  if (!description || description.trim().length === 0) {
    throw new Error('Description cannot be empty');
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${MAX_RETRIES}: Generating biome from description...`);

      // Send request to Gemini
      const prompt = BIOME_GENERATION_PROMPT.replace('{description}', description);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('Received response from Gemini');

      // Parse JSON response
      let biomeData: unknown;
      try {
        // Clean up response - remove markdown code blocks if present
        const cleanedText = text
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        biomeData = JSON.parse(cleanedText);
      } catch (parseError) {
        throw new Error(`Failed to parse Gemini response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      // Validate with Zod schema
      try {
        const validatedBiome = BiomeSchema.parse(biomeData);
        console.log('Biome configuration validated successfully');
        return validatedBiome;
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const errorMessages = validationError.errors.map(err =>
            `${err.path.join('.')}: ${err.message}`
          ).join(', ');
          throw new Error(`Biome validation failed: ${errorMessages}`);
        }
        throw validationError;
      }

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if it's a rate limit error
      const isRateLimitError = lastError.message.toLowerCase().includes('rate limit') ||
                               lastError.message.toLowerCase().includes('quota') ||
                               lastError.message.toLowerCase().includes('429');

      if (isRateLimitError && attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * attempt; // Exponential backoff
        console.warn(`Rate limit hit. Retrying in ${delay}ms... (${attempt}/${MAX_RETRIES})`);
        await sleep(delay);
        continue;
      }

      // If it's not a rate limit error or we've exhausted retries, handle accordingly
      if (attempt < MAX_RETRIES) {
        console.warn(`Attempt ${attempt} failed: ${lastError.message}. Retrying...`);
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      // All retries exhausted
      break;
    }
  }

  // If we get here, all retries failed
  throw new Error(
    `Failed to generate biome after ${MAX_RETRIES} attempts. Last error: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Validate an existing biome configuration
 * @param biomeData - Biome configuration object to validate
 * @returns Validated BiomeConfiguration
 * @throws Error if validation fails
 */
export function validateBiomeConfiguration(biomeData: unknown): BiomeConfiguration {
  try {
    return BiomeSchema.parse(biomeData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      throw new Error(`Biome validation failed: ${errorMessages}`);
    }
    throw error;
  }
}

/**
 * Helper function to convert RGB values to packed integer
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Packed RGB integer
 */
export function rgbToInt(r: number, g: number, b: number): number {
  return (r << 16) | (g << 8) | b;
}

/**
 * Helper function to convert packed integer to RGB values
 * @param color - Packed RGB integer
 * @returns Object with r, g, b components
 */
export function intToRgb(color: number): { r: number; g: number; b: number } {
  return {
    r: (color >> 16) & 0xFF,
    g: (color >> 8) & 0xFF,
    b: color & 0xFF
  };
}
