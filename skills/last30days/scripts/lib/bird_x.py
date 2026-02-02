"""Bird CLI wrapper for X (Twitter) discovery."""

import json
import re
import subprocess
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional

from . import http


def _log_error(msg: str):
    """Log error to stderr."""
    sys.stderr.write(f"[BIRD ERROR] {msg}\n")
    sys.stderr.flush()


# Depth configurations: (min, max) posts to request
# Bird uses -n for count. We'll aim for the max items.
DEPTH_CONFIG = {
    "quick": 12,
    "default": 30,
    "deep": 60,
}


def search_x(
    topic: str,
    from_date: str,
    to_date: str,
    depth: str = "default",
    mock_response: Optional[List[Dict]] = None,
) -> List[Dict[str, Any]]:
    """Search X for relevant posts using bird CLI.

    Args:
        topic: Search topic
        from_date: Start date (YYYY-MM-DD)
        to_date: End date (YYYY-MM-DD)
        depth: Research depth - "quick", "default", or "deep"
        mock_response: Mock response for testing

    Returns:
        List of item dicts (already parsed)
    """
    if mock_response is not None:
        return parse_bird_response(mock_response)

    count = DEPTH_CONFIG.get(depth, DEPTH_CONFIG["default"])

    # Construct bird command
    # bird search "<query>" -n <count> --json --plain
    # We add date filters to the query: "topic since:2023-01-01 until:2023-01-31"
    query = f"{topic} since:{from_date} until:{to_date}"
    
    cmd = [
        "bird",
        "search",
        query,
        "-n", str(count),
        "--json",
        "--plain"
    ]
    
    if http.DEBUG:
         print(f"[DEBUG] Running bird command: {' '.join(cmd)}", file=sys.stderr)

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False  # Don't raise, check return code manually
        )
    except FileNotFoundError:
        _log_error("bird CLI not found. Please install it with 'npm i -g bird'")
        return []
    except Exception as e:
        _log_error(f"Failed to run bird: {e}")
        return []

    if result.returncode != 0:
        _log_error(f"bird command failed: {result.stderr}")
        return []

    try:
        data = json.loads(result.stdout)
        # bird output is a list of tweets directly, or sometimes { tweets: [] } if paginated?
        # Based on my test run, it returned a list [ ... ].
        # However, documentation says: "When using --json with pagination ... output is { tweets, nextCursor }."
        # We are not using pagination flags explicitely beyond -n, but let's be safe.
        
        items = []
        if isinstance(data, list):
            items = data
        elif isinstance(data, dict):
            items = data.get("tweets", [])
            if not items and "items" in data: # Fallback just in case
                items = data.get("items", [])
        
        return parse_bird_response(items)

    except json.JSONDecodeError as e:
        _log_error(f"Failed to parse bird JSON output: {e}")
        if http.DEBUG:
             _log_error(f"Raw output: {result.stdout}")
        return []


def parse_bird_response(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Parse bird JSON items to internal items.

    Args:
        items: List of raw bird tweet objects

    Returns:
        List of item dicts
    """
    clean_items = []
    
    for i, item in enumerate(items):
        if not isinstance(item, dict):
            continue

        # Extract basic fields
        tweet_id = item.get("id")
        text = item.get("text", "")
        
        # Author info
        author = item.get("author", {})
        username = author.get("username", "") if isinstance(author, dict) else ""
        
        if not tweet_id or not username:
            continue

        url = f"https://x.com/{username}/status/{tweet_id}"

        # Parse date
        # Format: "Tue Jan 27 03:28:47 +0000 2026"
        created_at = item.get("createdAt")
        date_str = None
        if created_at:
            try:
                # "Tue Jan 27 03:28:47 +0000 2026"
                dt = datetime.strptime(created_at, "%a %b %d %H:%M:%S %z %Y")
                date_str = dt.strftime("%Y-%m-%d")
            except ValueError:
                pass

        # Engagement
        engagement = {
            "likes": int(item.get("likeCount", 0)),
            "reposts": int(item.get("retweetCount", 0)),
            "replies": int(item.get("replyCount", 0)),
            "quotes": int(item.get("quoteCount", 0)),
        }

        # Relevance
        # Bird doesn't give relevance score like xAI prompt does.
        # We'll default to 1.0 since it matched the keyword search.
        relevance = 1.0 
        why_relevant = "Matched search query via bird CLI"

        clean_item = {
            "id": f"X{i+1}",
            "text": str(text).strip()[:500],
            "url": url,
            "author_handle": username,
            "date": date_str,
            "engagement": engagement,
            "why_relevant": why_relevant,
            "relevance": relevance,
        }

        clean_items.append(clean_item)

    return clean_items
