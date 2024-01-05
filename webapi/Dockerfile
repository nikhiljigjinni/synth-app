FROM python:3.12 as python-base

RUN mkdir /code
WORKDIR /code

COPY pyproject.toml poetry.lock ./

RUN pip install poetry==1.4.2

RUN poetry install --without dev && rm -rf ~/.cache/pypoetry/{cache,artifacts}

COPY ./src /code/src

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
