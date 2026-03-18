import json
import os
from typing import List, Tuple, Optional

from django.conf import settings
from google import genai


MODEL_NAME = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")


def _extract_json(text: str) -> dict | None:
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
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    caption = lines[0] if lines else ""
    hashtags: List[str] = []
    for line in lines[1:]:
        for token in line.split():
            if token.startswith("#"):
                hashtags.append(token)
    return caption, hashtags


def generate_caption_and_hashtags(
    platform: str,
    caption_type: str,
    topic: str,
    language: Optional[str] = None,
    hashtag_count: Optional[int] = None,
) -> Tuple[str, List[str]]:
    api_key = (
        getattr(settings, "GEMINI_API_KEY", None)
        or os.environ.get("GEMINI_API_KEY")
        or os.environ.get("GOOGLE_API_KEY")
    )
    if not api_key:
        raise ValueError("GEMINI_API_KEY (or GOOGLE_API_KEY) is not set")

    language_hint = f" Write the caption in {language}." if language else ""
    hashtag_hint = (
        f" Generate exactly {hashtag_count} relevant hashtags."
        if isinstance(hashtag_count, int) and hashtag_count > 0
        else " Generate 10–15 relevant hashtags."
    )

    prompt = (
        "Generate a high-quality social media caption and hashtags for "
        f"{platform}. The tone should be {caption_type}. The topic is: {topic}. "
        f"The caption should be engaging, natural, and optimized for social media reach.{language_hint}{hashtag_hint} "
        "Respond in JSON with keys 'caption' and 'hashtags' (array of strings)."
    )

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    text = (response.text or "").strip()
    data = _extract_json(text)

    if isinstance(data, dict) and "caption" in data and "hashtags" in data:
        caption = str(data.get("caption", "")).strip()
        hashtags = data.get("hashtags") or []
        if not isinstance(hashtags, list):
            hashtags = [str(hashtags)]
        hashtags = [str(h).strip() for h in hashtags if str(h).strip()]
        return caption, hashtags

    return _fallback_parse(text)
