export type CorrectionType =
  | 'clarity'
  | 'concision'
  | 'structure'
  | 'flow'
  | 'word-choice'
  | 'tone'
  | 'technical-accuracy'
  | 'coherence'
  | 'spelling'
  | 'run-on'
  | 'subject-verb'
  | 'parallel'
  | 'completeness'
  | 'punctuation'
  | 'articles'
  | 'tense';

export interface GrammarSuggestion {
  id: string;
  text: string;
  suggestion: string;
  explanation: string;
  type: CorrectionType;
}

export interface CorrectionsSidebarProps {
  corrections: GrammarSuggestion[];
  setCorrections: React.Dispatch<React.SetStateAction<GrammarSuggestion[]>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  onCorrectionHover: (text: string) => void;
  isChecking: boolean;
}
