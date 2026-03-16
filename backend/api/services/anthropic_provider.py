"""
Anthropic Claude model provider for caption generation
Supports Claude 3 family (Opus, Sonnet, Haiku)
"""
import json
import os
from typing import List, Tuple


def _extract_json(text: str) -> dict | None:
    """Extract JSON from Claude response"""
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
    """Generate caption using Anthropic Claude model"""
    try:
        import anthropic
    except ImportError:
        raise ImportError("Anthropic library not installed. Run: pip install anthropic")

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY is not set. Add it to .env file")

    model = os.environ.get("ANTHROPIC_MODEL", "claude-3-sonnet-20240229")
    
    client = anthropic.Anthropic(api_key=api_key)

    prompt = (
        "Generate a high-quality social media caption and 10–15 relevant hashtags for "
        f"{platform}. The tone should be {caption_type}. The topic is: {topic}. "
        "The caption should be engaging, natural, and optimized for social media reach. "
        "Respond in JSON with keys 'caption' and 'hashtags' (array of strings)."
    )

    message = client.messages.create(
        model=model,
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        system="You are a social media expert who writes viral captions.",
    )

    text = message.content[0].text.strip()
    data = _extract_json(text)

    if isinstance(data, dict) and "caption" in data and "hashtags" in data:
        caption = str(data.get("caption", "")).strip()
        hashtags = data.get("hashtags") or []
        if not isinstance(hashtags, list):
            hashtags = [str(hashtags)]
        hashtags = [str(h).strip() for h in hashtags if str(h).strip()]
        return caption, hashtags

    return _fallback_parse(text)
