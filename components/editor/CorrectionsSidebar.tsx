'use client';

import { CorrectionsSidebarProps, GrammarSuggestion } from './types';
import { useTheme } from './ThemeContext';
import RetroButton from '../ui/RetroButton';
import { Check, X } from 'lucide-react';
import { RetroProgress } from '../ui/LoadingIndicator';

const ERROR_TYPE_LABELS = {
  clarity: 'Clarity',
  concision: 'Concision',
  structure: 'Structure',
  flow: 'Flow',
  'word-choice': 'Word Choice',
  tone: 'Tone',
  'technical-accuracy': 'Technical',
  coherence: 'Coherence',
  spelling: 'Spelling',
  'run-on': 'Run-on Sentence',
  'subject-verb': 'Subject-Verb',
  parallel: 'Parallel Structure',
  completeness: 'Completeness',
  punctuation: 'Punctuation',
  articles: 'Articles',
  tense: 'Tense',
} as const;

const CorrectionsSidebar = ({
  corrections,
  setCorrections,
  text,
  setText,
  onCorrectionHover,
  isChecking,
}: CorrectionsSidebarProps) => {
  const { theme, themes } = useTheme();

  const handleApplyCorrection = (correction: GrammarSuggestion) => {
    // Check if the text to be replaced exists in the current content
    if (!text.includes(correction.text)) {
      console.log(
        'Could not find the text to replace. The content might have changed.'
      );
      return;
    }

    const newText = text.replace(correction.text, correction.suggestion);
    setText(newText);

    setCorrections(corrections.filter((c) => c.id !== correction.id));
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div
      className={`w-[280px] ${themes[theme].sidebar} border-l-2 border-[#808080]`}
    >
      <div
        className={`${themes[theme].header} text-white h-7 flex items-center justify-center`}
      >
        <span className="font-chicago text-sm">suggestions</span>
      </div>
      <div className="h-[570px] overflow-y-auto p-2">
        {isChecking ? (
          <div className="h-full flex items-center justify-center">
            <RetroProgress />
          </div>
        ) : corrections.length === 0 ? (
          <div className="font-chicago text-sm text-center p-4 text-[#808080]">
            No issues found
          </div>
        ) : (
          <div className="space-y-3">
            {corrections.map((correction) => (
              <div
                key={correction.id}
                className={`${themes[theme].window} border-2 ${themes[theme].border} p-3 cursor-pointer hover:bg-opacity-50 transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCorrectionHover(correction.text);
                }}
              >
                {/* Error Type Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-chicago px-2 py-0.5 border ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-200 border-gray-600'
                        : 'bg-gray-200 text-gray-700 border-gray-300'
                    }`}
                  >
                    {ERROR_TYPE_LABELS[correction.type]}
                  </span>
                  <div className="flex gap-1">
                    <RetroButton
                      size="sm"
                      onClick={() => handleApplyCorrection(correction)}
                      aria-label="Apply correction"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </RetroButton>
                    <RetroButton
                      size="sm"
                      onClick={() =>
                        setCorrections(
                          corrections.filter((c) => c.id !== correction.id)
                        )
                      }
                      aria-label="Dismiss correction"
                    >
                      <X className="h-3.5 w-3.5" />
                    </RetroButton>
                  </div>
                </div>

                {/* Original Text */}
                <div className="mb-2">
                  <div
                    className={`font-chicago text-sm ${
                      theme === 'classic' ? 'text-red-800' : 'text-red-300'
                    } line-through break-words`}
                  >
                    {truncateText(correction.text)}
                  </div>
                </div>

                {/* Suggestion */}
                <div className="mb-2">
                  <div
                    className={`font-chicago text-sm ${
                      theme === 'classic' ? 'text-green-800' : 'text-green-300'
                    } break-words`}
                  >
                    {correction.suggestion}
                  </div>
                </div>

                {/* Explanation */}
                <div
                  className={`font-chicago text-xs ${
                    theme === 'dark' ? 'text-gray-300' : 'text-[#808080]'
                  } border-t border-[#808080] pt-2 mt-2`}
                >
                  {correction.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CorrectionsSidebar;
