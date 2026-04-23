# Apenas para desenvolvimento, não faz parte do programa em si
set shell := ["zsh", "-c"]
set windows-shell := ["powershell.exe", "-C"]

[default]
refresh:
    pnpm run compile-scss
    pnpm run compile-ts
    ./gradlew bootJar

build-docs:
    uv run mkdocs build --clean --no-directory-urls --site-dir ./src/main/resources/static/docs

run-as-dev:
    ./gradlew bootRun --args="springs.profiles.active=local"

setup:
    pnpm install
    uv sync --dev
    uv run pre-commit install

compile-sources:
    pnpm run compile-scss
    pnpm run compile-ts
    uv run mkdocs build --clean --no-directory-urls --site-dir ./src/main/resources/static/docs
