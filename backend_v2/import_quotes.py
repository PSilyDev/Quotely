import json
from quotes.models import Quote

print("Loading JSON file...")

with open("quotes.json", encoding="utf-8") as f:
    data = json.load(f)

print("Total records in JSON:", len(data))

created_count = 0
skipped_count = 0

for item in data:
    # Kaggle fields: "Quote", "Author", "Tags", "Popularity", "Category"
    text = (item.get("Quote") or "").strip()
    author = (item.get("Author") or "").strip() or "Unknown"
    genre = (item.get("Category") or "").strip() or "General"

    if not text:
        skipped_count += 1
        continue

    obj, created = Quote.objects.get_or_create(
        text=text,
        author=author,
        defaults={
            "genre": genre,
            "image": "",  # no image in dataset
        },
    )

    if created:
        created_count += 1
    else:
        skipped_count += 1

print("Imported:", created_count, "quotes")
print("Skipped:", skipped_count, "quotes")
