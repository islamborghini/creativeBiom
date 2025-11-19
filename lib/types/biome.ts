// Minecraft Biome Type Definitions

export interface BiomeConfig {
  temperature: number; // 0.0 to 2.0
  downfall: number; // 0.0 to 1.0
  has_precipitation: boolean;
  attributes?: {
    "minecraft:visual/sky_color"?: string;
    "minecraft:visual/water_fog_color"?: string;
    "minecraft:audio/background_music"?: {
      default: {
        max_delay: number;
        min_delay: number;
        sound: string;
      };
    };
    "minecraft:gameplay/snow_golem_melts"?: boolean;
  };
  carvers: string[];
  effects: {
    water_color?: string;
    water_fog_color?: string;
    fog_color?: string;
    sky_color?: string;
    foliage_color?: string;
    grass_color?: string;
    grass_color_modifier?: string;
    dry_foliage_color?: string;
    mood_sound?: {
      sound: string;
      tick_delay: number;
      block_search_extent: number;
      offset: number;
    };
    music?: {
      sound: string;
      min_delay: number;
      max_delay: number;
      replace_current_music: boolean;
    };
    particle?: {
      options: {
        type: string;
      };
      probability: number;
    };
  };
  features: string[][];
  spawn_costs: Record<string, unknown>;
  spawners: {
    ambient: MobSpawn[];
    axolotls: MobSpawn[];
    creature: MobSpawn[];
    misc: MobSpawn[];
    monster: MobSpawn[];
    underground_water_creature: MobSpawn[];
    water_ambient: MobSpawn[];
    water_creature: MobSpawn[];
  };
}

export interface MobSpawn {
  type: string;
  maxCount: number;
  minCount: number;
  weight: number;
}

export interface ConfiguredFeature {
  type: string;
  config: Record<string, unknown>;
}

export interface PlacedFeature {
  feature: string;
  placement: PlacementModifier[];
}

export interface PlacementModifier {
  type: string;
  [key: string]: unknown;
}

export interface PackMeta {
  pack: {
    pack_format: number;
    description: string;
  };
}

export interface GeneratedBiome {
  namespace: string;
  biomeName: string;
  biome: BiomeConfig;
  features: {
    configured: Record<string, ConfiguredFeature>;
    placed: Record<string, PlacedFeature>;
  };
  packMeta: PackMeta;
}

export interface BiomeGenerationRequest {
  description: string;
  biomeName?: string;
}

export interface BiomeGenerationResponse {
  success: boolean;
  biome?: GeneratedBiome;
  downloadUrl?: string;
  error?: string;
}
