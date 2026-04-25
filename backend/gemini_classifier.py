# gemini_classifier.py
# Determines recyclability of waste items using AI vision APIs.
# Uses direct REST API calls (no SDK) to avoid version conflicts.
#
# Provider priority:
#   1. Groq API  (fast, generous free tier, vision-capable)
#   2. Gemini API (Google, fallback)
#   3. Rule-based logic (always available)

from __future__ import annotations

import base64
import json
import os
import time
from dataclasses import dataclass
from dotenv import load_dotenv

import requests

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ─── Configuration ────────────────────────────────────────────

# Groq — OpenAI-compatible endpoint with vision support
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

# Gemini — direct REST (no SDK needed)
GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_API_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
)

# Retry settings
MAX_RETRIES = 2
INITIAL_BACKOFF_SECONDS = 2.0
REQUEST_TIMEOUT_SECONDS = 30


# ─── Prompt ───────────────────────────────────────────────────
RECYCLABILITY_PROMPT = """You are a waste analysis expert. Look at the provided image of a waste item. Determine whether this item is recyclable or not.

Return ONLY a raw JSON object with the following structure. No markdown, no code blocks, no extra text:
{
  "isRecyclable": true or false,
  "reasoning": "A brief one-sentence explanation of why this item is or is not recyclable"
}

Rules:
- "isRecyclable" must be a boolean (true or false)
- "reasoning" must be a short, clear, helpful sentence
- Do NOT wrap the JSON in markdown code fences
"""


# ─── Rule-based fallback recyclability data ───────────────────
RECYCLABILITY_RULES: dict[str, dict] = {
    "dry": {
        "is_recyclable": True,
        "reasoning": "Dry waste items like paper, plastic, metal, and glass are generally recyclable through proper recycling streams.",
    },
    "wet": {
        "is_recyclable": False,
        "reasoning": "Wet/organic waste is biodegradable and should be composted rather than recycled through conventional recycling.",
    },
    "e_waste": {
        "is_recyclable": True,
        "reasoning": "Electronic waste contains valuable recoverable materials and should be sent to certified e-waste recycling facilities.",
    },
    "hazardous": {
        "is_recyclable": False,
        "reasoning": "Hazardous waste requires special handling and cannot be processed through standard recycling facilities.",
    },
}


@dataclass
class RecyclabilityResult:
    is_recyclable: bool
    reasoning: str
    source: str = "gemini"  # "gemini", "groq", or "rules"


# ═══════════════════════════════════════════════════════════════
# STATUS HELPERS
# ═══════════════════════════════════════════════════════════════

def gemini_ready() -> bool:
    """Check if any AI API key is configured."""
    return bool(
        (GROQ_API_KEY and GROQ_API_KEY.strip())
        or (GEMINI_API_KEY and GEMINI_API_KEY.strip())
    )


def get_gemini_status() -> dict[str, object]:
    """Return current status of the AI recyclability integration."""
    has_groq = bool(GROQ_API_KEY and GROQ_API_KEY.strip())
    has_gemini = bool(GEMINI_API_KEY and GEMINI_API_KEY.strip())

    if not has_groq and not has_gemini:
        return {
            "ready": False,
            "reason": "No AI API key configured. Set GROQ_API_KEY or GEMINI_API_KEY in .env.",
        }

    providers = []
    if has_groq:
        providers.append("Groq")
    if has_gemini:
        providers.append("Gemini")

    return {
        "ready": True,
        "reason": f"AI recyclability analysis ready ({', '.join(providers)}).",
    }


# ═══════════════════════════════════════════════════════════════
# JSON PARSING HELPER
# ═══════════════════════════════════════════════════════════════

