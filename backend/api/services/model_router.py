"""
AI Model Router - supports multiple caption generation providers
Routes requests to appropriate model based on configuration
"""
import os
from typing import Tuple, List, Optional

from .gemini import generate_caption_and_hashtags as gemini_generate
from .openrouter_provider import generate_caption_and_hashtags as openrouter_generate
from .anthropic_provider import generate_caption_and_hashtags as anthropic_generate


MODEL_PROVIDER = os.environ.get("AI_MODEL_PROVIDER", "gemini").lower()


def generate_caption_and_hashtags(
    platform: str,
    caption_type: str,
    topic: str,
    language: Optional[str] = None,
    hashtag_count: Optional[int] = None,
) -> Tuple[str, List[str]]:
    """
    Route caption generation to configured AI model provider.
    
    Supported providers:
    - gemini (default)
    - openrouter (100+ models)
    - anthropic (Claude)
    
    Environment Variables:
    - AI_MODEL_PROVIDER: Which provider to use (gemini/openrouter/anthropic)
    - GEMINI_API_KEY or GOOGLE_API_KEY: For Gemini
    - OPENROUTER_API_KEY: For OpenRouter
    - ANTHROPIC_API_KEY: For Anthropic
    """
    
    if MODEL_PROVIDER == "openrouter":
        return openrouter_generate(platform, caption_type, topic, language, hashtag_count)
    elif MODEL_PROVIDER == "anthropic":
        return anthropic_generate(platform, caption_type, topic, language, hashtag_count)
    else:  # Default to Gemini
        return gemini_generate(platform, caption_type, topic, language, hashtag_count)
