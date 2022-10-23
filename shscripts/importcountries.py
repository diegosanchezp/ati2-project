import os
import sys
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent  # The root of this repo
# Add the backend dir so we can resolve imports
sys.path.append(str(BASE_DIR / "backend"))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_src.settings.development')

try:
    import django
except ImportError as exc:
    raise ImportError(
        "Couldn't import Django. Are you sure it's installed and "
        "available on your PYTHONPATH environment variable? Did you "
        "forget to activate a virtual environment?"
    ) from exc

# Load django models
django.setup()

from django.db import transaction
from django.conf import settings
from django.apps import apps

Country = apps.get_model('country', 'Country')
State = apps.get_model('country', 'State')
City = apps.get_model('country', 'City')
Currency = apps.get_model('finance', 'Currency')

def main(filename="countries+states+cities-small"):
    with open(settings.BASE_DIR / "fixtures" / f"{filename}.json", mode="r", encoding="utf-8") as f:
        # Read json file
        countries = json.load(f)

        with transaction.atomic():
            for country in countries:
                ctry = Country(
                    id=country["id"],
                    name=country.get("name"),
                    continent=country.get("region"),
                    subregion=country.get("subregion"),
                    iso3=country.get("iso3"),
                    numeric_code = country.get("numeric_code"),
                    iso2=country.get("iso2"),
                    phonecode=country.get("phone_code"),
                    capital=country.get("capital"),
                )

                ctry.save()

                # Currency
                Currency.objects.get_or_create(
                    name=country.get("currency_name"),
                    code=country.get("currency"),
                    country=ctry
                )

                for state in country["states"]:
                    s = State(
                        id=state["id"],
                        name=state.get("name"),
                        country=ctry
                    )

                    s.save()

                    for city in state["cities"]:
                        c = City(
                            id=city["id"],
                            name=city.get("name"),
                            state=s,
                        )
                        c.save()

if __name__ == "__main__":
    main()

# China
# US
# Japan
# Venezuela