def _parse_recyclability_json(raw_text: str, source: str) -> RecyclabilityResult | None:
    """Parse the recyclability JSON from any AI provider response."""
    cleaned = raw_text.strip()

    # Strip markdown code fences if present
    if cleaned.startswith("```"):
        first_nl = cleaned.find("\n")
        if first_nl != -1:
            cleaned = cleaned[first_nl + 1:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    try:
        result = json.loads(cleaned)
        return RecyclabilityResult(
            is_recyclable=bool(result.get("isRecyclable", False)),
            reasoning=str(result.get("reasoning", "No reasoning provided.")),
            source=source,
        )
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        print(f"Failed to parse {source} response JSON: {e}")
        print(f"Raw text: {raw_text[:300]}")
        return None


# ═══════════════════════════════════════════════════════════════
# GROQ API  (Primary — OpenAI-compatible, vision-capable)
# ═══════════════════════════════════════════════════════════════

def _check_with_groq(file_bytes: bytes, mime_type: str) -> RecyclabilityResult | None:
    """Call Groq's OpenAI-compatible vision endpoint."""
    if not GROQ_API_KEY or not GROQ_API_KEY.strip():
        return None

    image_b64 = base64.standard_b64encode(file_bytes).decode("utf-8")
    data_uri = f"data:{mime_type};base64,{image_b64}"

    payload = {
        "model": GROQ_VISION_MODEL,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": RECYCLABILITY_PROMPT},
                    {
                        "type": "image_url",
                        "image_url": {"url": data_uri},
                    },
                ],
            }
        ],
        "temperature": 0.1,
        "max_tokens": 256,
        "response_format": {"type": "json_object"},
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROQ_API_KEY}",
    }

    backoff = INITIAL_BACKOFF_SECONDS

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(f"Groq API attempt {attempt}/{MAX_RETRIES}...")

            resp = requests.post(
                GROQ_API_URL,
                json=payload,
                headers=headers,
                timeout=REQUEST_TIMEOUT_SECONDS,
            )

            if resp.status_code == 200:
                data = resp.json()
                text = data["choices"][0]["message"]["content"]
                result = _parse_recyclability_json(text, source="groq")
                if result:
                    print(f"Groq recyclability check succeeded (attempt {attempt}).")
                    return result
                else:
                    print("Groq returned 200 but response could not be parsed.")
                    return None

            if resp.status_code == 429:
                print(f"Groq rate-limited (429) on attempt {attempt}. Retrying in {backoff:.1f}s...")
                if attempt < MAX_RETRIES:
                    time.sleep(backoff)
                    backoff *= 2
                    continue
                return None

            if resp.status_code >= 500:
                print(f"Groq server error ({resp.status_code}) on attempt {attempt}.")
                if attempt < MAX_RETRIES:
                    time.sleep(backoff)
                    backoff *= 2
                    continue
                return None

            # Client error (4xx) — don't retry
            error_text = ""
            try:
                error_text = resp.text[:500]
            except Exception:
                pass
            print(f"Groq API error {resp.status_code}: {error_text}")
            return None

        except requests.exceptions.Timeout:
            print(f"Groq request timed out (attempt {attempt}).")
            if attempt < MAX_RETRIES:
                time.sleep(backoff)
                backoff *= 2
                continue
            return None

        except requests.exceptions.ConnectionError as e:
            print(f"Groq connection error (attempt {attempt}): {e}")
            if attempt < MAX_RETRIES:
                time.sleep(backoff)
                backoff *= 2
                continue
            return None

        except Exception as e:
            print(f"Unexpected Groq error (attempt {attempt}): {e}")
            return None

    return None


# ═══════════════════════════════════════════════════════════════
# GEMINI API  (Fallback — direct REST)
# ═══════════════════════════════════════════════════════════════

