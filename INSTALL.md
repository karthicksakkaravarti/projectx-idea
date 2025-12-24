# ProjectX Installation Guide

ProjectX is a free, open-source AI chat app with multi-model support. This guide covers how to install and run ProjectX on different platforms, including Docker deployment options.

## Table of Contents

- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Ollama Integration](#ollama-integration)
- [Supabase Setup](#supabase-setup)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Docker for containerized deployment
- (Optional) Ollama for local LLM support

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd projects-idea

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

## Environment Variables

### Required Variables

Create a `.env.local` file with your API keys:

```env
# OpenAI
OPENAI_API_KEY=your_openai_key

# Anthropic (Claude)
ANTHROPIC_API_KEY=your_anthropic_key

# Google (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key

# Mistral
MISTRAL_API_KEY=your_mistral_key

# OpenRouter (for 100+ models)
OPENROUTER_API_KEY=your_openrouter_key
```

### BYOK (Bring Your Own Key)

ProjectX supports BYOK functionality, allowing users to securely store and use their own API keys for AI providers. To enable this feature, you need to configure an encryption key for secure storage of user API keys.

```env
BYOK_ENCRYPTION_KEY=your_32_character_hex_string
```

## Ollama Integration

Ollama allows you to run AI models locally on your machine. ProjectX has built-in support for Ollama with automatic model detection.

### Installing Ollama

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull your desired models:
   ```bash
   ollama pull llama2
   ollama pull mistral
   ollama pull codellama
   ```
3. Start ProjectX - it will automatically detect your models!

### Custom Ollama URL

By default, ProjectX connects to Ollama at `http://localhost:11434`. To use a custom URL:

```env
OLLAMA_BASE_URL=http://your-ollama-server:11434
```

## Docker Deployment

### Basic Docker

```bash
# Build the image
docker build -t projectx .

# Run the container
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_key \
  projectx
```

### Docker Compose

```bash
docker-compose up -d
```

### Docker with Ollama

For a complete setup with both ProjectX and Ollama running locally, use the provided `docker-compose.ollama.yml`:

```bash
# Start both ProjectX and Ollama services
docker-compose -f docker-compose.ollama.yml up -d
```

This Docker Compose configuration includes:
- **GPU support** for accelerated inference  
- **Persistent storage** for downloaded models
- **Proper networking** between ProjectX and Ollama
- **Health checks** for reliability

## Supabase Setup

ProjectX requires Supabase for authentication and storage. Follow these steps to set up your Supabase project:

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key
3. Add them to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Customization

You can customize various aspects of ProjectX by modifying the configuration files:

- `lib/config.ts` - App name, default models, system prompts
- `.env.local` - API keys and environment settings

## License

This project is licensed under the AGPL-3.0 license.
