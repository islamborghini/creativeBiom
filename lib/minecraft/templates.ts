import { BiomeConfig } from '../types/biome';

// Re-export the base biome template
export { baseBiome, packMetaTemplate } from '../templates/base-biome';

// Common feature sets for different biome types
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
};

// Common mob spawner configurations
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
      { type: 'minecraft:skeleton', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:creeper', maxCount: 4, minCount: 4, weight: 100 },
      { type: 'minecraft:enderman', maxCount: 4, minCount: 1, weight: 10 },
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
};
