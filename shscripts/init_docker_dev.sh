#!/bin/bash

#source .venv/bin/activate && gunicorn --log-level DEBUG --reload --bind 0.0.0.0:8000 django_src.wsgi

source .venv/bin/activate && \
pushd ./backend && \
gunicorn --log-level DEBUG --reload --bind 0.0.0.0:8000 django_src.wsgi
# python manage.py runserver 0.0.0.0:8000
