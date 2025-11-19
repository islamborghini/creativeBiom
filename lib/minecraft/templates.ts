import { BiomeConfig, MobSpawn, PackMeta } from '../types/biome';

// Re-export the base biome template
export { baseBiome, packMetaTemplate } from '../templates/base-biome';

/**
 * Pack.mcmeta template for Minecraft 1.20+ datapacks
 * pack_format 48 is for Minecraft 1.21
 * pack_format 41 is for Minecraft 1.20.5-1.20.6
 */
export const createPackMeta = (description: string): PackMeta => ({
  pack: {
    pack_format: 48,
    description,
  },
});

/**
 * Standard carvers for cave generation - used by all biomes
 */
export const STANDARD_CARVERS: string[] = [
  'minecraft:cave',
  'minecraft:cave_extra_underground',
  'minecraft:canyon',
];

/**
 * Standard underground ore features - Step 6
 * Includes all vanilla ores that should appear in most biomes
 */
export const STANDARD_ORES: string[] = [
  'minecraft:ore_dirt',
  'minecraft:ore_gravel',
  'minecraft:ore_granite_upper',
  'minecraft:ore_granite_lower',
  'minecraft:ore_diorite_upper',
  'minecraft:ore_diorite_lower',
  'minecraft:ore_andesite_upper',
  'minecraft:ore_andesite_lower',
  'minecraft:ore_tuff',
  'minecraft:ore_coal_upper',
  'minecraft:ore_coal_lower',
  'minecraft:ore_iron_upper',
  'minecraft:ore_iron_middle',
  'minecraft:ore_iron_small',
  'minecraft:ore_gold',
  'minecraft:ore_gold_lower',
  'minecraft:ore_redstone',
  'minecraft:ore_redstone_lower',
  'minecraft:ore_diamond',
  'minecraft:ore_diamond_medium',
  'minecraft:ore_diamond_large',
  'minecraft:ore_diamond_buried',
  'minecraft:ore_lapis',
  'minecraft:ore_lapis_buried',
  'minecraft:ore_copper',
  'minecraft:underwater_magma',
  'minecraft:disk_sand',
  'minecraft:disk_clay',
  'minecraft:disk_gravel',
];

/**
 * Common feature sets for Step 9 (vegetal_decoration) by biome type
 * This is where biome personality is defined
 */
export const FEATURE_SETS = {
  forest: [
    'minecraft:glow_lichen',
    'minecraft:patch_tall_grass_2',
    'minecraft:dark_forest_vegetation',
    'minecraft:forest_flowers',
    'minecraft:patch_grass_forest',
    'minecraft:brown_mushroom_normal',
    'minecraft:red_mushroom_normal',
  ],
  plains: [
    'minecraft:glow_lichen',
    'minecraft:patch_tall_grass_2',
    'minecraft:trees_plains',
    'minecraft:flower_plains',
    'minecraft:patch_grass_plain',
  ],
  desert: [
    'minecraft:patch_dry_grass_desert',
    'minecraft:patch_dead_bush_2',
    'minecraft:patch_cactus_desert',
  ],
  mushroom: [
    'minecraft:brown_mushroom_normal',
    'minecraft:red_mushroom_normal',
    'minecraft:brown_mushroom_taiga',
    'minecraft:red_mushroom_taiga',
  ],
  cherry: [
    'minecraft:glow_lichen',
    'minecraft:patch_tall_grass_2',
    'minecraft:patch_grass_plain',
    'minecraft:flower_cherry',
    'minecraft:trees_cherry',
  ],
  swamp: [
    'minecraft:trees_swamp',
    'minecraft:flower_swamp',
    'minecraft:patch_grass_normal',
    'minecraft:brown_mushroom_swamp',
    'minecraft:red_mushroom_swamp',
    'minecraft:patch_waterlily',
  ],
  jungle: [
    'minecraft:trees_jungle',
    'minecraft:flower_jungle',
    'minecraft:patch_grass_jungle',
    'minecraft:bamboo_vegetation',
    'minecraft:vines',
  ],
  taiga: [
    'minecraft:trees_taiga',
    'minecraft:flower_taiga',
    'minecraft:patch_grass_taiga',
    'minecraft:brown_mushroom_taiga',
    'minecraft:red_mushroom_taiga',
  ],
};

