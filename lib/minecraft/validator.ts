/**
 * Minecraft Biome Validator
 * Provides validation functions for Minecraft biome configurations
 */

import { BiomeConfiguration } from '../geminiClient';

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
  expected?: string;
}

/**
 * Known Minecraft block IDs (vanilla 1.20+)
 * This is a subset of common blocks - expand as needed
 */
const KNOWN_BLOCKS = new Set([
  'minecraft:grass_block',
  'minecraft:dirt',
  'minecraft:stone',
  'minecraft:sand',
  'minecraft:gravel',
  'minecraft:oak_log',
  'minecraft:oak_leaves',
  'minecraft:birch_log',
  'minecraft:birch_leaves',
  'minecraft:spruce_log',
  'minecraft:spruce_leaves',
  'minecraft:jungle_log',
  'minecraft:jungle_leaves',
  'minecraft:acacia_log',
  'minecraft:acacia_leaves',
  'minecraft:dark_oak_log',
  'minecraft:dark_oak_leaves',
  'minecraft:water',
  'minecraft:lava',
  'minecraft:bedrock',
  'minecraft:coal_ore',
  'minecraft:iron_ore',
  'minecraft:gold_ore',
  'minecraft:diamond_ore',
  'minecraft:emerald_ore',
  'minecraft:lapis_ore',
  'minecraft:redstone_ore',
  'minecraft:netherrack',
  'minecraft:soul_sand',
  'minecraft:soul_soil',
  'minecraft:basalt',
  'minecraft:blackstone',
  'minecraft:snow',
  'minecraft:ice',
  'minecraft:packed_ice',
  'minecraft:blue_ice',
  'minecraft:clay',
  'minecraft:terracotta',
  'minecraft:red_sand',
  'minecraft:mycelium',
  'minecraft:podzol',
  'minecraft:coarse_dirt',
  'minecraft:granite',
  'minecraft:diorite',
  'minecraft:andesite',
  'minecraft:deepslate',
  'minecraft:tuff',
  'minecraft:calcite',
  'minecraft:moss_block',
  'minecraft:rooted_dirt',
]);

/**
 * Known Minecraft entity IDs (mobs)
 */
const KNOWN_MOBS = new Set([
  // Hostile
  'minecraft:zombie',
  'minecraft:skeleton',
  'minecraft:creeper',
  'minecraft:spider',
  'minecraft:cave_spider',
  'minecraft:enderman',
  'minecraft:witch',
  'minecraft:slime',
  'minecraft:phantom',
  'minecraft:drowned',
  'minecraft:husk',
  'minecraft:stray',
  'minecraft:zombie_villager',
  'minecraft:vindicator',
  'minecraft:evoker',
  'minecraft:pillager',
  'minecraft:ravager',
  'minecraft:vex',
  'minecraft:blaze',
  'minecraft:ghast',
  'minecraft:magma_cube',
  'minecraft:wither_skeleton',
  'minecraft:piglin',
  'minecraft:piglin_brute',
  'minecraft:hoglin',
  'minecraft:zoglin',
  'minecraft:guardian',
  'minecraft:elder_guardian',
  'minecraft:shulker',
  'minecraft:silverfish',
  'minecraft:endermite',

  // Passive
  'minecraft:pig',
  'minecraft:cow',
  'minecraft:sheep',
  'minecraft:chicken',
  'minecraft:rabbit',
  'minecraft:horse',
  'minecraft:donkey',
  'minecraft:mule',
  'minecraft:llama',
  'minecraft:cat',
  'minecraft:wolf',
  'minecraft:ocelot',
  'minecraft:parrot',
  'minecraft:fox',
  'minecraft:panda',
  'minecraft:polar_bear',
  'minecraft:turtle',
  'minecraft:goat',
  'minecraft:axolotl',
  'minecraft:frog',
  'minecraft:villager',
  'minecraft:iron_golem',
  'minecraft:snow_golem',

  // Aquatic
  'minecraft:squid',
  'minecraft:glow_squid',
  'minecraft:dolphin',
  'minecraft:cod',
  'minecraft:salmon',
  'minecraft:tropical_fish',
  'minecraft:pufferfish',

  // Ambient
  'minecraft:bat',
  'minecraft:glow_squid',
]);

