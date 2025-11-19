# quotes/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Quote
from .serializers import QuoteSerializer
import random


@api_view(["GET"])
def quote_list(request):
    quotes = Quote.objects.all()
    print("Quotes in DB1:", list(quotes.values()))  # OK: QuerySet.values()
    serializer = QuoteSerializer(quotes, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def random_quote(request):
    count = Quote.objects.count()
    if count == 0:
        return Response({"error": "No quotes found"}, status=404)

    random_index = random.randint(0, count - 1)
    quote = Quote.objects.all()[random_index]
    # Optional debug:
    print("Random quote picked:", quote.id, quote.author)
    serializer = QuoteSerializer(quote)
    return Response(serializer.data)


@api_view(["GET"])
def search_quotes(request):
    author = request.GET.get('author', None)
    if author:
        quotes = Quote.objects.filter(author__icontains=author)
        print("Quotes in DB3:", list(quotes.values()))
        serializer = QuoteSerializer(quotes, many=True)
        return Response(serializer.data)

    return Response({"error": "Author query parameter is required"}, status=400)
