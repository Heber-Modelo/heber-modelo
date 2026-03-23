# Apenas para desenvolvimento, não faz parte do programa em si
set shell := ["zsh", "-c"]
set windows-shell := ["powershell.exe", "-C"]

[default]
refresh:
    pnpm run compile-scss
    pnpm run compile-ts
    uv run mkdocs --clean --no-directory-ulrs --site-dir ./src/main/resources/docs
    ./gradlew bootJar

setup:
    ./setup.bat
    pnpm install
    uv sync --dev
    uv run pre-commit install

compile-sources:
    pnpm run compile-scss
    pnpm run compile-ts
    uv run mkdocs --clean --no-directory-ulrs --site-dir ./src/main/resources/docs
