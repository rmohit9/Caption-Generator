# AI Model Setup Guide

This guide helps you configure the Caption Generator to use your preferred AI provider.

## Choose Your AI Provider

| Provider | Best For | Setup Time | Cost | Best Model |
|----------|----------|-----------|------|-----------|
| **Gemini** | Free tier, fast development | 2 min | Free | `gemini-2.5-flash` |
| **OpenRouter** | 100+ models, flexibility | 3 min | Cheap | `anthropic/claude-3-5-sonnet` |
| **Claude** | Long-form, nuanced output | 2 min | Cheap | `claude-3-sonnet-20240229` |

---

## Option 1: Google Gemini (Free, Default) ✅

### Step 1: Get API Key
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### Step 2: Update `.env`
```bash
# backend/.env
GEMINI_API_KEY=your-key-here
# AI_MODEL_PROVIDER defaults to gemini, so no change needed
```

### Step 3: Restart Backend
```bash
# In backend directory
python manage.py runserver
```

✅ **Done!** Your Caption Generator now uses Gemini.

---

## Option 2: OpenRouter (100+ Models) 🚀 **Recommended**

OpenRouter gives you access to:
- **Claude 3.5 Sonnet** (best overall quality)
- **GPT-4 Turbo** (high quality, expensive)
- **Llama 3 70B** (open source, cheap)
- **Mistral Large** (fast, good quality)
- **And 100+ more models!**

### Step 1: Get API Key
1. Go to https://openrouter.ai/keys
2. Sign up (free account)
3. Click "Create Key"
4. Copy the key

### Step 2: Update `.env`
```bash
# backend/.env
AI_MODEL_PROVIDER=openrouter
OPENROUTER_API_KEY=your-key-here
OPENROUTER_MODEL=anthropic/claude-3-5-sonnet
```

**Available models** (pick your favorite):
```bash
# Best Quality
OPENROUTER_MODEL=anthropic/claude-3-5-sonnet

# Cheaper & Fast
OPENROUTER_MODEL=meta-llama/llama-3-70b

# High Quality
OPENROUTER_MODEL=openai/gpt-4-turbo

# Balanced
OPENROUTER_MODEL=openai/gpt-4o

# Very Fast & Cheap
OPENROUTER_MODEL=mistralai/mistral-large
```

Browse all 100+ models at: https://openrouter.ai/docs/models

### Step 3: Ensure Dependencies
```bash
# requests library is usually pre-installed
pip install requests  # If not already installed
```

### Step 4: Restart Backend
```bash
# In backend directory
python manage.py runserver
```

✅ **Done!** You can now switch between 100+ models just by changing `OPENROUTER_MODEL`.

---

## Option 3: Anthropic Claude (Direct) 🎯

### Step 1: Get API Key
1. Go to https://console.anthropic.com/account/keys
2. Sign in or create account
3. Create new API key
4. Copy the key

### Step 2: Update `.env`
```bash
# backend/.env
AI_MODEL_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-key-here
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

### Step 3: Install Dependencies
```bash
pip install anthropic
```

### Step 4: Restart Backend
```bash
# In backend directory
python manage.py runserver
```

✅ **Done!** Your Caption Generator now uses Claude directly from Anthropic.

---

## Switching Between Providers (At Runtime)

Want to try a different provider? Just update `backend/.env`:

```bash
# Try OpenRouter with Llama (cheapest)
AI_MODEL_PROVIDER=openrouter
OPENROUTER_API_KEY=sk_...
OPENROUTER_MODEL=meta-llama/llama-3-70b

# Then restart Django
python manage.py runserver
```

No code changes needed! The router automatically switches.

---

## Testing Your Setup

### 1. Verify Environment Variables
```bash
cd backend
grep "GEMINI_API_KEY\|OPENROUTER_API_KEY\|ANTHROPIC_API_KEY" .env
```

You should see your chosen provider's API key.

### 2: Start Backend
```bash
# In backend directory
python manage.py runserver
```

### 3: Test with Frontend
```bash
# In separate terminal, frontend directory
npm run dev
```

Then open http://localhost:5173 and test caption generation.

---

## Troubleshooting

### "Invalid API Key"
- Check key has no spaces: `OPENROUTER_API_KEY = sk_...` ❌ (space after =)
- Check key is correct length
- Verify key is active in provider dashboard

### "Module not found: anthropic"
- Run: `pip install anthropic` (only for Anthropic)

### "Module not found: requests"
- Run: `pip install requests` (only for OpenRouter)

### Caption generation hangs/times out
- Check API key is valid
- Check internet connection
- Check provider API status

### "Rate limit exceeded"
- You're making too many requests
- Try a different provider with higher limits

---

## Cost Estimation

### Per Caption Cost

| Provider | Model | Cost |
|----------|-------|------|
| Gemini | `gemini-2.5-flash` | Free |
| OpenRouter | `claude-3-5-sonnet` | ~$0.003 |
| OpenRouter | `llama-3-70b` | ~$0.0002 |
| Claude | `claude-3-sonnet` | ~$0.003 |
| Claude | `claude-3-haiku` | ~$0.0003 |

### Example: 1000 Captions/Month
- **Gemini**: $0
- **OpenRouter (Claude)**: ~$3
- **OpenRouter (Llama)**: ~$0.20
- **Claude Direct**: ~$3

---

## Pro Tips

1. **Start with Gemini** for free testing
2. **Switch to OpenRouter** for flexibility (100+ models)
3. **Use Llama for bulk tasks** (cheaper)
4. **Use Claude for quality work** (best writing)

---

## Provider Comparison Table

| Feature | Gemini | OpenRouter | Claude |
|---------|--------|-----------|--------|
| Free Tier | ✅ Yes | Limited | Limited |
| API Key Setup | ⭐ Easy | ⭐ Easy | ⭐ Easy |
| Speed | ⚡⚡ Fast | ⚡ Medium | ⚡ Medium |
| Quality | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐ Very Good |
| Models Available | 3 | 100+ | 3 |
| Best For | Free testing | Flexibility | Quality |

---

## API Key Security

🔒 **IMPORTANT:** API keys give access to your paid account!

1. Never commit `.env` to Git (already in `.gitignore`)
2. Never share API keys in emails or Slack
3. Rotate keys if accidentally exposed
4. Use environment variables in production (never hardcode)

---

## Still Having Issues?

Each provider has documentation:
- **Gemini**: https://ai.google.dev/docs
- **OpenRouter**: https://openrouter.ai/docs
- **Claude**: https://docs.anthropic.com

Or check the backend logs:
```bash
# Terminal running Django will show detailed errors
# Look for lines starting with [ERROR]
```
