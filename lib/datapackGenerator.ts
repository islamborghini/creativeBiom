import JSZip from 'jszip';
import { BiomeConfiguration, validateBiomeConfiguration } from './geminiClient';

/**
 * Datapack file structure type
 */
export interface DatapackFiles {
  [path: string]: string | Record<string, unknown>;
}

/**
 * Worldgen feature configuration
 */
export interface WorldgenFeature {
  type: string;
  config: Record<string, unknown>;
}

/**
 * Pack.mcmeta structure for Minecraft datapacks
 */
export interface PackMcmeta {
  pack: {
    pack_format: number;
    description: string;
  };
}

/**
 * Parse and validate biome response from Gemini
 * Handles various response formats and extracts valid biome data
 * @param geminiOutput - Raw output from Gemini API
 * @returns Validated BiomeConfiguration object
 * @throws Error if parsing or validation fails
 */
export function parseBiomeResponse(geminiOutput: unknown): BiomeConfiguration {
  let biomeData: unknown;

  // Handle different response formats
  if (typeof geminiOutput === 'string') {
    try {
      // Remove markdown code blocks if present
      const cleanedOutput = geminiOutput
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      biomeData = JSON.parse(cleanedOutput) as unknown;
    } catch (error) {
      throw new Error(`Failed to parse biome response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else if (typeof geminiOutput === 'object' && geminiOutput !== null) {
    biomeData = geminiOutput;
  } else {
    throw new Error('Invalid biome response format: expected string or object');
  }

  // Validate using Zod schema
  return validateBiomeConfiguration(biomeData);
}

/**
 * Generate proper Minecraft biome JSON with all required fields
 * @param biomeData - Validated biome configuration
 * @returns Formatted biome JSON object
 */
export function generateBiomeJson(biomeData: BiomeConfiguration): BiomeConfiguration {
  // Return the biome data as-is since it's already validated
  // Minecraft expects the exact structure we have
  return biomeData;
}

/**
 * Generate worldgen feature configurations for trees, plants, and structures
 * These are simplified feature configs that reference vanilla Minecraft features
 * @param biomeData - Biome configuration to extract features from
 * @returns Object containing configured and placed features
 */
export function generateWorldgenFeatures(biomeData: BiomeConfiguration): {
  configured_features: Record<string, WorldgenFeature>;
  placed_features: Record<string, Record<string, unknown>>;
} {
  const configured_features: Record<string, WorldgenFeature> = {};
  const placed_features: Record<string, Record<string, unknown>> = {};

  // Extract unique feature references from the biome
  const featureReferences = new Set<string>();

  biomeData.features.forEach(stage => {
    stage.forEach(feature => {
      // Only track custom features (ones that might need configs)
      // Vanilla features like "minecraft:ore_coal" don't need custom configs
      if (feature && !feature.includes(':ore_') && !feature.includes(':lake_')) {
        featureReferences.add(feature);
      }
    });
  });

  // For this implementation, we'll create references to vanilla features
  // In a full datapack, you would generate custom feature configurations here
  // Most features in the biome JSON already reference vanilla configured/placed features

  return {
    configured_features,
    placed_features
  };
}

/**
 * Create pack.mcmeta file for the datapack
 * This file is required at the root of every Minecraft datapack
 * @param packName - Name of the datapack
 * @param description - Description shown in the datapack menu
 * @returns pack.mcmeta object
 */
export function createPackMcmeta(packName: string, description: string): PackMcmeta {
  return {
    pack: {
      pack_format: 15, // Minecraft 1.20.x format (update as needed)
      description: description || `${packName} - AI Generated Biome Datapack`
    }
  };
}

/**
 * Create proper datapack folder structure paths
 * Returns the conventional Minecraft datapack directory structure
 * @param biomeName - Name of the biome (used for namespacing)
 * @returns Object with folder paths for different datapack components
 */
export function createFolderStructure(biomeName: string): {
  biome: string;
  configured_feature: string;
  placed_feature: string;
  dimension: string;
  dimension_type: string;
} {
  // Sanitize biome name for use in paths (lowercase, underscores only)
  const sanitizedName = biomeName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');

  // Use custom namespace to avoid conflicts with vanilla
  const namespace = 'custom';

  return {
    biome: `data/${namespace}/worldgen/biome/`,
    configured_feature: `data/${namespace}/worldgen/configured_feature/`,
    placed_feature: `data/${namespace}/worldgen/placed_feature/`,
    dimension: `data/${namespace}/dimension/`,
    dimension_type: `data/${namespace}/dimension_type/`
  };
}

/**
 * Bundle all datapack files into a downloadable ZIP archive
 * Creates a properly structured Minecraft datapack
 * @param files - Record of file paths to content (can be strings or objects)
 * @param packName - Name of the datapack
 * @param packDescription - Description for pack.mcmeta
 * @returns Promise resolving to a Blob containing the ZIP file
 */
export async function bundleDatapack(
  files: DatapackFiles,
  packName: string,
  packDescription: string
): Promise<Blob> {
  const zip = new JSZip();

  // Add pack.mcmeta at root
  const packMcmeta = createPackMcmeta(packName, packDescription);
  zip.file('pack.mcmeta', JSON.stringify(packMcmeta, null, 2));

  // Add pack icon if provided
  if (files['pack.png']) {
    zip.file('pack.png', files['pack.png'] as string);
    delete files['pack.png']; // Remove from files to process
  }

  // Add all provided files
  Object.entries(files).forEach(([path, content]) => {
    if (typeof content === 'string') {
      zip.file(path, content);
    } else {
      // Convert objects to formatted JSON
      zip.file(path, JSON.stringify(content, null, 2));
    }
  });

  // Generate the ZIP file
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9 // Maximum compression
    }
  });

  return blob;
}

/**
 * Complete datapack generation pipeline
 * Takes a biome configuration and generates a full downloadable datapack
 * @param biomeConfig - Validated biome configuration
 * @param biomeName - Name for the biome (used in file naming)
 * @param packDescription - Optional description for the datapack
 * @returns Promise resolving to a Blob containing the complete datapack ZIP
 */
export async function generateCompleteDatapack(
  biomeConfig: BiomeConfiguration,
  biomeName: string,
  packDescription?: string
): Promise<Blob> {
  // Sanitize biome name
  const sanitizedBiomeName = biomeName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');

  const packName = `${sanitizedBiomeName}_datapack`;
  const description = packDescription || `Custom ${biomeName} biome generated by AI`;

  // Create folder structure
  const folders = createFolderStructure(sanitizedBiomeName);

  // Generate biome JSON
  const biomeJson = generateBiomeJson(biomeConfig);

  // Generate worldgen features
  const { configured_features, placed_features } = generateWorldgenFeatures(biomeConfig);

  // Build files object
  const files: DatapackFiles = {};

  // Add biome file
  files[`${folders.biome}${sanitizedBiomeName}.json`] = biomeJson;

  // Add configured features
  Object.entries(configured_features).forEach(([name, feature]) => {
    files[`${folders.configured_feature}${name}.json`] = feature;
  });

  // Add placed features
  Object.entries(placed_features).forEach(([name, feature]) => {
    files[`${folders.placed_feature}${name}.json`] = feature;
  });

  // Add a README for users
  const readme = `# ${biomeName} Biome Datapack

This datapack was generated using AI to create a custom Minecraft biome.

## Installation:

1. Locate your Minecraft saves folder:
   - Windows: %appdata%\\.minecraft\\saves\\
   - Mac: ~/Library/Application Support/minecraft/saves/
   - Linux: ~/.minecraft/saves/

2. Navigate to your world folder (e.g., "My World")

3. Place this datapack ZIP file (or extracted folder) into the "datapacks" folder

4. Launch Minecraft and load your world

5. Run this command to reload datapacks:
   /reload

6. Your custom biome is now available!

## Finding Your Biome:

The biome is registered as: custom:${sanitizedBiomeName}

To teleport to this biome type (requires experimental features):
/locatebiome custom:${sanitizedBiomeName}

## Notes:

- This datapack is compatible with Minecraft 1.20+
- The biome will generate in newly explored chunks
- Existing chunks will not be affected
- You may need to enable experimental features in world settings

## Biome Details:

- Temperature: ${biomeConfig.temperature}
- Downfall: ${biomeConfig.downfall}
- Precipitation: ${biomeConfig.has_precipitation ? 'Yes' : 'No'}

Generated with AI Biome Generator
`;

  files['README.md'] = readme;

  // Bundle everything into a ZIP
  return bundleDatapack(files, packName, description);
}

/**
 * Save blob to file (browser download)
 * @param blob - Blob to download
 * @param filename - Desired filename
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper function to sanitize biome names for file paths
 * @param name - Raw biome name
 * @returns Sanitized name suitable for Minecraft resource locations
 */
export function sanitizeBiomeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Validate that a datapack structure is correct
 * @param files - Files to validate
 * @returns Boolean indicating if structure is valid
 */
export function validateDatapackStructure(files: DatapackFiles): boolean {
  // Check for pack.mcmeta
  if (!files['pack.mcmeta']) {
    console.error('Missing pack.mcmeta');
    return false;
  }

  // Check for at least one biome file
  const hasBiomeFile = Object.keys(files).some(path =>
    path.includes('/worldgen/biome/') && path.endsWith('.json')
  );

  if (!hasBiomeFile) {
    console.error('No biome files found');
    return false;
  }

  // Check that all JSON files are valid
  for (const [path, content] of Object.entries(files)) {
    if (path.endsWith('.json') && typeof content === 'object') {
      try {
        JSON.stringify(content);
      } catch (error) {
        console.error(`Invalid JSON in ${path}`);
        return false;
      }
    }
  }

  return true;
}

/**
 * Get datapack metadata from a files object
 * @param files - Datapack files
 * @returns Metadata object
 */
export function getDatapackMetadata(files: DatapackFiles): {
  biomeCount: number;
  featureCount: number;
  totalFiles: number;
  packFormat?: number;
} {
  const biomeCount = Object.keys(files).filter(path =>
    path.includes('/worldgen/biome/') && path.endsWith('.json')
  ).length;

  const featureCount = Object.keys(files).filter(path =>
    (path.includes('/worldgen/configured_feature/') ||
     path.includes('/worldgen/placed_feature/')) &&
    path.endsWith('.json')
  ).length;

  const totalFiles = Object.keys(files).length;

  let packFormat: number | undefined;
  if (files['pack.mcmeta']) {
    const mcmeta = files['pack.mcmeta'];
    if (
      typeof mcmeta === 'object' &&
      mcmeta !== null &&
      'pack' in mcmeta &&
      typeof mcmeta.pack === 'object' &&
      mcmeta.pack !== null &&
      'pack_format' in mcmeta.pack &&
      typeof mcmeta.pack.pack_format === 'number'
    ) {
      packFormat = mcmeta.pack.pack_format;
    }
  }

  return {
    biomeCount,
    featureCount,
    totalFiles,
    packFormat
  };
}