def _check_with_gemini(file_bytes: bytes, mime_type: str) -> RecyclabilityResult | None:
    """Call Gemini REST API directly."""
    if not GEMINI_API_KEY or not GEMINI_API_KEY.strip():
        return None

    image_b64 = base64.standard_b64encode(file_bytes).decode("utf-8")

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": RECYCLABILITY_PROMPT},
                    {
                        "inlineData": {
                            "mimeType": mime_type,
                            "data": image_b64,
                        }
                    },
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 256,
        },
    }

    url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}

    backoff = INITIAL_BACKOFF_SECONDS

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(f"Gemini API attempt {attempt}/{MAX_RETRIES}...")

            resp = requests.post(
                url,
                json=payload,
                headers=headers,
                timeout=REQUEST_TIMEOUT_SECONDS,
            )

            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if not candidates:
                    print("Gemini response has no candidates.")
                    return None
                parts = candidates[0].get("content", {}).get("parts", [])
                if not parts:
                    print("Gemini response has no parts.")
                    return None
                text = parts[0].get("text", "").strip()
                result = _parse_recyclability_json(text, source="gemini")
                if result:
                    print(f"Gemini recyclability check succeeded (attempt {attempt}).")
                    return result
                else:
                    print("Gemini returned 200 but response could not be parsed.")
                    return None

            if resp.status_code == 429:
                print(f"Gemini rate-limited (429) on attempt {attempt}. Retrying in {backoff:.1f}s...")
                if attempt < MAX_RETRIES:
                    time.sleep(backoff)
                    backoff *= 2
                    continue
                return None

            if resp.status_code >= 500:
                print(f"Gemini server error ({resp.status_code}) on attempt {attempt}.")
                if attempt < MAX_RETRIES:
                    time.sleep(backoff)
                    backoff *= 2
                    continue
                return None

            error_text = ""
            try:
                error_text = resp.text[:500]
            except Exception:
                pass
            print(f"Gemini API error {resp.status_code}: {error_text}")
            return None

        except requests.exceptions.Timeout:
            print(f"Gemini request timed out (attempt {attempt}).")
            if attempt < MAX_RETRIES:
                time.sleep(backoff)
                backoff *= 2
                continue
            return None

        except requests.exceptions.ConnectionError as e:
            print(f"Gemini connection error (attempt {attempt}): {e}")
            if attempt < MAX_RETRIES:
                time.sleep(backoff)
                backoff *= 2
                continue
            return None

        except Exception as e:
            print(f"Unexpected Gemini error (attempt {attempt}): {e}")
            return None

    return None


# ═══════════════════════════════════════════════════════════════
# PUBLIC API  (unchanged signatures for rest of codebase)
# ═══════════════════════════════════════════════════════════════

def check_recyclability_with_gemini(
    file_bytes: bytes, mime_type: str
) -> RecyclabilityResult | None:
    """
    Try AI providers in order: Groq → Gemini.
    Returns None only if ALL providers fail.
    """
    if not gemini_ready():
        print("No AI API key configured, skipping API call.")
        return None

    # 1. Try Groq first (faster, more generous limits)
    groq_result = _check_with_groq(file_bytes, mime_type)
    if groq_result is not None:
        return groq_result

    # 2. Fallback to Gemini
    gemini_result = _check_with_gemini(file_bytes, mime_type)
    if gemini_result is not None:
        return gemini_result

    print("All AI providers failed for recyclability check.")
    return None


def check_recyclability_by_rules(waste_category: str) -> RecyclabilityResult:
    """Rule-based fallback when AI is unavailable."""
    category = waste_category.lower().replace("-", "_")
    rule = RECYCLABILITY_RULES.get(category, RECYCLABILITY_RULES["dry"])

    return RecyclabilityResult(
        is_recyclable=rule["is_recyclable"],
        reasoning=rule["reasoning"],
        source="rules",
    )


def check_recyclability(
    file_bytes: bytes,
    mime_type: str = "image/jpeg",
    waste_category: str = "dry",
) -> RecyclabilityResult | None:
    """
    Determine recyclability. Tries AI first (Groq → Gemini), falls back to rules.
    Always returns a result (never None) so the frontend always shows data.
    """
    # Try AI providers first
    ai_result = check_recyclability_with_gemini(file_bytes, mime_type)
    if ai_result is not None:
        return ai_result

    # Fallback to rule-based logic
    print(f"Using rule-based recyclability for category: {waste_category}")
    return check_recyclability_by_rules(waste_category)
