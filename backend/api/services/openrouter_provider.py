"""
OpenRouter API provider for caption generation
Unified access to 100+ models: Claude, GPT, Gemini, Llama, and more
https://openrouter.ai
"""
import json
import os
from typing import List, Tuple
import requests


def _extract_json(text: str) -> dict | None:
    """Extract JSON from OpenRouter response"""
    text = text.strip()
    if not text:
        return None
    # Try direct JSON first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Attempt to find the first JSON object in the response
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        snippet = text[start : end + 1]
        try:
            return json.loads(snippet)
        except json.JSONDecodeError:
            return None
    return None


def _fallback_parse(text: str) -> Tuple[str, List[str]]:
    """Fallback parsing if JSON extraction fails"""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    caption = lines[0] if lines else ""
    hashtags: List[str] = []
    for line in lines[1:]:
        for token in line.split():
            if token.startswith("#"):
                hashtags.append(token)
    return caption, hashtags


def generate_caption_and_hashtags(platform: str, caption_type: str, topic: str) -> Tuple[str, List[str]]:
    """Generate caption using OpenRouter (unified LLM API)"""
    
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY is not set. Add it to .env file. Get from: https://openrouter.ai/keys")

    model = os.environ.get("OPENROUTER_MODEL", "anthropic/claude-3-5-sonnet")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": "https://caption-generator.example.com",
        "X-Title": "Caption Generator",
        "Content-Type": "application/json",
    }

    prompt = (
        "Generate a high-quality social media caption and 10–15 relevant hashtags for "
        f"{platform}. The tone should be {caption_type}. The topic is: {topic}. "
        "The caption should be engaging, natural, and optimized for social media reach. "
        "Respond in JSON with keys 'caption' and 'hashtags' (array of strings)."
    )

    data = {
        "model": model,
        "messages": [
            {
                "role": "system",
                "content": "You are a social media expert who writes viral captions. Always respond with valid JSON."
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        "temperature": 0.7,
        "max_tokens": 500,
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30,
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"OpenRouter API error: {str(e)}")

    try:
        result = response.json()
        text = result["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        raise RuntimeError(f"Failed to parse OpenRouter response: {str(e)}")

    data = _extract_json(text)

    if isinstance(data, dict) and "caption" in data and "hashtags" in data:
        caption = str(data.get("caption", "")).strip()
        hashtags = data.get("hashtags") or []
        if not isinstance(hashtags, list):
            hashtags = [str(hashtags)]
        hashtags = [str(h).strip() for h in hashtags if str(h).strip()]
        return caption, hashtags

    return _fallback_parse(text)
