import time
import requests
from urllib.parse import quote
from django.db.models import Q
from quotes.models import Quote

API_KEY = "AIzaSyB3hAdAYoKnZ_DNNUgfvOcPHCMxVdNPrxM"
CX = "378dfc05749194cb9"

def get_google_image(author_name: str) -> str | None:
    query = f"{author_name} author portrait"
    url = (
        "https://www.googleapis.com/customsearch/v1"
        f"?key={API_KEY}&cx={CX}&searchType=image&q={quote(query)}"
    )
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
    except Exception:
        return None

    items = resp.json().get("items")
    if not items:
        return None

    # pick the best image (usually first result)
    return items[0].get("link")

print("Finding authors without images...")

authors = (
    Quote.objects
    .filter(Q(image__isnull=True) | Q(image=""))
    .values_list("author", flat=True)
    .distinct()
)

print(f"Found {len(authors)} authors needing images.")

updated = 0
skipped = 0

for author in authors:
    print(f"\nFetching image for: {author}")
    img = get_google_image(author)

    if not img:
        print("  → No image found")
        skipped += 1
        continue

    count = Quote.objects.filter(author=author).update(image=img)
    print(f"  → Updated {count} quotes")
    updated += 1

    # be polite
    time.sleep(1)

print("\nDone!")
print("Updated authors:", updated)
print("Skipped authors:", skipped)
