import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { CorrectionType } from '@/components/editor/types';

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

type Correction = {
  text: string;
  suggestion: string;
  explanation: string;
  type: CorrectionType;
};

const GRAMMAR_CHECK_PROMPT = `You are a thoughtful writing assistant that prioritizes preserving the author's unique voice while offering balanced suggestions across different aspects of writing. You must respond ONLY with valid JSON in the following format, with no additional text or notes:

{
  "corrections": [
    {
      "text": "exact matching text",
      "suggestion": "corrected text",
      "explanation": "brief explanation",
      "type": "one of: clarity, concision, structure, flow, word-choice, tone, technical-accuracy, coherence, spelling, run-on, subject-verb, parallel, completeness, punctuation, articles, tense"
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Preserve the author's original voice and style as the foundation
2. Balance suggestions across different writing aspects
3. Respect informal writing when it's intentional
4. Maintain the original tone and level of formality
5. Suggest meaningful improvements that enhance the writing
6. Ensure changes feel natural to the author's style

Focus on these aspects in priority order:
1. Voice Preservation - Keep the author's unique style while allowing refinements
2. Technical Accuracy - Address technical errors and terminology
3. Clarity & Structure - Improve organization and readability
4. Language Enhancement - Suggest more effective phrasing and word choices
5. Flow & Coherence - Enhance connections between ideas
6. Grammar & Mechanics - Fix significant grammatical issues
7. Style Polish - Offer natural refinements that align with the author's voice

Note: Aim for a balanced mix of suggestions across categories while respecting the author's fundamental style. Each suggestion should add meaningful value to the writing.

{{CUSTOM_INSTRUCTIONS}}`;

export async function POST(req: Request) {
  try {
    const { text, customInstructions } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const finalPrompt = customInstructions
      ? GRAMMAR_CHECK_PROMPT.replace(
          '{{CUSTOM_INSTRUCTIONS}}',
          `\nAdditional Context & Requirements:\n${customInstructions}`
        )
      : GRAMMAR_CHECK_PROMPT.replace('{{CUSTOM_INSTRUCTIONS}}', '');

    const response = (await cerebras.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: finalPrompt,
        },
        {
          role: 'user',
          content: `Text to check: ${text}`,
        },
      ],
      model: 'llama-3.3-70b',
      stream: false,
      max_completion_tokens: 8000,
      temperature: 0.3,
      top_p: 1,
    })) as {
      choices: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const aiResponse = response.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from Cerebras');
    }

    try {
      const { corrections } = JSON.parse(aiResponse);

      const correctionsWithIds = corrections.map((correction: Correction) => ({
        ...correction,
        id: uuidv4(),
      }));

      return NextResponse.json({
        corrections: correctionsWithIds,
        metadata: {
          totalCorrections: corrections.length,
          processedLength: text.length,
        },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse, parseError);
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Grammar check error:', error);
    return NextResponse.json(
      { error: 'Failed to check grammar' },
      { status: 500 }
    );
  }
}
