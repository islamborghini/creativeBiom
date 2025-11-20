import { NextRequest, NextResponse } from 'next/server';
import { generateBiomeFromDescription } from '@/lib/geminiClient';
import {
  parseBiomeResponse,
  generateCompleteDatapack,
  sanitizeBiomeName,
} from '@/lib/datapackGenerator';

/**
 * Rate limiting state (in-memory for simplicity)
 * In production, use Redis or a proper rate limiting service
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Rate limit: 10 requests per minute per IP
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

/**
 * Check if request should be rate limited
 * @param identifier - IP address or user identifier
 * @returns true if rate limit exceeded
 */
function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  // Increment counter
  entry.count++;
  return false;
}

/**
 * Clean up expired rate limit entries (called periodically)
 */
function cleanupRateLimitMap(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Clean up every 5 minutes
setInterval(cleanupRateLimitMap, 5 * 60 * 1000);

/**
 * Request body interface
 */
interface GenerateRequest {
  description: string;
  biomeName?: string;
}

/**
 * Error response interface
 */
interface GenerateErrorResponse {
  success: false;
  error: string;
  code: string;
  message: string;
  details?: string;
}

/**
 * POST /api/generate
 * Generates a custom Minecraft biome datapack from a natural language description
 *
 * Request body:
 * - description: string (required) - Natural language description of the biome
 * - biomeName: string (optional) - Custom name for the biome
 *
 * Success Response:
 * - Returns blob (application/zip) with the datapack
 * - Headers include metadata about the generated biome
 *
 * Error Response:
 * - JSON with error details
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // Check rate limit
    if (isRateLimited(clientIP)) {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please wait a minute before trying again.',
      };

      return NextResponse.json(errorResponse, {
        status: 429,
        headers: {
          'Retry-After': '60',
        },
      });
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'Invalid JSON',
        code: 'INVALID_REQUEST',
        message: 'Request body must be valid JSON',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Type guard for request body
    if (typeof body !== 'object' || body === null) {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'Invalid request body',
        code: 'INVALID_REQUEST',
        message: 'Request body must be an object',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { description, biomeName: customBiomeName } = body as GenerateRequest;

    // Validate description
    if (!description || typeof description !== 'string') {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'Description is required',
        code: 'INVALID_REQUEST',
        message: 'Please provide a biome description as a string',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (description.trim().length < 10) {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'Description too short',
        code: 'INVALID_REQUEST',
        message: 'Please provide a more detailed description (at least 10 characters)',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    if (description.length > 1000) {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'Description too long',
        code: 'INVALID_REQUEST',
        message: 'Description must be less than 1000 characters',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate custom biome name if provided
    if (customBiomeName !== undefined && typeof customBiomeName !== 'string') {
      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'Invalid biome name',
        code: 'INVALID_REQUEST',
        message: 'Biome name must be a string',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Generate or sanitize biome name
    let biomeName: string;
    if (customBiomeName) {
      biomeName = sanitizeBiomeName(customBiomeName);
      if (!biomeName) {
        const errorResponse: GenerateErrorResponse = {
          success: false,
          error: 'Invalid biome name',
          code: 'INVALID_REQUEST',
          message: 'Biome name must contain at least one alphanumeric character',
        };
        return NextResponse.json(errorResponse, { status: 400 });
      }
    } else {
      // Generate from description
      biomeName = sanitizeBiomeName(description.split(' ').slice(0, 3).join('_'));
      if (!biomeName) {
        biomeName = 'custom_biome';
      }
    }

    console.log('[API] Generating biome:', { description, biomeName, clientIP });

    // Generate biome configuration using Gemini AI
    let biomeConfig;
    try {
      biomeConfig = await generateBiomeFromDescription(description);
      console.log('[API] Biome configuration generated successfully');
    } catch (error) {
      console.error('[API] Gemini API error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isRateLimitError = errorMessage.toLowerCase().includes('rate limit') ||
                               errorMessage.toLowerCase().includes('quota') ||
                               errorMessage.toLowerCase().includes('429');

      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'AI generation failed',
        code: isRateLimitError ? 'AI_RATE_LIMIT' : 'AI_ERROR',
        message: isRateLimitError
          ? 'AI service rate limit reached. Please try again in a moment.'
          : 'Failed to generate biome configuration. Please try again with a different description.',
        ...(process.env.NODE_ENV === 'development' && {
          details: errorMessage,
        }),
      };

      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Parse and validate the response (already validated by Zod in generateBiomeFromDescription)
    let validatedBiome;
    try {
      validatedBiome = parseBiomeResponse(biomeConfig);
      console.log('[API] Biome validated successfully');
    } catch (error) {
      console.error('[API] Validation error:', error);

      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        message: 'The generated biome configuration is invalid. Please try again.',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
      };

      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Generate complete datapack
    let datapackBlob: Blob;
    try {
      datapackBlob = await generateCompleteDatapack(
        validatedBiome,
        biomeName,
        `AI Generated ${biomeName} biome - ${description.substring(0, 100)}`
      );
      console.log('[API] Datapack generated:', {
        biomeName,
        size: datapackBlob.size,
        sizeKB: Math.round(datapackBlob.size / 1024),
      });
    } catch (error) {
      console.error('[API] Datapack generation error:', error);

      const errorResponse: GenerateErrorResponse = {
        success: false,
        error: 'Datapack creation failed',
        code: 'GENERATION_ERROR',
        message: 'Failed to create the datapack ZIP file. Please try again.',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
      };

      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Create preview data for client
    const preview = {
      temperature: validatedBiome.temperature,
      downfall: validatedBiome.downfall,
      has_precipitation: validatedBiome.has_precipitation,
      sky_color: validatedBiome.effects.sky_color,
      water_color: validatedBiome.effects.water_color,
    };

    console.log('[API] Success! Returning datapack to client');

    // Return the datapack as a downloadable file with metadata in headers
    return new Response(datapackBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${biomeName}_datapack.zip"`,
        'Content-Length': datapackBlob.size.toString(),
        // Custom headers with preview data (client can read these)
        'X-Biome-Name': biomeName,
        'X-Biome-Temperature': validatedBiome.temperature.toString(),
        'X-Biome-Downfall': validatedBiome.downfall.toString(),
        'X-Biome-Preview': JSON.stringify(preview),
      },
    });
  } catch (error) {
    console.error('[API] Unexpected error:', error);

    const errorResponse: GenerateErrorResponse = {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again.',
      ...(process.env.NODE_ENV === 'development' && {
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * GET /api/generate
 * Returns API information
 */
export async function GET(): Promise<Response> {
  return NextResponse.json({
    name: 'Minecraft Biome Generator API',
    version: '1.0.0',
    endpoints: {
      POST: {
        description: 'Generate a custom Minecraft biome datapack',
        body: {
          description: 'string (required, 10-1000 chars)',
          biomeName: 'string (optional)',
        },
        returns: 'application/zip (datapack file)',
      },
    },
    rateLimit: {
      requests: RATE_LIMIT_MAX,
      window: `${RATE_LIMIT_WINDOW_MS / 1000} seconds`,
    },
  });
}
