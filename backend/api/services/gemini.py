import json
import os
from typing import List, Tuple, Optional

from django.conf import settings
from google import genai
from django.db.models import F
from api.models import SystemConfig
from api.services.email_service import send_admin_alert_email


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
    config = SystemConfig.get_solo()
    
    if not config.gemini_api_key:
        raise Exception("API Key is missing. Admin must configure it.")

    # Check limits BEFORE generating
    if config.is_exhausted or (config.token_limit > 0 and config.tokens_used >= config.token_limit):
        if not config.is_exhausted:
            # Send emergency email to admin
            send_admin_alert_email(
                'URGENT: Gemini API Limit Reached',
                f'Your application has reached its token limit ({config.token_limit} tokens). Please update the API key in the Admin Dashboard immediately to restore service.'
            )
            config.is_exhausted = True
            config.save()
            
        raise Exception("System is currently at capacity. Please try again later.")

    api_key = config.gemini_api_key

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
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
        
        # After successful generation, fetch live exact usage metrics
        try:
            actual_tokens = response.usage_metadata.total_token_count
        except (AttributeError, ValueError):
            actual_tokens = len(prompt) // 4 + len(response.text or "") // 4 # Basic estimate fallback
            
        SystemConfig.objects.filter(pk=config.pk).update(tokens_used=F('tokens_used') + actual_tokens)
            
    except Exception as e:
        if "429" in str(e) or "quota" in str(e).lower():
            config.is_exhausted = True
            config.save()
            send_admin_alert_email(
                'URGENT: Gemini API Quota Exceeded',
                'Google has rejected the API request due to quota limits. Change the key immediately.'
            )
        raise Exception(f"Generation failed: {str(e)}")

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
