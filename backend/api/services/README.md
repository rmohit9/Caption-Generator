# AI Model Router Documentation

## Overview

The Caption Generator supports multiple AI providers through a flexible router pattern. Switch between different models by changing environment variables.

---

## Supported Providers

### 1. **Google Gemini** (Default) ⭐

**Best for:** Fast, cost-effective, good quality captions

```env
AI_MODEL_PROVIDER=gemini
GEMINI_API_KEY=your-api-key
GEMINI_MODEL=gemini-2.5-flash
```

**Available Models:**
- `gemini-2.5-flash` (latest, recommended)
- `gemini-1.5-pro`
- `gemini-1.5-flash`

**Get API Key:** https://aistudio.google.com/app/apikey

---

### 2. **OpenRouter** 🚀

**Best for:** Access 100+ models from one API. Use Claude, GPT, Llama, Mistral, and more.

```env
AI_MODEL_PROVIDER=openrouter
OPENROUTER_API_KEY=your-api-key
OPENROUTER_MODEL=anthropic/claude-3-5-sonnet
```

**Popular Models on OpenRouter:**
- `anthropic/claude-3-5-sonnet` (recommended - best quality)
- `openai/gpt-4-turbo` (high quality, more expensive)
- `openai/gpt-4o` (balanced, fast)
- `meta-llama/llama-3-70b` (open source, cheaper)
- `mistralai/mistral-large` (fast, good quality)
- `google/gemini-2-flash` (through OpenRouter)

**Get API Key:** https://openrouter.ai/keys

**Cost:** Varies by model (~$0.001-0.08 per caption)

---

### 3. **Anthropic Claude** 🎯

**Best for:** Long-form, nuanced captions, excellent writing

```env
AI_MODEL_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-api-key
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

**Available Models:**
- `claude-3-opus-20240229` (most capable, slower)
- `claude-3-sonnet-20240229` (recommended, balanced)
- `claude-3-haiku-20240307` (fastest, cheaper)

**Get API Key:** https://console.anthropic.com/account/keys

**Cost:** ~$0.001-0.015 per caption (varies by model)

---

## Quick Start

### Option 1: Use Gemini (Default) ✅

1. Get API key from https://aistudio.google.com/app/apikey
2. Add to `backend/.env`:
   ```env
   GEMINI_API_KEY=your-key-here
   ```
3. Restart Django server
4. Done! Generator will use Gemini

### Option 2: Switch to OpenRouter (Recommended!) 🚀

1. Get API key from https://openrouter.ai/keys (free account)
2. Update `backend/.env`:
   ```env
   AI_MODEL_PROVIDER=openrouter
   OPENROUTER_API_KEY=your-key-here
   OPENROUTER_MODEL=anthropic/claude-3-5-sonnet
   ```
3. Install requests library (usually already installed):
   ```bash
   pip install requests
   ```
4. Restart Django server
5. Access 100+ models instantly!

**Available models at OpenRouter:**
- `anthropic/claude-3-5-sonnet` - Best overall
- `openai/gpt-4-turbo` - High quality
- `meta-llama/llama-3-70b` - Cheap open source
- `mistralai/mistral-large` - Fast
- And many more!

### Option 3: Switch to Claude (Direct)

1. Get API key from https://console.anthropic.com/account/keys
2. Update `backend/.env`:
   ```env
   AI_MODEL_PROVIDER=anthropic
   ANTHROPIC_API_KEY=your-key-here
   ANTHROPIC_MODEL=claude-3-sonnet-20240229
   ```
3. Install Anthropic library:
   ```bash
   pip install anthropic
   ```
4. Restart Django server

---

## Configuration Reference

### Environment Variables

| Variable | Possible Values | Default |
|----------|-----------------|---------|
| `AI_MODEL_PROVIDER` | `gemini`, `openrouter`, `anthropic` | `gemini` |
| `GEMINI_API_KEY` | Your API key | (required for gemini) |
| `GEMINI_MODEL` | Model name | `gemini-2.5-flash` |
| `OPENROUTER_API_KEY` | Your API key | (required for openrouter) |
| `OPENROUTER_MODEL` | Model ID | `anthropic/claude-3-5-sonnet` |
| `ANTHROPIC_API_KEY` | Your API key | (required for anthropic) |
| `ANTHROPIC_MODEL` | Model name | `claude-3-sonnet-20240229` |

---

## Performance Comparison

| Provider | Speed | Quality | Cost | Free Tier | Models |
|----------|-------|---------|------|-----------|--------|
| **Gemini** | ⚡⚡ Fast | ⭐⭐⭐ Good | $ Cheap | ✅ Yes | 3 |
| **OpenRouter** | ⚡ Medium | ⭐⭐⭐⭐⭐ Excellent | $$ Variable | ✅ Limited | 100+ |
| **Anthropic** | ⚡ Medium | ⭐⭐⭐⭐ Very Good | $ Cheap | ✅ Limited | 3 |

---

## API Key Security

**Never commit API keys to git!** They're already in `.gitignore`:

```bash
# .gitignore includes:
.env
.env.local
```

Never share API keys in code or documentation.

---

## Default Model Configurations

### Gemini
```env
OPENROUTER_MODEL=gemini-2-flash
```

### OpenAI (through OpenRouter)
```env
OPENROUTER_MODEL=openai/gpt-4-turbo
OPENROUTER_MODEL=openai/gpt-4o
OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

### Meta Llama (through OpenRouter)
```env
OPENROUTER_MODEL=meta-llama/llama-3-70b
OPENROUTER_MODEL=meta-llama/llama-3-8b
```

### Mistral (through OpenRouter)
```env
OPENROUTER_MODEL=mistralai/mistral-large
OPENROUTER_MODEL=mistralai/mistral-medium
```

---

## Troubleshooting

### Model not generating captions

1. **Check API key is set:**
   ```bash
   # In backend terminal
   echo $OPENROUTER_API_KEY  # Should show your key
   ```

2. **Verify provider setting:**
   ```bash
   grep "AI_MODEL_PROVIDER" backend/.env
   ```

3. **Check Django logs for errors:**
   ```bash
   # Terminal running Django will show error details
   ```

### "API key is invalid"
- Verify key is correct (no spaces, full key copied)
- Check OpenRouter dashboard that key is active

### High costs?

Use cheaper models on OpenRouter:
```env
OPENROUTER_MODEL=meta-llama/llama-3-70b
```

---

## Architecture

### File Structure

```
backend/api/services/
├── gemini.py              # Gemini implementation
├── openrouter_provider.py # OpenRouter implementation
├── anthropic_provider.py  # Anthropic implementation
└── model_router.py        # Routes to correct provider
```

### How Router Works

1. Checks `AI_MODEL_PROVIDER` in `.env`
2. Routes to appropriate provider function
3. Each provider has identical interface:
   ```python
   def generate_caption_and_hashtags(
       platform: str,           # "instagram", "twitter", etc
       caption_type: str,       # "Motivational", "Professional", etc
       topic: str               # Product description & context
   ) -> Tuple[str, List[str]]  # Returns (caption, hashtags)
   ```
4. Returns caption + hashtags to frontend

---

## Recommended Setup

**For Production:** OpenRouter with Claude 3.5 Sonnet
**For Development:** Gemini (free tier)
**For Cost:** OpenRouter with Llama 3

---

## Need Help?

- Gemini: https://aistudio.google.com/app
- OpenRouter: https://openrouter.ai/docs
- Claude: https://console.anthropic.com/account/keys
