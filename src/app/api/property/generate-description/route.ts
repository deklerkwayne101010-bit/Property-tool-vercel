import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { withAuth } from '@/lib/auth-middleware';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function handler(request: NextRequest) {
  try {
    const { propertyData, tone, platform, keywords, length } = await request.json();

    if (!propertyData || !tone || !platform) {
      return NextResponse.json(
        { error: 'Property data, tone, and platform are required' },
        { status: 400 }
      );
    }

    // Build property description from data
    const propertyDetails = `
      Property: ${propertyData.title || 'Beautiful Property'}
      Bedrooms: ${propertyData.bedrooms}
      Bathrooms: ${propertyData.bathrooms}
      Square Footage: ${propertyData.squareFootage}
      Location: ${propertyData.location?.address}, ${propertyData.location?.city}, ${propertyData.location?.state}
      Amenities: ${propertyData.amenities?.join(', ') || 'Not specified'}
      Unique Features: ${propertyData.uniqueFeatures?.join(', ') || 'Not specified'}
    `;

    const keywordText = keywords && keywords.length > 0 ? `Include these keywords: ${keywords.join(', ')}` : '';
    const lengthText = length ? `Keep the description around ${length} words.` : '';

    const prompt = `Generate a ${tone} property description for ${platform} platform.

${propertyDetails}

${keywordText}
${lengthText}

Make it SEO-friendly, engaging, and optimized for real estate marketing. Focus on the unique selling points and create an emotional connection with potential buyers.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional real estate copywriter specializing in creating compelling property descriptions for various platforms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const description = completion.choices[0]?.message?.content?.trim();

    if (!description) {
      return NextResponse.json(
        { error: 'Failed to generate description' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      description,
      wordCount: description.split(' ').length,
      platform,
      tone
    });

  } catch (error) {
    console.error('Property description generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate property description' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);