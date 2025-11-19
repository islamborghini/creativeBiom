'use client';

import { BiomeConfig } from '@/lib/types/biome';

interface BiomePreviewProps {
  biome: BiomeConfig | null;
}

export default function BiomePreview({ biome }: BiomePreviewProps) {
  if (!biome) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <p className="text-gray-400 text-center">
          Generate a biome to see the preview
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Biome Preview</h3>

      <div className="space-y-4">
        <div>
          <span className="text-gray-400">Temperature:</span>
          <span className="text-white ml-2">{biome.temperature}</span>
        </div>

        <div>
          <span className="text-gray-400">Downfall:</span>
          <span className="text-white ml-2">{biome.downfall}</span>
        </div>

        <div>
          <span className="text-gray-400">Precipitation:</span>
          <span className="text-white ml-2">
            {biome.has_precipitation ? 'Yes' : 'No'}
          </span>
        </div>

        {biome.effects.water_color && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Water Color:</span>
            <div
              className="w-8 h-8 rounded border border-gray-600"
              style={{ backgroundColor: biome.effects.water_color }}
            />
            <span className="text-white">{biome.effects.water_color}</span>
          </div>
        )}

        {biome.effects.grass_color && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Grass Color:</span>
            <div
              className="w-8 h-8 rounded border border-gray-600"
              style={{ backgroundColor: biome.effects.grass_color }}
            />
            <span className="text-white">{biome.effects.grass_color}</span>
          </div>
        )}
      </div>
    </div>
  );
}
