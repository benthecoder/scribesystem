'use client';

import { useState, useRef, useEffect } from 'react';
import { Wand2, Palette, Save, HelpCircle, X, Settings } from 'lucide-react';
import { useTheme, Theme } from './ThemeContext';
import { GrammarSuggestion } from './types';
import CorrectionsSidebar from './CorrectionsSidebar';
import RetroButton from '../ui/RetroButton';
import Image from 'next/image';

const TextEditor = () => {
  const { theme, themes, setTheme } = useTheme();
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [corrections, setCorrections] = useState<GrammarSuggestion[]>([]);
  const [showThemes, setShowThemes] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [customInstructions, setCustomInstructions] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const MAX_WORDS = 1000;
  const handleCheckGrammar = async () => {
    if (!text.trim()) return;

    setIsChecking(true);
    try {
      const response = await fetch('/api/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          customInstructions: customInstructions.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (data.corrections) {
        setCorrections(data.corrections);
      }
    } catch (error) {
      console.error('Grammar check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSave = () => {
    if (!text.trim()) return;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setShowThemes(false);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (selectedText) {
        setSelectedText(null);
        if (editorRef.current) {
          editorRef.current.setSelectionRange(
            editorRef.current.selectionStart,
            editorRef.current.selectionStart
          );
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedText]);

  const handleCorrectionHover = (correctionText: string) => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const start = text.indexOf(correctionText);

    if (start !== -1) {
      textarea.focus();
      textarea.setSelectionRange(start, start + correctionText.length);
      setSelectedText(correctionText);

      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const numberOfLinesBefore =
        text.substring(0, start).split('\n').length - 1;
      const scrollPosition = numberOfLinesBefore * lineHeight;
      textarea.scrollTop = scrollPosition;
    }
  };

  return (
    <div
      className={`min-h-screen ${themes[theme].background} transition-colors duration-300`}
    >
      <div className="h-[200px] p-4">
        <div
          className={`max-w-4xl mx-auto border-2 ${themes[theme].window} ${themes[theme].border} shadow-[2px_2px_4px_rgba(0,0,0,0.2)] transition-colors duration-300`}
        >
          {/* Windows-style Header */}
          <div
            className={`${themes[theme].header} h-7 flex items-center justify-between px-2 relative`}
          >
            <div className="text-white font-chicago text-sm flex-1 text-center flex items-center justify-center gap-2">
              <Image
                src="/favicon.ico"
                alt="ScribeSystem Logo"
                width={16}
                height={16}
                className="object-contain bg-white"
              />
              ScribeSystem
            </div>
            <RetroButton size="sm" aria-label="Close window">
              <X className="h-3.5 w-3.5" />
            </RetroButton>
          </div>
          <div
            className={`${themes[theme].window} p-1 border-t ${themes[theme].border} flex items-center gap-2`}
          >
            <RetroButton
              onClick={handleCheckGrammar}
              disabled={isChecking || !text.trim()}
              icon
            >
              <Wand2 className="h-3.5 w-3.5" />
            </RetroButton>

            <RetroButton
              onClick={() => setShowInstructions(true)}
              icon
              aria-label="Custom Instructions"
            >
              <Settings className="h-3.5 w-3.5" />
            </RetroButton>

            {/* Custom Instructions Modal */}
            {showInstructions && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div
                  className={`${themes[theme].window} border-2 ${themes[theme].border} p-4 max-w-lg w-full rounded-sm`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3
                      className={`font-chicago text-sm ${themes[theme].text}`}
                    >
                      Custom Rules
                    </h3>
                    <RetroButton
                      onClick={() => setShowInstructions(false)}
                      icon
                      size="sm"
                    >
                      <X className="h-3.5 w-3.5" />
                    </RetroButton>
                  </div>
                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    className={`w-full h-32 p-2 font-chicago text-sm ${themes[theme].editor} resize-none focus:outline-none border-2 ${themes[theme].border}`}
                    placeholder="Add custom instructions or context..."
                  />

                  <div className="flex justify-end mt-4 gap-2">
                    <RetroButton onClick={() => setShowInstructions(false)}>
                      Save
                    </RetroButton>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Switcher */}
            <div className="relative">
              <RetroButton onClick={() => setShowThemes(!showThemes)} icon>
                <Palette className="h-3.5 w-3.5" />
              </RetroButton>

              {showThemes && (
                <div className="absolute top-full left-0 mt-1 bg-white border-2 border-gray-800 shadow-lg rounded-sm z-10">
                  {Object.keys(themes).map((themeName) => (
                    <button
                      key={themeName}
                      onClick={() => handleThemeChange(themeName as Theme)}
                      className="w-full px-4 py-1 text-left hover:bg-gray-100 font-chicago text-sm"
                    >
                      {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <RetroButton onClick={handleSave} disabled={!text.trim()} icon>
              <Save className="h-3.5 w-3.5" />
            </RetroButton>
          </div>

          {/* Main Content */}
          <div className="flex border-t-2 border-[#808080]">
            <div className="flex-1">
              <textarea
                ref={editorRef}
                value={text}
                onChange={(e) => {
                  const newText = e.target.value;
                  const wordCount = newText.trim().split(/\s+/).length;
                  if (wordCount <= MAX_WORDS) {
                    setText(newText);
                  }
                }}
                className={`w-full h-[600px] p-2 font-chicago text-sm ${
                  themes[theme].editor
                } resize-none focus:outline-none border-2 ${
                  themes[theme].border
                } transition-colors duration-300 ${
                  selectedText
                    ? 'selection:bg-yellow-200 selection:text-black'
                    : ''
                }`}
                placeholder="Start typing..."
                spellCheck="false"
                aria-label="Text editor content"
                maxLength={MAX_WORDS * 50} // Assuming average word length of 5 chars + spaces
              />
            </div>

            <CorrectionsSidebar
              corrections={corrections}
              setCorrections={setCorrections}
              text={text}
              setText={setText}
              onCorrectionHover={handleCorrectionHover}
              isChecking={isChecking} // Add this
            />
          </div>

          {/* Status Bar */}
          <div
            className={`${themes[theme].window} ${themes[theme].text} h-8 border-t-2 ${themes[theme].border} flex items-center justify-between px-2 font-chicago text-sm`}
          >
            <div>
              words: {text.trim() ? text.trim().split(/\s+/).length : 0} /
              {MAX_WORDS}
            </div>

            {/* Help Button */}
            <div className="relative ml-auto">
              <RetroButton
                onClick={() => setShowHelp(!showHelp)}
                icon
                aria-label="Show help"
              >
                <HelpCircle className="h-3.5 w-3.5" />
              </RetroButton>
              {showHelp && (
                <div
                  className={`absolute bottom-full right-0 mb-1 w-64 ${themes[theme].window} border-2 ${themes[theme].border} shadow-lg rounded-sm z-10 p-3 font-chicago text-sm ${themes[theme].text}`}
                >
                  <h3 className="font-bold mb-2">How to use:</h3>
                  <ul className="space-y-1">
                    <li>✨ Click the wand for feedback</li>
                    <li>⚙️ Set custom rules for style</li>
                    <li>🎨 Use palette to change themes</li>
                    <li>💾 Save your text as a file</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
