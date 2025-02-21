export interface GrammarSuggestion {
  id: string;
  text: string;
  suggestion: string;
  explanation: string;
  type:
    | 'spelling'
    | 'run-on'
    | 'subject-verb'
    | 'parallel'
    | 'completeness'
    | 'word-choice'
    | 'punctuation'
    | 'articles'
    | 'tense';
}

export interface CorrectionsSidebarProps {
  corrections: GrammarSuggestion[];
  setCorrections: React.Dispatch<React.SetStateAction<GrammarSuggestion[]>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onCorrectionHover: (text: string) => void;
  isChecking: boolean;
}
