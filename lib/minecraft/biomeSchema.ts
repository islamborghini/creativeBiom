/**
 * Minecraft Biome Schema Validation
 * This file provides Zod schemas for validating Minecraft biome configurations
 * Compatible with Minecraft 1.20+ datapack format
 */

import { z } from 'zod';

/**
 * Validates hex color format (#RRGGBB)
 */
const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
  message: 'Must be a valid hex color (e.g., #3f76e4)',
});

/**
 * Mob spawn configuration
 * Defines how mobs spawn in the biome
 */
export const MobSpawnSchema = z.object({
  type: z.string(),
  maxCount: z.number().int().min(1).max(32),
  minCount: z.number().int().min(1).max(32),
  weight: z.number().int().min(0),
});

/**
 * Particle effect configuration
 * Defines ambient particles in the biome
 */
const ParticleSchema = z.object({
  options: z.object({
    type: z.string(),
  }),
  probability: z.number().min(0).max(1),
});

/**
 * Mood sound configuration
 * Ambient cave/underground sounds
 */
const MoodSoundSchema = z.object({
  sound: z.string(),
  tick_delay: z.number().int(),
  block_search_extent: z.number().int(),
  offset: z.number(),
});

/**
 * Music configuration
 * Background music for the biome
 */
const MusicSchema = z.object({
  sound: z.string(),
  min_delay: z.number().int(),
  max_delay: z.number().int(),
  replace_current_music: z.boolean(),
});

/**
 * Background music attribute
 */
const BackgroundMusicSchema = z.object({
  default: z.object({
    max_delay: z.number().int(),
    min_delay: z.number().int(),
    sound: z.string(),
  }),
});

/**
 * Biome effects configuration
 * Visual and audio effects specific to the biome
 */
const EffectsSchema = z.object({
  water_color: hexColorSchema.optional(),
  water_fog_color: hexColorSchema.optional(),
  fog_color: hexColorSchema.optional(),
  sky_color: hexColorSchema.optional(),
  foliage_color: hexColorSchema.optional(),
  grass_color: hexColorSchema.optional(),
  grass_color_modifier: z.enum(['none', 'dark_forest', 'swamp']).optional(),
  dry_foliage_color: hexColorSchema.optional(),
  mood_sound: MoodSoundSchema.optional(),
  music: MusicSchema.optional(),
  particle: ParticleSchema.optional(),
});

/**
 * Biome attributes
 * Special properties and metadata
 */
const AttributesSchema = z.object({
  'minecraft:visual/sky_color': hexColorSchema.optional(),
  'minecraft:visual/water_fog_color': hexColorSchema.optional(),
  'minecraft:audio/background_music': BackgroundMusicSchema.optional(),
  'minecraft:gameplay/snow_golem_melts': z.boolean().optional(),
}).optional();

/**
 * Spawner categories
 * Defines all mob spawn categories
 */
const SpawnersSchema = z.object({
  ambient: z.array(MobSpawnSchema),
  axolotls: z.array(MobSpawnSchema),
  creature: z.array(MobSpawnSchema),
  misc: z.array(MobSpawnSchema),
  monster: z.array(MobSpawnSchema),
  underground_water_creature: z.array(MobSpawnSchema),
  water_ambient: z.array(MobSpawnSchema),
  water_creature: z.array(MobSpawnSchema),
});

/**
 * Complete biome configuration schema
 * Validates all biome parameters according to Minecraft 1.20+ format
 */
export const BiomeConfigSchema = z.object({
  temperature: z.number().min(-2).max(2),
  downfall: z.number().min(0).max(1),
  has_precipitation: z.boolean(),
  attributes: AttributesSchema,
  carvers: z.array(z.string()),
  effects: EffectsSchema,
  features: z.array(z.array(z.string())).length(11, 'Must have exactly 11 feature generation steps'),
  spawn_costs: z.record(z.string(), z.unknown()),
  spawners: SpawnersSchema,
});

/**
 * Pack metadata schema
 * Defines the pack.mcmeta file structure
 */
export const PackMetaSchema = z.object({
  pack: z.object({
    pack_format: z.number().int().min(1),
    description: z.string().max(256),
  }),
});

/**
 * Configured feature schema
 * Defines a worldgen configured feature
 */
export const ConfiguredFeatureSchema = z.object({
  type: z.string(),
  config: z.record(z.string(), z.unknown()),
});

/**
 * Placement modifier schema
 * Defines how features are placed in the world
 */
export const PlacementModifierSchema = z.object({
  type: z.string().describe('Placement modifier type'),
}).passthrough();

/**
 * Placed feature schema
 * Defines a feature with placement rules
 */
export const PlacedFeatureSchema = z.object({
  feature: z.string(),
  placement: z.array(PlacementModifierSchema),
});

/**
 * Complete generated biome package
 */
export const GeneratedBiomeSchema = z.object({
  namespace: z.string().regex(/^[a-z0-9_]+$/, 'Must be lowercase alphanumeric with underscores'),
  biomeName: z.string().regex(/^[a-z0-9_]+$/, 'Must be lowercase alphanumeric with underscores'),
  biome: BiomeConfigSchema,
  features: z.object({
    configured: z.record(z.string(), ConfiguredFeatureSchema).optional(),
    placed: z.record(z.string(), PlacedFeatureSchema).optional(),
  }),
  packMeta: PackMetaSchema,
});

/**
 * Biome generation request schema
 */
export const BiomeGenerationRequestSchema = z.object({
  description: z.string().min(10).max(1000),
  biomeName: z.string().regex(/^[a-z0-9_]+$/, 'Must be lowercase alphanumeric with underscores').optional(),
});

/**
 * Biome generation response schema
 */
export const BiomeGenerationResponseSchema = z.object({
  success: z.boolean(),
  biome: GeneratedBiomeSchema.optional(),
  downloadUrl: z.string().optional(),
  error: z.string().optional(),
});

// Export inferred TypeScript types
export type BiomeConfigType = z.infer<typeof BiomeConfigSchema>;
export type PackMetaType = z.infer<typeof PackMetaSchema>;
export type MobSpawnType = z.infer<typeof MobSpawnSchema>;
export type ConfiguredFeatureType = z.infer<typeof ConfiguredFeatureSchema>;
export type PlacedFeatureType = z.infer<typeof PlacedFeatureSchema>;
export type GeneratedBiomeType = z.infer<typeof GeneratedBiomeSchema>;
export type BiomeGenerationRequestType = z.infer<typeof BiomeGenerationRequestSchema>;
export type BiomeGenerationResponseType = z.infer<typeof BiomeGenerationResponseSchema>;

/**
 * Helper: Validate biome configuration and return typed result
 */
export function validateBiomeConfig(data: unknown): {
  success: boolean;
  data?: BiomeConfigType;
  errors?: string[];
} {
  try {
    const result = BiomeConfigSchema.safeParse(data);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      errors: result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`),
    };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Validation failed'],
    };
  }
}

/**
 * Helper: Validate and parse AI-generated JSON response
 */
export function parseAIBiomeResponse(jsonString: string): {
  success: boolean;
  biome?: BiomeConfigType;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateBiomeConfig(parsed);

    if (validation.success && validation.data) {
      return { success: true, biome: validation.data };
    }

    return {
      success: false,
      error: validation.errors?.join('; ') || 'Invalid biome configuration',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse JSON',
    };
  }
}
