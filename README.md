# ScribeSystem

![Screenshot of app](/public/scribe.png)

ScribeSystem is a Windows 98-inspired text editor that combines nostalgic UI with modern AI capabilities. Built with Next.js 14, TypeScript, and TailwindCSS, it leverages Cerebras AI for real-time writing assistance while maintaining the charm of classic desktop applications.

## Features

- 🎨 Windows 98-inspired interface with multiple themes (Classic, Dark, Synthwave, Forest)
- 🤖 Cerebras AI-powered grammar and style suggestions
- ✍️ Real-time writing assistance
- 💾 Local text saving functionality
- 🎯 Context-aware corrections
- ♿ Fully accessible interface
- 🔍 Real-time text highlighting
- 📝 Support for technical writing

## AI Implementation

The system uses Cerebras AI (llama-3.3-70b model) for intelligent writing suggestions:

### Grammar Check Process

1. **Text Analysis**: Sends text to Cerebras AI for analysis and receives structured correction suggestions
2. **Smart Correction Types**:

   - Clarity & Structure
   - Technical Accuracy
   - Flow & Coherence
   - Word Choice
   - Tone
   - Grammar & Mechanics
   - Style Polish

3. **Correction Application**: Uses precise text matching for reliable corrections while maintaining cursor position and text integrity

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/benthecoder/ScribeSystem.git

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Add your Cerebras API key to .env.local
CEREBRAS_API_KEY=your_cerebras_api_key_here

# Start the development server
bun next dev
```
