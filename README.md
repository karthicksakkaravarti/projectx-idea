# ProjectX

**ProjectX** is the open-source chat interface for all your models.

## Features

- 🧠 Multi-model support: Claude, OpenAI, Gemini, Mistral, and more
- 🔑 BYOK (Bring Your Own Key) ready
- 🏠 Fully self-hostable
- 🌐 OpenRouter integration for 100+ models
- 🦙 Ollama support for local models
- 💾 Chat history with IndexedDB persistence

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

### Running with Local LLMs (Ollama)

```bash
# Clone and run ProjectX
git clone <your-repo-url>
cd projects-idea
npm install
npm run dev
```

ProjectX will automatically detect your local Ollama models!

### Docker Deployment

```bash
docker-compose up
```

## Configuration

Set your API keys in `.env.local`:

```env
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
GOOGLE_GENERATIVE_AI_API_KEY=your_key
```

## License

This project is licensed under the AGPL-3.0 license.
