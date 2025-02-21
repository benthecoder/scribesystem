import { ThemeProvider } from '@/components/editor/ThemeContext';
import TextEditor from '@/components/editor/TextEditor';

export default function Home() {
  return (
    <ThemeProvider>
      <TextEditor />
    </ThemeProvider>
  );
}
