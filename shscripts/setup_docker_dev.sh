#!/bin/bash

# Setup the django docker container for development
# This script executes inside the docker container

PIPCACHE_DIR=./.pipcache
VENV_DIR=.venv
# Create virtual enviroment
python -m venv "$VENV_DIR" && \

# Make a cache folder for python dependencies
mkdir "$PIPCACHE_DIR"

pushd ./backend && \
# create static dir
mkdir ./static

# back on root
pushd - && \

# Activate virtual enviroment
source "$VENV_DIR/bin/activate" && \
# Install pipenv first
pip install --cache-dir "$PIPCACHE_DIR" pipenv && \

# Install the rest of python dependencies with pipenv 
pipenv install -d && \
# Apply django migrations

# back on backend dir
pushd - && \

python manage.py migrate && \
# Add predefined admin superuser for development
python manage.py loaddata ./fixtures/admin.json
