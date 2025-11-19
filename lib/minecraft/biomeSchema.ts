import { z } from 'zod';

export const MobSpawnSchema = z.object({
  type: z.string(),
  maxCount: z.number(),
  minCount: z.number(),
  weight: z.number(),
});

export const BiomeConfigSchema = z.object({
  temperature: z.number().min(0).max(2),
  downfall: z.number().min(0).max(1),
  has_precipitation: z.boolean(),
  attributes: z.object({
    'minecraft:visual/sky_color': z.string().optional(),
    'minecraft:visual/water_fog_color': z.string().optional(),
    'minecraft:audio/background_music': z.object({
      default: z.object({
        max_delay: z.number(),
        min_delay: z.number(),
        sound: z.string(),
      }),
    }).optional(),
    'minecraft:gameplay/snow_golem_melts': z.boolean().optional(),
  }).optional(),
  carvers: z.array(z.string()),
  effects: z.object({
    water_color: z.string().optional(),
    water_fog_color: z.string().optional(),
    fog_color: z.string().optional(),
    sky_color: z.string().optional(),
    foliage_color: z.string().optional(),
    grass_color: z.string().optional(),
    grass_color_modifier: z.string().optional(),
    dry_foliage_color: z.string().optional(),
    mood_sound: z.object({
      sound: z.string(),
      tick_delay: z.number(),
      block_search_extent: z.number(),
      offset: z.number(),
    }).optional(),
    music: z.object({
      sound: z.string(),
      min_delay: z.number(),
      max_delay: z.number(),
      replace_current_music: z.boolean(),
    }).optional(),
    particle: z.object({
      options: z.object({
        type: z.string(),
      }),
      probability: z.number(),
    }).optional(),
  }),
  features: z.array(z.array(z.string())),
  spawn_costs: z.record(z.unknown()),
  spawners: z.object({
    ambient: z.array(MobSpawnSchema),
    axolotls: z.array(MobSpawnSchema),
    creature: z.array(MobSpawnSchema),
    misc: z.array(MobSpawnSchema),
    monster: z.array(MobSpawnSchema),
    underground_water_creature: z.array(MobSpawnSchema),
    water_ambient: z.array(MobSpawnSchema),
    water_creature: z.array(MobSpawnSchema),
  }),
});

export type BiomeConfigType = z.infer<typeof BiomeConfigSchema>;
