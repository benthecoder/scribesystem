import { NextResponse } from 'next/server';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, correction } = await req.json();

    if (!text || !correction) {
      return NextResponse.json(
        { error: 'Text and correction are required' },
        { status: 400 }
      );
    }

    const stream = (await cerebras.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a precise text editor that makes exact replacements. You must only apply the specific correction provided while preserving all other text exactly as is. Do not add any explanatory text or prefixes like "Here is the corrected text:" - return only the modified text.',
        },
        {
          role: 'user',
          content: `Original text: "${text}"\nReplace: "${correction.text}" with: "${correction.suggestion}"`,
        },
      ],
      model: 'llama-3.3-70b',
      stream: false,
      max_completion_tokens: 1024,
      temperature: 0.1,
      top_p: 1,
    })) as {
      choices: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const rewrittenText = stream.choices[0]?.message?.content;

    if (!rewrittenText) {
      throw new Error('Failed to generate rewritten text');
    }

    return NextResponse.json({ rewrittenText });
  } catch (error) {
    console.error('Text rewrite error:', error);
    return NextResponse.json(
      { error: 'Failed to rewrite text' },
      { status: 500 }
    );
  }
}
