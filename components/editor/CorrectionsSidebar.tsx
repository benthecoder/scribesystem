'use client';

import { CorrectionsSidebarProps, GrammarSuggestion } from './types';
import { useTheme } from './ThemeContext';
import RetroButton from '../ui/RetroButton';
import { Check, X } from 'lucide-react';
import { RetroProgress } from '../ui/LoadingIndicator'; // Add this import

const CorrectionsSidebar = ({
  corrections,
  setCorrections,
  text,
  setText,
  onCorrectionHover,
  isChecking, // Add this
}: CorrectionsSidebarProps) => {
  const { theme, themes } = useTheme();

  const handleApplyCorrection = async (correction: GrammarSuggestion) => {
    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, correction }),
      });

      const data = await response.json();
      if (data.rewrittenText) {
        setText(data.rewrittenText);
        setCorrections(corrections.filter((c) => c.id !== correction.id));
      }
    } catch (error) {
      console.error('Failed to apply correction:', error);
    }
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
          <div className="space-y-2">
            {corrections.map((correction) => (
              <div
                key={correction.id}
                className={`${themes[theme].window} border-2 ${themes[theme].border} p-2 cursor-pointer`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCorrectionHover(correction.text);
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`font-chicago text-sm ${
                      theme === 'dark' ||
                      theme === 'synthwave' ||
                      theme === 'coffee' ||
                      theme === 'forest'
                        ? 'text-red-400 line-through'
                        : 'text-red-800 line-through'
                    }`}
                  >
                    {correction.text}
                  </span>
                  <div className="flex gap-1 ml-2 shrink-0">
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
                <div
                  className={`font-chicago text-sm ${
                    theme === 'dark' ||
                    theme === 'synthwave' ||
                    theme === 'coffee' ||
                    theme === 'forest'
                      ? 'text-green-400'
                      : 'text-green-800'
                  } mb-2`}
                >
                  {correction.suggestion}
                </div>
                <div
                  className={`font-chicago text-xs ${
                    theme === 'dark' ||
                    theme === 'synthwave' ||
                    theme === 'coffee' ||
                    theme === 'forest'
                      ? 'text-gray-300'
                      : 'text-[#808080]'
                  } border-t border-[#808080] pt-1`}
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
