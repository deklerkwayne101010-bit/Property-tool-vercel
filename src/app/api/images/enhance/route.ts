import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { withAuth } from '@/lib/auth-middleware';

const hf = new HfInference(process.env.HF_API_KEY);

async function handler(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const action = formData.get('action') as string; // 'upscale' or 'remove-bg'

    if (!imageFile || !action) {
      return NextResponse.json(
        { error: 'Image file and action are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert file to blob for Hugging Face API
    const blob = new Blob([await imageFile.arrayBuffer()], { type: imageFile.type });

    let result;

    if (action === 'upscale') {
      // Use a model for image upscaling
      result = await hf.imageToImage({
        model: 'timbrooks/instruct-pix2pix',
        inputs: blob,
        parameters: {
          prompt: 'high resolution, detailed, sharp, 4k, professional real estate photo',
          strength: 0.8
        }
      });
    } else if (action === 'remove-bg') {
      // Use background removal model
      result = await hf.imageToImage({
        model: 'briaai/BRIA-2.2-Background-Remove',
        inputs: blob
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "upscale" or "remove-bg"' },
        { status: 400 }
      );
    }

    // Convert result blob to base64 for response
    const resultArrayBuffer = await result.arrayBuffer();
    const resultBuffer = Buffer.from(resultArrayBuffer);
    const base64Image = resultBuffer.toString('base64');

    return NextResponse.json({
      enhancedImage: `data:image/png;base64,${base64Image}`,
      action,
      originalSize: imageFile.size,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Image enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance image' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);