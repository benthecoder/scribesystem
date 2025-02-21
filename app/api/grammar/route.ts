import { anthropic } from '@ai-sdk/anthropic';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generateText } from 'ai';

const model = anthropic('claude-3-5-sonnet-20241022');

type Correction = {
  text: string;
  suggestion: string;
  explanation: string;
  type: string;
};

const GRAMMAR_CHECK_PROMPT = `You are a writing assistant focused on clarity and grammar while preserving the author's intentional lowercase style. You must respond ONLY with valid JSON in the following format, with no additional text or notes:

{
  "corrections": [
    {
      "text": "exact matching text",
      "suggestion": "corrected text",
      "explanation": "brief explanation",
      "type": "one of: spelling, run-on, subject-verb, parallel, completeness, word-choice, punctuation, articles, tense"
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Only return corrections where the "text" field EXACTLY matches a portion of the input
2. Each correction must be for a specific, unambiguous piece of text
3. Include enough context in "text" field to ensure unique matching
4. Preserve intentional style choices (especially lowercase) unless they impact clarity
5. Pay special attention to technical terms, company names, and product names which should be spelled correctly (e.g., "JavaScript", "TypeScript", "React")
6. Provide as many corrections as possible, even if they are minor
7. Avoid excessive explanations; be concise and to the point

Focus on these aspects in priority order:
1. Spelling & Basic Errors
2. Run-on Sentences & Comma Splices
3. Clear Subject-Verb Relationships
4. Parallel Structure
5. Sentence Completeness
6. Word Choice & Concision
7. Punctuation
8. Article Usage
9. Tense Consistency

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

    const { text: aiResponse, providerMetadata } = await generateText({
      model,
      messages: [
        {
          role: 'system',
          content: finalPrompt,
          providerOptions: {
            anthropic: { cacheControl: { type: 'ephemeral' } },
          },
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Text to check: ${text}`,
            },
          ],
        },
      ],
      maxTokens: 5000,
      temperature: 0.1,
    });

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
          cacheMetadata: providerMetadata?.anthropic,
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
