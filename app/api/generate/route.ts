import { NextRequest, NextResponse } from 'next/server';
import { generateWithGemini } from '@/lib/geminiClient';
import { BIOME_GENERATION_SYSTEM_PROMPT, buildBiomePrompt } from '@/lib/prompts';
import { parseAIBiomeResponse } from '@/lib/minecraft/biomeSchema';
import {
  generateDatapack,
  sanitizeBiomeName,
  generateBiomeNameFromDescription,
} from '@/lib/datapackGenerator';

/**
 * POST /api/generate
 * Generates a custom Minecraft biome datapack from a natural language description
 *
 * Request body:
 * - description: string (required) - Natural language description of the biome
 * - biomeName: string (optional) - Custom name for the biome
 *
 * Returns: Blob (application/zip) - Complete Minecraft datapack
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { description, biomeName: customBiomeName } = body;

    // Validate description
    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        {
          error: 'Description is required',
          code: 'INVALID_REQUEST',
          message: 'Please provide a biome description',
        },
        { status: 400 }
      );
    }

    if (description.length < 10) {
      return NextResponse.json(
        {
          error: 'Description too short',
          code: 'INVALID_REQUEST',
          message: 'Please provide a more detailed description (at least 10 characters)',
        },
        { status: 400 }
      );
    }

    if (description.length > 1000) {
      return NextResponse.json(
        {
          error: 'Description too long',
          code: 'INVALID_REQUEST',
          message: 'Description must be less than 1000 characters',
        },
        { status: 400 }
      );
    }

    // Generate biome name
    const biomeName = customBiomeName
      ? sanitizeBiomeName(customBiomeName)
      : generateBiomeNameFromDescription(description);

    if (!biomeName) {
      return NextResponse.json(
        {
          error: 'Invalid biome name',
          code: 'INVALID_REQUEST',
          message: 'Biome name must contain at least one alphanumeric character',
        },
        { status: 400 }
      );
    }

    // Generate biome configuration using AI
    console.log('Generating biome with AI:', { description, biomeName });

    const prompt = buildBiomePrompt(description, biomeName);
    let aiResponse: string;

    try {
      aiResponse = await generateWithGemini(BIOME_GENERATION_SYSTEM_PROMPT, prompt);
    } catch (error) {
      console.error('Gemini API error:', error);
      return NextResponse.json(
        {
          error: 'AI generation failed',
          code: 'AI_ERROR',
          message: 'Failed to generate biome configuration. Please try again.',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error',
          }),
        },
        { status: 500 }
      );
    }

    // Extract JSON from AI response (handle markdown code blocks)
    let jsonString = aiResponse.trim();

    // Remove markdown code blocks if present
    if (jsonString.startsWith('```')) {
      const match = jsonString.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (match) {
        jsonString = match[1].trim();
      }
    }

    // Parse and validate the AI response
    const parseResult = parseAIBiomeResponse(jsonString);

    if (!parseResult.success || !parseResult.biome) {
      console.error('AI generated invalid biome:', parseResult.error);
      return NextResponse.json(
        {
          error: 'Invalid biome configuration',
          code: 'VALIDATION_ERROR',
          message: 'The AI generated an invalid biome configuration. Please try again with a different description.',
          ...(process.env.NODE_ENV === 'development' && {
            details: parseResult.error,
            rawResponse: aiResponse.substring(0, 500),
          }),
        },
        { status: 500 }
      );
    }

    const biomeConfig = parseResult.biome;

    // Generate the datapack
    console.log('Creating datapack:', { biomeName });

    let datapackBlob: Blob;

    try {
      datapackBlob = await generateDatapack({
        namespace: 'custom',
        biomeName,
        biomeConfig,
        packDescription: `AI Generated Biome: ${biomeName}`,
      });
    } catch (error) {
      console.error('Datapack generation error:', error);
      return NextResponse.json(
        {
          error: 'Datapack creation failed',
          code: 'GENERATION_ERROR',
          message: 'Failed to create the datapack file. Please try again.',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : 'Unknown error',
          }),
        },
        { status: 500 }
      );
    }

    // Return the datapack as a downloadable file
    console.log('Datapack generated successfully:', {
      biomeName,
      size: datapackBlob.size,
    });

    return new Response(datapackBlob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${biomeName}_datapack.zip"`,
        'Content-Length': datapackBlob.size.toString(),
      },
    });
  } catch (error) {
    console.error('Unexpected error in biome generation:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again.',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },
      { status: 500 }
    );
  }
}
