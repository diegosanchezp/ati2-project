#!/bin/bash

# Migrate database
python manage.py migrate --noinput --settings django_src.settings.heroku

# Load data that always is going to be needed, below is an example
# python manage.py loaddata  --settings django_src.settings.heroku fixtures/admin.json
