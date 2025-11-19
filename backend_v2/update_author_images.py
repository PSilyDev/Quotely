import time
import requests
from urllib.parse import quote
from django.db.models import Q
from quotes.models import Quote

WIKI_SEARCH_API = "https://en.wikipedia.org/w/api.php"
WIKI_MEDIA_LIST_API = "https://en.wikipedia.org/api/rest_v1/page/media-list/"

def search_wikipedia_title(author_name: str) -> str | None:
    if not author_name or author_name.lower() in {"unknown", "anonymous"}:
        return None

    params = {
        "action": "query",
        "list": "search",
        "srsearch": author_name,
        "srlimit": 1,
        "format": "json",
    }

    try:
        resp = requests.get(WIKI_SEARCH_API, params=params, timeout=5)
        resp.raise_for_status()
    except Exception:
        return None

    results = resp.json().get("query", {}).get("search", [])
    if not results:
        return None

    return results[0].get("title")


def get_wikipedia_image(author_name: str) -> str | None:
    title = search_wikipedia_title(author_name)
    if not title:
        return None

    url = WIKI_MEDIA_LIST_API + quote(title)

    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
    except Exception:
        return None

    items = resp.json().get("items", [])
    if not items:
        return None

    # Prefer the lead portrait image
    for item in items:
        if item.get("leadImage") and item.get("type") == "image":
            src = None
            srcset = item.get("srcset") or []
            if srcset:
                src = srcset[0].get("src")
            if not src:
                src = item.get("src")
            if not src:
                continue
            if src.startswith("//"):
                src = "https:" + src
            return src

    # Fallback: first image item
    for item in items:
        if item.get("type") == "image":
            src = None
            srcset = item.get("srcset") or []
            if srcset:
                src = srcset[0].get("src")
            if not src:
                src = item.get("src")
            if not src:
                continue
            if src.startswith("//"):
                src = "https:" + src
            return src

    return None


print("Finding authors without images...")

authors = (
    Quote.objects
    .filter(Q(image__isnull=True) | Q(image=""))
    .values_list("author", flat=True)
    .distinct()
)

print(f"Found {len(authors)} authors needing images.")

updated_authors = 0
skipped_authors = 0

for author in authors:
    print(f"\nLooking up image for: {author!r}")
    image_url = get_wikipedia_image(author)

    if not image_url:
        print("  → No image found.")
        skipped_authors += 1
        continue

    count = Quote.objects.filter(author=author).update(image=image_url)
    print(f"  → Set image for {count} quotes: {image_url}")
    updated_authors += 1

    time.sleep(0.4)  # be polite to Wikipedia

print("\nDone.")
print("Authors updated:", updated_authors)
print("Authors with no image:", skipped_authors)
