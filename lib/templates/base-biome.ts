import { BiomeConfig } from "../types/biome";

// Base biome template with sensible defaults
export const baseBiome: BiomeConfig = {
  temperature: 0.8,
  downfall: 0.4,
  has_precipitation: true,
  carvers: [
    "minecraft:cave",
    "minecraft:cave_extra_underground",
    "minecraft:canyon",
  ],
  effects: {
    water_color: "#3f76e4",
  },
  features: [
    [], // Step 0: raw_generation
    [
      // Step 1: lakes
      "minecraft:lake_lava_underground",
      "minecraft:lake_lava_surface",
    ],
    [
      // Step 2: local_modifications
      "minecraft:amethyst_geode",
    ],
    [
      // Step 3: underground_structures
      "minecraft:monster_room",
      "minecraft:monster_room_deep",
    ],
    [], // Step 4: surface_structures
    [], // Step 5: strongholds
    [
      // Step 6: underground_ores
      "minecraft:ore_dirt",
      "minecraft:ore_gravel",
      "minecraft:ore_granite_upper",
      "minecraft:ore_granite_lower",
      "minecraft:ore_diorite_upper",
      "minecraft:ore_diorite_lower",
      "minecraft:ore_andesite_upper",
      "minecraft:ore_andesite_lower",
      "minecraft:ore_tuff",
      "minecraft:ore_coal_upper",
      "minecraft:ore_coal_lower",
      "minecraft:ore_iron_upper",
      "minecraft:ore_iron_middle",
      "minecraft:ore_iron_small",
      "minecraft:ore_gold",
      "minecraft:ore_gold_lower",
      "minecraft:ore_redstone",
      "minecraft:ore_redstone_lower",
      "minecraft:ore_diamond",
      "minecraft:ore_diamond_medium",
      "minecraft:ore_diamond_large",
      "minecraft:ore_diamond_buried",
      "minecraft:ore_lapis",
      "minecraft:ore_lapis_buried",
      "minecraft:ore_copper",
      "minecraft:underwater_magma",
      "minecraft:disk_sand",
      "minecraft:disk_clay",
      "minecraft:disk_gravel",
    ],
    [], // Step 7: underground_decoration
    [
      // Step 8: fluid_springs
      "minecraft:spring_water",
      "minecraft:spring_lava",
    ],
    [
      // Step 9: vegetal_decoration - THIS IS WHERE CUSTOMIZATION HAPPENS
      "minecraft:glow_lichen",
      "minecraft:patch_tall_grass_2",
      "minecraft:flower_default",
      "minecraft:patch_grass_plain",
      "minecraft:brown_mushroom_normal",
      "minecraft:red_mushroom_normal",
      "minecraft:patch_sugar_cane",
    ],
    [
      // Step 10: top_layer_modification
      "minecraft:freeze_top_layer",
    ],
  ],
  spawn_costs: {},
  spawners: {
    ambient: [
      {
        type: "minecraft:bat",
        maxCount: 8,
        minCount: 8,
        weight: 10,
      },
    ],
    axolotls: [],
    creature: [
      {
        type: "minecraft:sheep",
        maxCount: 4,
        minCount: 4,
        weight: 12,
      },
      {
        type: "minecraft:pig",
        maxCount: 4,
        minCount: 4,
        weight: 10,
      },
      {
        type: "minecraft:chicken",
        maxCount: 4,
        minCount: 4,
        weight: 10,
      },
      {
        type: "minecraft:cow",
        maxCount: 4,
        minCount: 4,
        weight: 8,
      },
    ],
    misc: [],
    monster: [
      {
        type: "minecraft:spider",
        maxCount: 4,
        minCount: 4,
        weight: 100,
      },
      {
        type: "minecraft:zombie",
        maxCount: 4,
        minCount: 4,
        weight: 95,
      },
      {
        type: "minecraft:zombie_villager",
        maxCount: 1,
        minCount: 1,
        weight: 5,
      },
      {
        type: "minecraft:skeleton",
        maxCount: 4,
        minCount: 4,
        weight: 100,
      },
      {
        type: "minecraft:creeper",
        maxCount: 4,
        minCount: 4,
        weight: 100,
      },
      {
        type: "minecraft:slime",
        maxCount: 4,
        minCount: 4,
        weight: 100,
      },
      {
        type: "minecraft:enderman",
        maxCount: 4,
        minCount: 1,
        weight: 10,
      },
      {
        type: "minecraft:witch",
        maxCount: 1,
        minCount: 1,
        weight: 5,
      },
    ],
    underground_water_creature: [
      {
        type: "minecraft:glow_squid",
        maxCount: 6,
        minCount: 4,
        weight: 10,
      },
    ],
    water_ambient: [],
    water_creature: [],
  },
};

export const packMetaTemplate = {
  pack: {
    pack_format: 48, // Minecraft 1.21
    description: "AI Generated Biome Datapack",
  },
};