/**
 * Common mob spawner configurations by difficulty level
 */
export const MOB_SPAWNERS = {
  peaceful: {
    creature: [
      { type: 'minecraft:sheep', maxCount: 4, minCount: 4, weight: 12 },
      { type: 'minecraft:rabbit', maxCount: 3, minCount: 2, weight: 4 },
    ],
    monster: [],
  },
  standard: {
    creature: [
      { type: 'minecraft:sheep', maxCount: 4, minCount: 4, weight: 12 },
      { type: 'minecraft:pig', maxCount: 4, minCount: 4, weight: 10 },
      { type: 'minecraft:chicken', maxCount: 4, minCount: 4, weight: 10 },
      { type: 'minecraft:cow', maxCount: 4, minCount: 4, weight: 8 },
    ],
    monster: [
      { type: 'minecraft:spider', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:zombie', maxCount: 4, minCount: 4, weight: 95 },
      { type: 'minecraft:zombie_villager', maxCount: 1, minCount: 1, weight: 5 },
      { type: 'minecraft:skeleton', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:creeper', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:slime', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:enderman', maxCount: 4, minCount: 1, weight: 10 },
      { type: 'minecraft:witch', maxCount: 1, minCount: 1, weight: 5 },
    ],
  },
  hostile: {
    creature: [],
    monster: [
      { type: 'minecraft:spider', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:zombie', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:skeleton', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:creeper', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:enderman', maxCount: 4, minCount: 2, weight: 20 },
      { type: 'minecraft:witch', maxCount: 2, minCount: 1, weight: 10 },
    ],
  },
  desert: {
    creature: [
      { type: 'minecraft:rabbit', maxCount: 4, minCount: 2, weight: 4 },
    ],
    monster: [
      { type: 'minecraft:spider', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:zombie', maxCount: 4, minCount: 4, weight: 19 },
      { type: 'minecraft:zombie_villager', maxCount: 1, minCount: 1, weight: 1 },
      { type: 'minecraft:skeleton', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:creeper', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:slime', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:enderman', maxCount: 4, minCount: 1, weight: 10 },
      { type: 'minecraft:witch', maxCount: 1, minCount: 1, weight: 5 },
      { type: 'minecraft:husk', maxCount: 4, minCount: 4, weight: 80 },
    ],
  },
};

/**
 * Standard ambient mob spawns
 */
export const AMBIENT_SPAWNS: MobSpawn[] = [
  {
    type: 'minecraft:bat',
    maxCount: 8,
    minCount: 8,
    weight: 10,
  },
];

/**
 * Standard underground water creature spawns
 */
export const UNDERGROUND_WATER_SPAWNS: MobSpawn[] = [
  {
    type: 'minecraft:glow_squid',
    maxCount: 6,
    minCount: 4,
    weight: 10,
  },
];

/**
 * Create a complete feature array with all 11 steps (indices 0-10)
 * Minecraft biomes require exactly 11 feature generation steps
 */
export const createFeatureArray = (vegetalDecorations: string[]): string[][] => [
  [], // Step 0: raw_generation
  ['minecraft:lake_lava_underground', 'minecraft:lake_lava_surface'], // Step 1: lakes
  ['minecraft:amethyst_geode'], // Step 2: local_modifications
  ['minecraft:monster_room', 'minecraft:monster_room_deep'], // Step 3: underground_structures
  [], // Step 4: surface_structures
  [], // Step 5: strongholds
  [...STANDARD_ORES], // Step 6: underground_ores
  ['minecraft:ore_infested'], // Step 7: underground_decoration
  ['minecraft:spring_water', 'minecraft:spring_lava'], // Step 8: fluid_springs
  [...vegetalDecorations], // Step 9: vegetal_decoration - CUSTOMIZATION HAPPENS HERE
  ['minecraft:freeze_top_layer'], // Step 10: top_layer_modification
];

/**
 * Default color schemes for different biome moods
 */
export const COLOR_PALETTES = {
  standard: {
    sky_color: '#78a7ff',
    water_color: '#3f76e4',
    water_fog_color: '#050533',
    fog_color: '#c0d8ff',
  },
  warm: {
    sky_color: '#6eb1ff',
    water_color: '#3f76e4',
    water_fog_color: '#050533',
    fog_color: '#c0d8ff',
  },
  cold: {
    sky_color: '#7ba4ff',
    water_color: '#3938c9',
    water_fog_color: '#050533',
    fog_color: '#c0d8ff',
  },
  mystical: {
    sky_color: '#5d4d8a',
    water_color: '#9d4dff',
    water_fog_color: '#2d1d4d',
    fog_color: '#8a7dbb',
    foliage_color: '#6b4d9a',
    grass_color: '#4a3d5a',
  },
  volcanic: {
    sky_color: '#4d4d4d',
    water_color: '#ff5733',
    water_fog_color: '#331100',
    fog_color: '#666666',
    foliage_color: '#4d2600',
    grass_color: '#332200',
  },
  cherry: {
    sky_color: '#7ba4ff',
    water_color: '#5db7ef',
    water_fog_color: '#5db7ef',
    foliage_color: '#b6db61',
    grass_color: '#b6db61',
  },
};

/**
 * Background music options for different biome types
 */
export const BACKGROUND_MUSIC = {
  overworld: 'minecraft:music.overworld.meadow',
  forest: 'minecraft:music.overworld.forest',
  desert: 'minecraft:music.overworld.desert',
  cherry: 'minecraft:music.overworld.cherry_grove',
  jungle: 'minecraft:music.overworld.jungle',
  swamp: 'minecraft:music.overworld.swamp',
  badlands: 'minecraft:music.overworld.badlands',
};

/**
 * Helper function to create a complete biome configuration
 */
export function createBiomeConfig(options: {
  temperature: number;
  downfall: number;
  vegetalDecorations: string[];
  colors?: {
    sky_color?: string;
    water_color?: string;
    water_fog_color?: string;
    fog_color?: string;
    foliage_color?: string;
    grass_color?: string;
  };
  spawnerType?: keyof typeof MOB_SPAWNERS;
  music?: string;
  hasSnowGolemMelts?: boolean;
}): BiomeConfig {
  const {
    temperature,
    downfall,
    vegetalDecorations,
    colors = {},
    spawnerType = 'standard',
    music,
    hasSnowGolemMelts,
  } = options;

  const defaultColors = COLOR_PALETTES.standard;
  const spawners = MOB_SPAWNERS[spawnerType];

  const biome: BiomeConfig = {
    temperature,
    downfall,
    has_precipitation: temperature <= 1.5 && downfall > 0,
    carvers: [...STANDARD_CARVERS],
    effects: {
      water_color: colors.water_color || defaultColors.water_color,
      water_fog_color: colors.water_fog_color || defaultColors.water_fog_color,
      fog_color: colors.fog_color || defaultColors.fog_color,
      sky_color: colors.sky_color || defaultColors.sky_color,
      ...(colors.foliage_color && { foliage_color: colors.foliage_color }),
      ...(colors.grass_color && { grass_color: colors.grass_color }),
    },
    features: createFeatureArray(vegetalDecorations),
    spawn_costs: {},
    spawners: {
      ambient: [...AMBIENT_SPAWNS],
      axolotls: [],
      creature: spawners.creature,
      misc: [],
      monster: spawners.monster,
      underground_water_creature: [...UNDERGROUND_WATER_SPAWNS],
      water_ambient: [],
      water_creature: [],
    },
  };

  // Add optional attributes
  if (music || hasSnowGolemMelts !== undefined || colors.sky_color) {
    biome.attributes = {};

    if (music) {
      biome.attributes['minecraft:audio/background_music'] = {
        default: {
          max_delay: 24000,
          min_delay: 12000,
          sound: music,
        },
      };
    }

    if (hasSnowGolemMelts !== undefined) {
      biome.attributes['minecraft:gameplay/snow_golem_melts'] = hasSnowGolemMelts;
    }

    if (colors.sky_color) {
      biome.attributes['minecraft:visual/sky_color'] = colors.sky_color;
    }

    if (colors.water_fog_color) {
      biome.attributes['minecraft:visual/water_fog_color'] = colors.water_fog_color;
    }
  }

  return biome;
}
