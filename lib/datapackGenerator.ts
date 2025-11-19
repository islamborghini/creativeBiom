import JSZip from 'jszip';
import { BiomeConfig, PackMeta } from './types/biome';

export interface DatapackOptions {
  namespace: string;
  biomeName: string;
  biomeConfig: BiomeConfig;
  packDescription?: string;
}

export async function generateDatapack(options: DatapackOptions): Promise<Blob> {
  const { namespace, biomeName, biomeConfig, packDescription } = options;

  const zip = new JSZip();

  // Create pack.mcmeta
  const packMeta: PackMeta = {
    pack: {
      pack_format: 48, // Minecraft 1.21
      description: packDescription || `AI Generated Biome: ${biomeName}`,
    },
  };

  zip.file('pack.mcmeta', JSON.stringify(packMeta, null, 2));

  // Create biome JSON file
  const biomePath = `data/${namespace}/worldgen/biome/${biomeName}.json`;
  zip.file(biomePath, JSON.stringify(biomeConfig, null, 2));

  // Generate the zip file
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}

export function sanitizeBiomeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
}

export function generateBiomeNameFromDescription(description: string): string {
  // Take first few words and sanitize
  const words = description
    .split(' ')
    .slice(0, 3)
    .join('_');

  return sanitizeBiomeName(words);
}
