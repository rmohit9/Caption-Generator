"""
OpenAI GPT model provider for caption generation
Supports GPT-4, GPT-4 Turbo, GPT-3.5-Turbo
"""
import json
import os
from typing import List, Tuple


def _extract_json(text: str) -> dict | None:
    """Extract JSON from OpenAI response"""
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
    """Generate caption using OpenAI GPT model"""
    try:
        import openai
    except ImportError:
        raise ImportError("OpenAI library not installed. Run: pip install openai")

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set. Add it to .env file")

    model = os.environ.get("OPENAI_MODEL", "gpt-4-turbo")
    
    client = openai.OpenAI(api_key=api_key)

    prompt = (
        "Generate a high-quality social media caption and 10–15 relevant hashtags for "
        f"{platform}. The tone should be {caption_type}. The topic is: {topic}. "
        "The caption should be engaging, natural, and optimized for social media reach. "
        "Respond in JSON with keys 'caption' and 'hashtags' (array of strings)."
    )

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a social media expert who writes viral captions."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=500,
    )

    text = response.choices[0].message.content.strip()
    data = _extract_json(text)

    if isinstance(data, dict) and "caption" in data and "hashtags" in data:
        caption = str(data.get("caption", "")).strip()
        hashtags = data.get("hashtags") or []
        if not isinstance(hashtags, list):
            hashtags = [str(hashtags)]
        hashtags = [str(h).strip() for h in hashtags if str(h).strip()]
        return caption, hashtags

    return _fallback_parse(text)
