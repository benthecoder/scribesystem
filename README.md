# ScribeSystem

![Screenshot of app](/public/scribe.png)

ScribeSystem is a Windows 98-inspired text editor that combines nostalgic UI with modern AI capabilities. Built with Next.js 14, TypeScript, and TailwindCSS, it leverages Cerebras AI for real-time writing assistance.

## AI stuff

The system uses two main AI endpoints:

1. Grammar Check (`/api/grammar`):

```15:48:app/api/grammar/route.ts
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
```

- Uses a carefully crafted prompt that ensures JSON-formatted responses
- Focuses on specific correction types (spelling, grammar, style)
- Includes custom instruction support for context-aware suggestions
- Implements caching through Anthropic's ephemeral caching system
- Cache metadata is returned with each response for monitoring
- Helps reduce API costs and improve response times for repeated checks

2. Text Rewriting (`/api/rewrite/route.ts`):

```19:36:app/api/rewrite/route.ts
    const stream = await cerebras.chat.completions.create({
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
    });
```

- Handles individual correction applications
- Currently replaces entire text content for accuracy
- Uses low temperature (0.1) for consistent outputs

### Current Challenges

1. **Text Position Management**:

- Each correction currently requires a full text replacement
- Position tracking becomes complex as text length changes
- Multiple simultaneous corrections can cause position drift

2. **Performance Considerations**:

- Each correction triggers a new Cerebras API call
- While fast (~200ms), it's not optimal for rapid corrections
- Current approach prioritizes accuracy over efficiency

### Next Steps

1. **Optimize Text Processing**:

   - Implement batch correction processing to reduce API calls
   - Add position tracking system for multiple corrections
   - Create correction queue for better performance

2. **Enhance User Experience**:

   - Add real-time correction suggestions
   - Implement undo/redo functionality
   - Add visual indicators for correction types
   - Improve correction selection UI

3. **API Improvements**:

   - Add rate limiting and caching
   - Implement fallback providers
   - Add error recovery mechanisms
   - Optimize token usage

4. **Testing & Quality**:

   - Add comprehensive unit tests
   - Implement integration testing
   - Add performance benchmarks
   - Create test cases for edge scenarios

5. **Documentation**:

   - Add API documentation
   - Create user guide
   - Document correction types
   - Add setup instructions

6. **Advanced Features**:
   - Add style guide customization
   - Implement domain-specific corrections
   - Add support for multiple languages
   - Create correction templates
