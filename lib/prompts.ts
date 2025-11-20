/**
 * Prompts and examples for Gemini AI biome generation
 * Structured to teach the model about Minecraft 1.20+ biome format
 */

export const SYSTEM_PROMPT = `You are an expert Minecraft biome configuration generator. Your task is to create valid Minecraft 1.20+ datapack biome JSON files based on user descriptions.

## CRITICAL RULES:
1. Output ONLY valid JSON - no markdown, no explanations, no code blocks
2. Follow the exact Minecraft biome specification
3. All fields must use correct data types and value ranges
4. Use realistic values inspired by vanilla Minecraft

## MINECRAFT BIOME JSON STRUCTURE:

A valid biome file contains these sections:
- Climate properties (temperature, downfall, precipitation)
- Visual effects (colors, sounds, particles)
- Surface generation (surface_builder)
- World generation features (ores, vegetation, structures)
- Mob spawning rules

## CLIMATE PARAMETERS:

**temperature** (float, range: -2.0 to 2.0):
- Below 0.15: Snow falls, water freezes
- 0.15 to 0.95: Temperate, rain falls
- Above 0.95: Hot, rapid crop growth
- Above 2.0: Desert-like, no rain

Examples:
- Snowy: -0.5 to 0.0
- Cold: 0.0 to 0.3
- Temperate: 0.3 to 0.9
- Warm: 0.9 to 1.5
- Hot: 1.5 to 2.0

**downfall** (float, range: 0.0 to 1.0):
- Also called "humidity"
- 0.0: Completely dry (deserts)
- 0.1-0.3: Arid
- 0.4-0.7: Moderate
- 0.8-1.0: Very wet (jungles, swamps)
- Affects grass/foliage color intensity

**has_precipitation** (boolean):
- true: Can have rain or snow
- false: No weather (deserts, nether)

**temperature_modifier** (string, optional):
- "frozen": Special modifier for ice spikes biome

## VISUAL EFFECTS (colors as packed RGB integers):

Calculate packed integer: (R << 16) | (G << 8) | B

**Required color fields:**
- sky_color: Sky color (affected by temperature)
  * Cold biomes: 8103167 (bluish)
  * Temperate: 7907327 (normal blue)
  * Warm: 7254527 (lighter blue)

- fog_color: Distance fog (usually 12638463)

- water_color: Water block color
  * Normal: 4159204
  * Warm/tropical: 4445678
  * Swamp: 6388580
  * Cold: 3750089

- water_fog_color: Underwater fog
  * Normal: 329011
  * Tropical: 270131
  * Swamp: 2302743

**Optional color fields:**
- grass_color: Override default grass color
- foliage_color: Override default foliage color
- grass_color_modifier: "swamp" or "dark_forest"

**Sound effects (optional):**
- mood_sound: Cave/ambient sounds
- ambient_sound: Continuous background sound
- music: Background music
- additions_sound: Random sound effects
- particle: Ambient particles (ash, spores)

## BLOCK PALETTES:

**surface_builder** (string):
Defines the surface block configuration:
- "minecraft:grass": Grass blocks on surface, dirt underneath
- "minecraft:desert": Sand surface and underground
- "minecraft:stone": Stone mountain surface
- "minecraft:badlands": Red sand/terracotta layers
- "minecraft:mycelium": Mycelium surface for mushroom biomes
- "minecraft:nether": Netherrack-based surface
- "minecraft:soul_sand_valley": Soul sand/soil surface
- "minecraft:basalt_deltas": Basalt/blackstone surface
- "minecraft:warped_forest": Warped nylium surface
- "minecraft:crimson_forest": Crimson nylium surface

## CARVERS (caves and ravines):

```json
"carvers": {
  "air": [
    "minecraft:cave",
    "minecraft:canyon"
  ],
  "liquid": [
    "minecraft:underwater_canyon",
    "minecraft:underwater_cave"
  ]
}
```

Most biomes use the standard air carvers. Omit liquid carvers unless it's an ocean biome.

## FEATURES (World Generation):

Features are organized in 10 stages (0-9). Each stage is an array of feature IDs.
Features generate in order: stage 0 first, stage 9 last.

### Common Feature Stages:

**Stage 0** - Raw Generation:
- Usually empty

**Stage 1** - Lakes:
- minecraft:lake_water
- minecraft:lake_lava

**Stage 2** - Local Modifications:
- Usually empty

**Stage 3** - Underground Structures:
- minecraft:fossil (deserts, swamps)
- minecraft:monster_room (dungeons)

**Stage 4** - Surface Structures:
- Usually empty

**Stage 5** - Strongholds:
- Usually empty

**Stage 6** - Underground Ores:
- minecraft:ore_dirt
- minecraft:ore_gravel
- minecraft:ore_granite
- minecraft:ore_diorite
- minecraft:ore_andesite
- minecraft:ore_coal
- minecraft:ore_iron
- minecraft:ore_gold
- minecraft:ore_redstone
- minecraft:ore_diamond
- minecraft:ore_lapis
- minecraft:ore_emerald (mountains only)

**Stage 7** - Underground Decoration:
- minecraft:ore_infested (stone variants)

**Stage 8** - Vegetal Decoration (MOST IMPORTANT):

Trees:
- minecraft:trees_plains (oak, occasional bee nests)
- minecraft:trees_birch
- minecraft:trees_birch_and_oak
- minecraft:trees_forest (dense oak/birch)
- minecraft:trees_flower_forest
- minecraft:trees_taiga (spruce)
- minecraft:trees_giant_taiga (large spruce)
- minecraft:trees_jungle (large jungle trees)
- minecraft:bamboo_vegetation (bamboo, some jungle trees)
- minecraft:trees_savanna (acacia)
- minecraft:trees_swamp (swamp oak with vines)

Vegetation:
- minecraft:flower_plain (dandelions, poppies)
- minecraft:flower_forest (diverse flowers)
- minecraft:flower_meadow
- minecraft:patch_tall_grass_2 (sparse tall grass)
- minecraft:patch_tall_grass (moderate tall grass)
- minecraft:patch_grass_plain (grass blocks)
- minecraft:patch_grass_forest (denser grass)
- minecraft:patch_grass_jungle (very dense)
- minecraft:patch_grass_taiga
- minecraft:patch_grass_savanna
- minecraft:patch_dead_bush (deserts)
- minecraft:patch_dead_bush_2 (sparse dead bushes)
- minecraft:patch_melon (jungles)
- minecraft:patch_berry_bush (taiga)
- minecraft:patch_waterlily (swamps)
- minecraft:seagrass_simple (underwater)
- minecraft:seagrass_swamp

Special Features:
- minecraft:patch_cactus (deserts)
- minecraft:patch_sugar_cane (near water)
- minecraft:patch_sugar_cane_desert
- minecraft:patch_sugar_cane_swamp
- minecraft:patch_pumpkin (rare pumpkins)
- minecraft:brown_mushroom_normal
- minecraft:red_mushroom_normal
- minecraft:brown_mushroom_swamp
- minecraft:red_mushroom_swamp
- minecraft:brown_mushroom_taiga
- minecraft:red_mushroom_taiga

Rocks and Boulders:
- minecraft:forest_rock (mossy cobblestone)
- minecraft:ice_spike (ice spikes biome)
- minecraft:ice_patch (frozen peaks)
- minecraft:blue_ice (frozen ocean)

Structures:
- minecraft:village_plains
- minecraft:village_desert
- minecraft:village_savanna
- minecraft:village_taiga
- minecraft:village_snowy
- minecraft:pillager_outpost
- minecraft:desert_pyramid
- minecraft:jungle_pyramid
- minecraft:swamp_hut
- minecraft:igloo
- minecraft:ruined_portal

**Stage 9** - Top Layer Modification:
- minecraft:freeze_top_layer (ice/snow on water/ground)

### Vegetation Density Guidelines:
- Sparse (plains): patch_tall_grass_2, flower_plain
- Moderate (forest): patch_grass_forest, trees_birch_and_oak
- Dense (jungle): patch_grass_jungle, bamboo_vegetation, trees_jungle
- Minimal (desert): patch_dead_bush_2, patch_cactus

## MOB SPAWNING RULES:

### Spawner Categories:

1. **monster**: Hostile mobs (spawn in darkness)
2. **creature**: Passive animals (spawn on grass in light)
3. **ambient**: Ambient mobs (bats)
4. **water_creature**: Large aquatic animals (dolphins, squid)
5. **water_ambient**: Small fish
6. **misc**: Miscellaneous (usually empty)

### Spawner Entry Format:
```json
{
  "type": "minecraft:entity_id",
  "weight": 100,
  "minCount": 4,
  "maxCount": 4
}
```

**weight**: Spawn probability (higher = more common)
- Common mobs: 100
- Uncommon: 10-50
- Rare: 1-10

**minCount/maxCount**: Group size range

### Common Monster Spawners (most biomes):
```json
"monster": [
  {"type": "minecraft:spider", "weight": 100, "minCount": 4, "maxCount": 4},
  {"type": "minecraft:zombie", "weight": 95, "minCount": 4, "maxCount": 4},
  {"type": "minecraft:zombie_villager", "weight": 5, "minCount": 1, "maxCount": 1},
  {"type": "minecraft:skeleton", "weight": 100, "minCount": 4, "maxCount": 4},
  {"type": "minecraft:creeper", "weight": 100, "minCount": 4, "maxCount": 4},
  {"type": "minecraft:slime", "weight": 100, "minCount": 4, "maxCount": 4},
  {"type": "minecraft:enderman", "weight": 10, "minCount": 1, "maxCount": 4},
  {"type": "minecraft:witch", "weight": 5, "minCount": 1, "maxCount": 1}
]
```

### Biome-Specific Monster Variants:
- Cold biomes: Add minecraft:stray (skeleton variant)
- Desert: Add minecraft:husk (zombie variant, weight: 80)
- Ocean: Add minecraft:drowned (weight: 100)

### Common Creature Spawners:
```json
"creature": [
  {"type": "minecraft:sheep", "weight": 12, "minCount": 4, "maxCount": 4},
  {"type": "minecraft:pig", "weight": 10, "minCount": 4, "maxCount": 4},
  {"type": "minecraft:chicken", "weight": 10, "minCount": 4, "maxCount": 4},
  {"type": "minecraft:cow", "weight": 8, "minCount": 4, "maxCount": 4}
]
```

### Biome-Specific Creatures:
- Plains: minecraft:horse (weight: 5), minecraft:donkey (weight: 1)
- Forest: minecraft:wolf (weight: 5)
- Jungle: minecraft:parrot (weight: 40), minecraft:panda (weight: 1), minecraft:ocelot (weight: 2)
- Taiga: minecraft:wolf (weight: 8), minecraft:fox (weight: 8), minecraft:rabbit (weight: 4)
- Savanna: minecraft:horse (weight: 1), minecraft:llama (weight: 4)
- Desert: minecraft:rabbit (weight: 4)
- Mountains: minecraft:goat (weight: 5)
- Swamp: minecraft:frog (weight: 10)

### Ambient:
```json
"ambient": [
  {"type": "minecraft:bat", "weight": 10, "minCount": 8, "maxCount": 8}
]
```

### Water Creatures (for biomes near water):
```json
"water_creature": [
  {"type": "minecraft:squid", "weight": 10, "minCount": 1, "maxCount": 4}
]
```

Ocean biomes add: minecraft:dolphin (weight: 2)

### Water Ambient (ocean/river biomes):
```json
"water_ambient": [
  {"type": "minecraft:cod", "weight": 75, "minCount": 3, "maxCount": 6},
  {"type": "minecraft:salmon", "weight": 25, "minCount": 1, "maxCount": 5},
  {"type": "minecraft:tropical_fish", "weight": 25, "minCount": 8, "maxCount": 8}
]
```

Cold ocean: minecraft:cod only
Warm ocean: Add minecraft:pufferfish

## OPTIONAL FIELDS:

**player_spawn_friendly** (boolean):
- true: Players can spawn here naturally
- Typically true for: plains, forest, taiga, savanna

**creature_spawn_probability** (float):
- Default spawn chance multiplier (usually 0.1)

**spawn_costs** (object):
Advanced spawn control (usually omitted).

## COMPLETE EXAMPLE BIOMES:
`;