/**
 * Known Minecraft surface builders
 */
const KNOWN_SURFACE_BUILDERS = new Set([
  'minecraft:grass',
  'minecraft:desert',
  'minecraft:stone',
  'minecraft:badlands',
  'minecraft:mycelium',
  'minecraft:nether',
  'minecraft:soul_sand_valley',
  'minecraft:basalt_deltas',
  'minecraft:warped_forest',
  'minecraft:crimson_forest',
  'minecraft:end',
  'minecraft:swamp',
  'minecraft:mountain',
  'minecraft:frozen_ocean',
]);

/**
 * Validate complete biome structure
 * Checks all required fields exist and have valid types
 * @param biomeJson - Biome configuration to validate
 * @returns ValidationResult with any errors found
 */
export function validateBiomeStructure(biomeJson: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  // Type check
  if (typeof biomeJson !== 'object' || biomeJson === null) {
    errors.push({
      field: 'root',
      message: 'Biome must be an object',
      value: typeof biomeJson,
    });
    return { valid: false, errors };
  }

  const biome = biomeJson as Record<string, unknown>;

  // Check required fields
  const requiredFields = [
    'has_precipitation',
    'temperature',
    'downfall',
    'effects',
    'surface_builder',
    'features',
    'spawners',
  ];

  for (const field of requiredFields) {
    if (!(field in biome)) {
      errors.push({
        field,
        message: `Required field '${field}' is missing`,
      });
    }
  }

  // Validate has_precipitation
  if ('has_precipitation' in biome && typeof biome.has_precipitation !== 'boolean') {
    errors.push({
      field: 'has_precipitation',
      message: 'has_precipitation must be a boolean',
      value: biome.has_precipitation,
      expected: 'boolean',
    });
  }

  // Validate temperature
  if ('temperature' in biome) {
    const tempResult = validateTemperature(biome.temperature);
    if (!tempResult.valid) {
      errors.push(...tempResult.errors);
    }
  }

  // Validate downfall
  if ('downfall' in biome && typeof biome.downfall === 'number') {
    if (biome.downfall < 0.0 || biome.downfall > 1.0) {
      errors.push({
        field: 'downfall',
        message: 'downfall must be between 0.0 and 1.0',
        value: biome.downfall,
        expected: '0.0 to 1.0',
      });
    }
  } else if ('downfall' in biome) {
    errors.push({
      field: 'downfall',
      message: 'downfall must be a number',
      value: biome.downfall,
      expected: 'number',
    });
  }

  // Validate effects
  if ('effects' in biome) {
    const effectsResult = validateEffects(biome.effects);
    if (!effectsResult.valid) {
      errors.push(...effectsResult.errors);
    }
  }

  // Validate surface_builder
  if ('surface_builder' in biome && typeof biome.surface_builder === 'string') {
    if (!KNOWN_SURFACE_BUILDERS.has(biome.surface_builder)) {
      errors.push({
        field: 'surface_builder',
        message: 'Unknown surface builder (may be valid but not in common list)',
        value: biome.surface_builder,
        expected: `One of: ${Array.from(KNOWN_SURFACE_BUILDERS).join(', ')}`,
      });
    }
  } else if ('surface_builder' in biome) {
    errors.push({
      field: 'surface_builder',
      message: 'surface_builder must be a string',
      value: biome.surface_builder,
      expected: 'string',
    });
  }

  // Validate features
  if ('features' in biome) {
    const featuresResult = validateFeatures(biome.features);
    if (!featuresResult.valid) {
      errors.push(...featuresResult.errors);
    }
  }

  // Validate spawners
  if ('spawners' in biome) {
    const spawnersResult = validateMobSpawns(biome.spawners);
    if (!spawnersResult.valid) {
      errors.push(...spawnersResult.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate effects object
 * @param effects - Effects configuration
 * @returns ValidationResult
 */
function validateEffects(effects: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof effects !== 'object' || effects === null) {
    errors.push({
      field: 'effects',
      message: 'effects must be an object',
      value: typeof effects,
    });
    return { valid: false, errors };
  }

  const effectsObj = effects as Record<string, unknown>;

  // Required color fields (as integers)
  const requiredColors = ['sky_color', 'fog_color', 'water_color', 'water_fog_color'];

  for (const colorField of requiredColors) {
    if (!(colorField in effectsObj)) {
      errors.push({
        field: `effects.${colorField}`,
        message: `Required color field '${colorField}' is missing`,
      });
    } else if (typeof effectsObj[colorField] !== 'number') {
      errors.push({
        field: `effects.${colorField}`,
        message: `${colorField} must be a number (packed RGB integer)`,
        value: effectsObj[colorField],
        expected: 'number (0-16777215)',
      });
    } else {
      const colorValue = effectsObj[colorField] as number;
      if (colorValue < 0 || colorValue > 16777215 || !Number.isInteger(colorValue)) {
        errors.push({
          field: `effects.${colorField}`,
          message: `${colorField} must be an integer between 0 and 16777215`,
          value: colorValue,
          expected: '0 to 16777215',
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate features array
 * @param features - Features array (should be array of arrays)
 * @returns ValidationResult
 */
function validateFeatures(features: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!Array.isArray(features)) {
    errors.push({
      field: 'features',
      message: 'features must be an array',
      value: typeof features,
      expected: 'array of arrays',
    });
    return { valid: false, errors };
  }

  // Should have 10 stages (indices 0-9)
  if (features.length !== 10) {
    errors.push({
      field: 'features',
      message: 'features array should have exactly 10 stages (0-9)',
      value: features.length,
      expected: '10',
    });
  }

  // Each stage should be an array of strings
  features.forEach((stage, index) => {
    if (!Array.isArray(stage)) {
      errors.push({
        field: `features[${index}]`,
        message: `Feature stage ${index} must be an array`,
        value: typeof stage,
        expected: 'array',
      });
    } else {
      stage.forEach((feature, featureIndex) => {
        if (typeof feature !== 'string') {
          errors.push({
            field: `features[${index}][${featureIndex}]`,
            message: `Feature must be a string (resource location)`,
            value: typeof feature,
            expected: 'string',
          });
        } else if (!feature.includes(':')) {
          errors.push({
            field: `features[${index}][${featureIndex}]`,
            message: `Feature should be a namespaced ID (e.g., "minecraft:ore_coal")`,
            value: feature,
            expected: 'namespace:id format',
          });
        }
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate hex color format
 * Accepts #RRGGBB format
 * @param color - Color string to validate
 * @returns ValidationResult
 */
export function validateColorHex(color: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof color !== 'string') {
    errors.push({
      field: 'color',
      message: 'Color must be a string',
      value: typeof color,
      expected: '#RRGGBB',
    });
    return { valid: false, errors };
  }

  const hexPattern = /^#[0-9A-Fa-f]{6}$/;

  if (!hexPattern.test(color)) {
    errors.push({
      field: 'color',
      message: 'Color must be in #RRGGBB format (e.g., #FF5733)',
      value: color,
      expected: '#RRGGBB',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate temperature value
 * Minecraft temperature range: -2.0 to 2.0
 * @param temp - Temperature value to validate
 * @returns ValidationResult
 */
export function validateTemperature(temp: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof temp !== 'number') {
    errors.push({
      field: 'temperature',
      message: 'Temperature must be a number',
      value: typeof temp,
      expected: 'number (-2.0 to 2.0)',
    });
    return { valid: false, errors };
  }

  if (temp < -2.0 || temp > 2.0) {
    errors.push({
      field: 'temperature',
      message: 'Temperature must be between -2.0 and 2.0',
      value: temp,
      expected: '-2.0 to 2.0',
    });
  }

  // Provide helpful context based on temperature value
  let context = '';
  if (temp < 0.15) {
    context = ' (produces snow)';
  } else if (temp >= 0.15 && temp < 0.95) {
    context = ' (produces rain, temperate)';
  } else if (temp >= 0.95) {
    context = ' (hot, desert-like)';
  }

  if (context && errors.length === 0) {
    // Valid temperature, just add helpful context in a non-error way
    // We won't add this to errors since it's valid
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate block ID
 * Checks if block ID follows Minecraft namespaced format and is in known blocks
 * @param blockId - Block ID to validate
 * @returns ValidationResult
 */
export function validateBlockId(blockId: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof blockId !== 'string') {
    errors.push({
      field: 'blockId',
      message: 'Block ID must be a string',
      value: typeof blockId,
      expected: 'string (e.g., "minecraft:stone")',
    });
    return { valid: false, errors };
  }

  // Check namespaced format
  if (!blockId.includes(':')) {
    errors.push({
      field: 'blockId',
      message: 'Block ID must be namespaced (e.g., "minecraft:stone")',
      value: blockId,
      expected: 'namespace:id format',
    });
    return { valid: false, errors };
  }

  // Check if in known blocks (warning, not error)
  if (!KNOWN_BLOCKS.has(blockId) && blockId.startsWith('minecraft:')) {
    errors.push({
      field: 'blockId',
      message: 'Block ID not in common blocks list (may still be valid)',
      value: blockId,
      expected: `One of: ${Array.from(KNOWN_BLOCKS).slice(0, 10).join(', ')}...`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate mob spawns configuration
 * Checks spawner categories and mob entries
 * @param spawns - Spawners object
 * @returns ValidationResult
 */
export function validateMobSpawns(spawns: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof spawns !== 'object' || spawns === null) {
    errors.push({
      field: 'spawners',
      message: 'Spawners must be an object',
      value: typeof spawns,
    });
    return { valid: false, errors };
  }

  const spawnersObj = spawns as Record<string, unknown>;

  // Required spawner categories
  const requiredCategories = [
    'monster',
    'creature',
    'ambient',
    'water_creature',
    'water_ambient',
  ];

  for (const category of requiredCategories) {
    if (!(category in spawnersObj)) {
      errors.push({
        field: `spawners.${category}`,
        message: `Required spawner category '${category}' is missing`,
      });
      continue;
    }

    if (!Array.isArray(spawnersObj[category])) {
      errors.push({
        field: `spawners.${category}`,
        message: `Spawner category '${category}' must be an array`,
        value: typeof spawnersObj[category],
        expected: 'array',
      });
      continue;
    }

    // Validate each spawn entry
    const categoryArray = spawnersObj[category] as unknown[];
    categoryArray.forEach((entry, index) => {
      const entryErrors = validateSpawnEntry(entry, `spawners.${category}[${index}]`);
      errors.push(...entryErrors);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate individual spawn entry
 * @param entry - Spawn entry object
 * @param path - Field path for error reporting
 * @returns ValidationError array
 */
function validateSpawnEntry(entry: unknown, path: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof entry !== 'object' || entry === null) {
    errors.push({
      field: path,
      message: 'Spawn entry must be an object',
      value: typeof entry,
    });
    return errors;
  }

  const spawnEntry = entry as Record<string, unknown>;

  // Required fields
  const requiredFields = ['type', 'weight', 'minCount', 'maxCount'];

  for (const field of requiredFields) {
    if (!(field in spawnEntry)) {
      errors.push({
        field: `${path}.${field}`,
        message: `Required field '${field}' is missing in spawn entry`,
      });
    }
  }

  // Validate type (mob ID)
  if ('type' in spawnEntry) {
    if (typeof spawnEntry.type !== 'string') {
      errors.push({
        field: `${path}.type`,
        message: 'Mob type must be a string',
        value: typeof spawnEntry.type,
        expected: 'string (e.g., "minecraft:zombie")',
      });
    } else {
      if (!spawnEntry.type.includes(':')) {
        errors.push({
          field: `${path}.type`,
          message: 'Mob type must be namespaced',
          value: spawnEntry.type,
          expected: 'namespace:id format',
        });
      } else if (!KNOWN_MOBS.has(spawnEntry.type)) {
        errors.push({
          field: `${path}.type`,
          message: 'Mob type not in known mobs list (may still be valid)',
          value: spawnEntry.type,
          expected: `One of: ${Array.from(KNOWN_MOBS).slice(0, 10).join(', ')}...`,
        });
      }
    }
  }

  // Validate weight
  if ('weight' in spawnEntry) {
    if (typeof spawnEntry.weight !== 'number' || !Number.isInteger(spawnEntry.weight)) {
      errors.push({
        field: `${path}.weight`,
        message: 'Weight must be an integer',
        value: spawnEntry.weight,
        expected: 'integer (typically 1-100)',
      });
    } else if (spawnEntry.weight < 1 || spawnEntry.weight > 1000) {
      errors.push({
        field: `${path}.weight`,
        message: 'Weight should be between 1 and 1000 (typically 1-100)',
        value: spawnEntry.weight,
        expected: '1 to 1000',
      });
    }
  }

  // Validate minCount
  if ('minCount' in spawnEntry) {
    if (typeof spawnEntry.minCount !== 'number' || !Number.isInteger(spawnEntry.minCount)) {
      errors.push({
        field: `${path}.minCount`,
        message: 'minCount must be an integer',
        value: spawnEntry.minCount,
        expected: 'integer (1-10)',
      });
    } else if (spawnEntry.minCount < 1 || spawnEntry.minCount > 10) {
      errors.push({
        field: `${path}.minCount`,
        message: 'minCount should be between 1 and 10',
        value: spawnEntry.minCount,
        expected: '1 to 10',
      });
    }
  }

  // Validate maxCount
  if ('maxCount' in spawnEntry) {
    if (typeof spawnEntry.maxCount !== 'number' || !Number.isInteger(spawnEntry.maxCount)) {
      errors.push({
        field: `${path}.maxCount`,
        message: 'maxCount must be an integer',
        value: spawnEntry.maxCount,
        expected: 'integer (1-10)',
      });
    } else if (spawnEntry.maxCount < 1 || spawnEntry.maxCount > 10) {
      errors.push({
        field: `${path}.maxCount`,
        message: 'maxCount should be between 1 and 10',
        value: spawnEntry.maxCount,
        expected: '1 to 10',
      });
    }
  }

  // Validate minCount <= maxCount
  if (
    'minCount' in spawnEntry &&
    'maxCount' in spawnEntry &&
    typeof spawnEntry.minCount === 'number' &&
    typeof spawnEntry.maxCount === 'number' &&
    spawnEntry.minCount > spawnEntry.maxCount
  ) {
    errors.push({
      field: `${path}.minCount`,
      message: 'minCount must be less than or equal to maxCount',
      value: `min: ${spawnEntry.minCount}, max: ${spawnEntry.maxCount}`,
    });
  }

  return errors;
}

/**
 * Format validation errors as a readable string
 * @param errors - Array of validation errors
 * @returns Formatted error message
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return 'No errors';
  }

  return errors
    .map((error, index) => {
      let message = `${index + 1}. ${error.field}: ${error.message}`;
      if (error.value !== undefined) {
        message += ` (got: ${JSON.stringify(error.value)})`;
      }
      if (error.expected) {
        message += ` (expected: ${error.expected})`;
      }
      return message;
    })
    .join('\n');
}

/**
 * Validate complete biome configuration and return detailed report
 * @param biome - Biome configuration (from geminiClient)
 * @returns ValidationResult with comprehensive error details
 */
export function validateBiomeConfiguration(biome: BiomeConfiguration): ValidationResult {
  return validateBiomeStructure(biome);
}
