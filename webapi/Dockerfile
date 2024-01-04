FROM python:3.12-buster

RUN pip install poetry==1.4.2

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /code

COPY pyproject.toml poetry.lock ./
COPY src ./src

RUN poetry install --without dev && rm -rf $POETRY_CACHE_DIR

# ENTRYPOINT [""]
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "80"]