export const EXAMPLE_BIOMES = {
  plains: {
    name: "Plains",
    description: "A flat, grassy biome with scattered flowers and trees. Good for farming and building.",
    json: {
      has_precipitation: true,
      temperature: 0.8,
      downfall: 0.4,
      effects: {
        sky_color: 7907327,
        fog_color: 12638463,
        water_color: 4159204,
        water_fog_color: 329011,
        mood_sound: {
          sound: "minecraft:ambient.cave",
          tick_delay: 6000,
          block_search_extent: 8,
          offset: 2.0
        }
      },
      surface_builder: "minecraft:grass",
      carvers: {
        air: ["minecraft:cave", "minecraft:canyon"]
      },
      features: [
        [],
        ["minecraft:lake_water", "minecraft:lake_lava"],
        [],
        [],
        [],
        [],
        [
          "minecraft:ore_dirt",
          "minecraft:ore_gravel",
          "minecraft:ore_granite",
          "minecraft:ore_diorite",
          "minecraft:ore_andesite",
          "minecraft:ore_coal",
          "minecraft:ore_iron",
          "minecraft:ore_gold",
          "minecraft:ore_redstone",
          "minecraft:ore_diamond",
          "minecraft:ore_lapis"
        ],
        [],
        [
          "minecraft:patch_tall_grass_2",
          "minecraft:trees_plains",
          "minecraft:flower_plain",
          "minecraft:patch_grass_plain",
          "minecraft:brown_mushroom_normal",
          "minecraft:red_mushroom_normal",
          "minecraft:patch_sugar_cane",
          "minecraft:patch_pumpkin"
        ],
        ["minecraft:freeze_top_layer"]
      ],
      spawners: {
        monster: [
          { type: "minecraft:spider", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:zombie", weight: 95, minCount: 4, maxCount: 4 },
          { type: "minecraft:zombie_villager", weight: 5, minCount: 1, maxCount: 1 },
          { type: "minecraft:skeleton", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:creeper", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:slime", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:enderman", weight: 10, minCount: 1, maxCount: 4 },
          { type: "minecraft:witch", weight: 5, minCount: 1, maxCount: 1 }
        ],
        creature: [
          { type: "minecraft:sheep", weight: 12, minCount: 4, maxCount: 4 },
          { type: "minecraft:pig", weight: 10, minCount: 4, maxCount: 4 },
          { type: "minecraft:chicken", weight: 10, minCount: 4, maxCount: 4 },
          { type: "minecraft:cow", weight: 8, minCount: 4, maxCount: 4 },
          { type: "minecraft:horse", weight: 5, minCount: 2, maxCount: 6 },
          { type: "minecraft:donkey", weight: 1, minCount: 1, maxCount: 3 }
        ],
        ambient: [
          { type: "minecraft:bat", weight: 10, minCount: 8, maxCount: 8 }
        ],
        water_creature: [],
        water_ambient: []
      },
      player_spawn_friendly: true,
      creature_spawn_probability: 0.1
    }
  },

  forest: {
    name: "Forest",
    description: "A densely wooded biome with oak and birch trees, abundant grass, and flowers.",
    json: {
      has_precipitation: true,
      temperature: 0.7,
      downfall: 0.8,
      effects: {
        sky_color: 7972607,
        fog_color: 12638463,
        water_color: 4159204,
        water_fog_color: 329011,
        mood_sound: {
          sound: "minecraft:ambient.cave",
          tick_delay: 6000,
          block_search_extent: 8,
          offset: 2.0
        }
      },
      surface_builder: "minecraft:grass",
      carvers: {
        air: ["minecraft:cave", "minecraft:canyon"]
      },
      features: [
        [],
        ["minecraft:lake_water", "minecraft:lake_lava"],
        [],
        [],
        [],
        [],
        [
          "minecraft:ore_dirt",
          "minecraft:ore_gravel",
          "minecraft:ore_granite",
          "minecraft:ore_diorite",
          "minecraft:ore_andesite",
          "minecraft:ore_coal",
          "minecraft:ore_iron",
          "minecraft:ore_gold",
          "minecraft:ore_redstone",
          "minecraft:ore_diamond",
          "minecraft:ore_lapis"
        ],
        [],
        [
          "minecraft:forest_rock",
          "minecraft:trees_birch_and_oak",
          "minecraft:flower_forest",
          "minecraft:patch_grass_forest",
          "minecraft:brown_mushroom_normal",
          "minecraft:red_mushroom_normal",
          "minecraft:patch_sugar_cane",
          "minecraft:patch_pumpkin"
        ],
        ["minecraft:freeze_top_layer"]
      ],
      spawners: {
        monster: [
          { type: "minecraft:spider", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:zombie", weight: 95, minCount: 4, maxCount: 4 },
          { type: "minecraft:zombie_villager", weight: 5, minCount: 1, maxCount: 1 },
          { type: "minecraft:skeleton", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:creeper", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:slime", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:enderman", weight: 10, minCount: 1, maxCount: 4 },
          { type: "minecraft:witch", weight: 5, minCount: 1, maxCount: 1 }
        ],
        creature: [
          { type: "minecraft:sheep", weight: 12, minCount: 4, maxCount: 4 },
          { type: "minecraft:pig", weight: 10, minCount: 4, maxCount: 4 },
          { type: "minecraft:chicken", weight: 10, minCount: 4, maxCount: 4 },
          { type: "minecraft:cow", weight: 8, minCount: 4, maxCount: 4 },
          { type: "minecraft:wolf", weight: 5, minCount: 4, maxCount: 4 }
        ],
        ambient: [
          { type: "minecraft:bat", weight: 10, minCount: 8, maxCount: 8 }
        ],
        water_creature: [],
        water_ambient: []
      },
      player_spawn_friendly: true,
      creature_spawn_probability: 0.1
    }
  },

  desert: {
    name: "Desert",
    description: "A hot, sandy biome with cacti, dead bushes, and occasional desert wells. No rain.",
    json: {
      has_precipitation: false,
      temperature: 2.0,
      downfall: 0.0,
      effects: {
        sky_color: 7254527,
        fog_color: 12638463,
        water_color: 4159204,
        water_fog_color: 329011,
        mood_sound: {
          sound: "minecraft:ambient.cave",
          tick_delay: 6000,
          block_search_extent: 8,
          offset: 2.0
        }
      },
      surface_builder: "minecraft:desert",
      carvers: {
        air: ["minecraft:cave", "minecraft:canyon"]
      },
      features: [
        [],
        ["minecraft:lake_lava"],
        [],
        ["minecraft:fossil"],
        ["minecraft:desert_pyramid"],
        [],
        [
          "minecraft:ore_dirt",
          "minecraft:ore_gravel",
          "minecraft:ore_granite",
          "minecraft:ore_diorite",
          "minecraft:ore_andesite",
          "minecraft:ore_coal",
          "minecraft:ore_iron",
          "minecraft:ore_gold",
          "minecraft:ore_redstone",
          "minecraft:ore_diamond",
          "minecraft:ore_lapis"
        ],
        [],
        [
          "minecraft:patch_dead_bush_2",
          "minecraft:patch_cactus",
          "minecraft:patch_sugar_cane_desert"
        ],
        ["minecraft:freeze_top_layer"]
      ],
      spawners: {
        monster: [
          { type: "minecraft:spider", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:zombie", weight: 19, minCount: 4, maxCount: 4 },
          { type: "minecraft:husk", weight: 80, minCount: 4, maxCount: 4 },
          { type: "minecraft:zombie_villager", weight: 1, minCount: 1, maxCount: 1 },
          { type: "minecraft:skeleton", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:creeper", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:slime", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:enderman", weight: 10, minCount: 1, maxCount: 4 },
          { type: "minecraft:witch", weight: 5, minCount: 1, maxCount: 1 }
        ],
        creature: [
          { type: "minecraft:rabbit", weight: 4, minCount: 2, maxCount: 3 }
        ],
        ambient: [
          { type: "minecraft:bat", weight: 10, minCount: 8, maxCount: 8 }
        ],
        water_creature: [],
        water_ambient: []
      },
      creature_spawn_probability: 0.1
    }
  },

  mountains: {
    name: "Mountains",
    description: "A high-altitude biome with exposed stone, sparse vegetation, and emerald ore. Cold climate with snow at peaks.",
    json: {
      has_precipitation: true,
      temperature: 0.2,
      downfall: 0.3,
      effects: {
        sky_color: 8233727,
        fog_color: 12638463,
        water_color: 4159204,
        water_fog_color: 329011,
        mood_sound: {
          sound: "minecraft:ambient.cave",
          tick_delay: 6000,
          block_search_extent: 8,
          offset: 2.0
        }
      },
      surface_builder: "minecraft:grass",
      carvers: {
        air: ["minecraft:cave", "minecraft:canyon"]
      },
      features: [
        [],
        ["minecraft:lake_water", "minecraft:lake_lava"],
        [],
        ["minecraft:monster_room"],
        [],
        [],
        [
          "minecraft:ore_dirt",
          "minecraft:ore_gravel",
          "minecraft:ore_granite",
          "minecraft:ore_diorite",
          "minecraft:ore_andesite",
          "minecraft:ore_coal",
          "minecraft:ore_iron",
          "minecraft:ore_gold",
          "minecraft:ore_redstone",
          "minecraft:ore_diamond",
          "minecraft:ore_lapis",
          "minecraft:ore_emerald"
        ],
        [],
        [
          "minecraft:trees_plains",
          "minecraft:flower_plain",
          "minecraft:patch_grass_plain",
          "minecraft:brown_mushroom_normal",
          "minecraft:red_mushroom_normal",
          "minecraft:patch_sugar_cane"
        ],
        ["minecraft:freeze_top_layer"]
      ],
      spawners: {
        monster: [
          { type: "minecraft:spider", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:zombie", weight: 95, minCount: 4, maxCount: 4 },
          { type: "minecraft:zombie_villager", weight: 5, minCount: 1, maxCount: 1 },
          { type: "minecraft:skeleton", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:creeper", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:slime", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:enderman", weight: 10, minCount: 1, maxCount: 4 },
          { type: "minecraft:witch", weight: 5, minCount: 1, maxCount: 1 }
        ],
        creature: [
          { type: "minecraft:sheep", weight: 12, minCount: 4, maxCount: 4 },
          { type: "minecraft:pig", weight: 10, minCount: 4, maxCount: 4 },
          { type: "minecraft:chicken", weight: 10, minCount: 4, maxCount: 4 },
          { type: "minecraft:cow", weight: 8, minCount: 4, maxCount: 4 },
          { type: "minecraft:llama", weight: 5, minCount: 4, maxCount: 6 },
          { type: "minecraft:goat", weight: 5, minCount: 1, maxCount: 3 }
        ],
        ambient: [
          { type: "minecraft:bat", weight: 10, minCount: 8, maxCount: 8 }
        ],
        water_creature: [],
        water_ambient: []
      },
      creature_spawn_probability: 0.1
    }
  },

  swamp: {
    name: "Swamp",
    description: "A murky wetland biome with shallow water pools, lily pads, vines, mushrooms, and witch huts. Dark water color.",
    json: {
      has_precipitation: true,
      temperature: 0.8,
      downfall: 0.9,
      effects: {
        sky_color: 7907327,
        fog_color: 12638463,
        water_color: 6388580,
        water_fog_color: 2302743,
        grass_color_modifier: "swamp",
        mood_sound: {
          sound: "minecraft:ambient.cave",
          tick_delay: 6000,
          block_search_extent: 8,
          offset: 2.0
        }
      },
      surface_builder: "minecraft:grass",
      carvers: {
        air: ["minecraft:cave", "minecraft:canyon"]
      },
      features: [
        [],
        ["minecraft:lake_water"],
        [],
        ["minecraft:fossil"],
        ["minecraft:swamp_hut"],
        [],
        [
          "minecraft:ore_dirt",
          "minecraft:ore_gravel",
          "minecraft:ore_granite",
          "minecraft:ore_diorite",
          "minecraft:ore_andesite",
          "minecraft:ore_coal",
          "minecraft:ore_iron",
          "minecraft:ore_gold",
          "minecraft:ore_redstone",
          "minecraft:ore_diamond",
          "minecraft:ore_lapis"
        ],
        [],
        [
          "minecraft:seagrass_swamp",
          "minecraft:trees_swamp",
          "minecraft:flower_swamp",
          "minecraft:patch_grass_plain",
          "minecraft:patch_waterlily",
          "minecraft:brown_mushroom_swamp",
          "minecraft:red_mushroom_swamp",
          "minecraft:patch_sugar_cane_swamp"
        ],
        ["minecraft:freeze_top_layer"]
      ],
      spawners: {
        monster: [
          { type: "minecraft:spider", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:zombie", weight: 95, minCount: 4, maxCount: 4 },
          { type: "minecraft:zombie_villager", weight: 5, minCount: 1, maxCount: 1 },
          { type: "minecraft:skeleton", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:creeper", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:slime", weight: 100, minCount: 4, maxCount: 4 },
          { type: "minecraft:enderman", weight: 10, minCount: 1, maxCount: 4 },
          { type: "minecraft:witch", weight: 5, minCount: 1, maxCount: 1 }
        ],
        creature: [
          { type: "minecraft:sheep", weight: 12, minCount: 4, maxCount: 4 },
          { type: "minecraft:pig", weight: 10, minCount: 4, maxCount: 4 },
          { type: "minecraft:chicken", weight: 10, minCount: 4, maxCount: 4 },
          { type: "minecraft:cow", weight: 8, minCount: 4, maxCount: 4 },
          { type: "minecraft:frog", weight: 10, minCount: 2, maxCount: 5 }
        ],
        ambient: [
          { type: "minecraft:bat", weight: 10, minCount: 8, maxCount: 8 }
        ],
        water_creature: [],
        water_ambient: []
      },
      creature_spawn_probability: 0.1
    }
  }
};

/**
 * Build the complete prompt with examples
 */
export function buildBiomeGenerationPrompt(userDescription: string): string {
  let prompt = SYSTEM_PROMPT;

  // Add all example biomes
  Object.entries(EXAMPLE_BIOMES).forEach(([key, biome]) => {
    prompt += `\n\n### Example ${biome.name}:\n`;
    prompt += `Description: ${biome.description}\n\n`;
    prompt += `JSON Output:\n${JSON.stringify(biome.json, null, 2)}`;
  });

  // Add final instructions
  prompt += `\n\n## YOUR TASK:

User's biome description: "${userDescription}"

Based on this description, generate a complete, valid Minecraft biome JSON configuration.

CRITICAL REQUIREMENTS:
1. Output ONLY the JSON object - no markdown, no explanations, no code blocks
2. Ensure all required fields are present
3. Use appropriate climate values for the described biome
4. Select suitable features for vegetation/decoration
5. Include appropriate mob spawners for the biome type
6. Use realistic color values for water, sky, and fog
7. Match the exact format shown in the examples above

Generate the biome JSON now:`;

  return prompt;
}

/**
 * Alternative prompt for JSON mode (structured output)
 */
export const JSON_MODE_SYSTEM_PROMPT = `You are a Minecraft biome generator. Generate valid Minecraft 1.20+ biome JSON configurations based on user descriptions. Use the exact schema and value ranges from vanilla Minecraft biomes. Always output valid JSON matching the Minecraft biome specification.`;

/**
 * Build a concise prompt for JSON mode
 */
export function buildJsonModePrompt(userDescription: string): string {
  return `Generate a Minecraft biome for: ${userDescription}

Requirements:
- Complete biome JSON with all required fields
- Climate: temperature (-2.0 to 2.0), downfall (0.0 to 1.0), has_precipitation
- Effects: sky_color, fog_color, water_color, water_fog_color (as RGB integers)
- surface_builder: Choose appropriate type (grass, desert, stone, etc.)
- features: 10-stage array with ores (stage 6), vegetation (stage 8), freeze_top_layer (stage 9)
- spawners: monster, creature, ambient, water_creature, water_ambient arrays
- Use vanilla Minecraft feature/entity IDs (minecraft:...)

Output only valid JSON.`;
}
