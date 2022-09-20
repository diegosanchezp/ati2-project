# Backend

# Setup development environment

## Install system dependencies
These system dependencies are required, **Linux OS** is preferred.

| System dependency | Version | Usage                   |
|-------------------|---------|-------------------------|
| bash              | 5       | Setup scripts           |
| docker            | >= 20   | Build images            |
| docker-compose    | >= 2    | Development environment |

Activate the server, to test if everything has worked

```bash
runserver
```

Visit `http://127.0.0.1:8000`


# Deployment

- CI/CD is currently made with Github Actions and it is docker based.
- If you don't want a specific action it can be [disabled](https://docs.github.com/en/actions/managing-workflow-runs/disabling-and-enabling-a-workflow).

## Heroku

When the repository is first uploaded,
- It will build a Docker image and push it to Github Container registry
- The Github Action workflow will fail on the first run since we don't have the app created.

Needed dependencies
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli)

Click this button

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Add these [secrets variables](https://docs.github.com/en/actions/security-guides/encrypted-secrets) to Github Actions

- HEROKU_EMAIL, your Heroku account email address
- HEROKU_API_KEY, get this with the cli command `heroku auth:token`
- HEROKU_APP_NAME, the app name that you gave to the Heroku app

Create django superadmin

```bash
APP_NAME=yourappname

heroku run --app "$APP_NAME" python manage.py createsuperuser --username admin --email admin@dev.com
```
