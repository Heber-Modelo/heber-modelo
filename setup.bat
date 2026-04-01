@rem Apenas para desenvolvimento, exclusivo para sistemas windows com o winget instalado.

winget install --silent --accept-source-agreements --accept-package-agreements casey.just
winget install --silent --accept-source-agreements --accept-package-agreements pnpm.pnpm
winget install --silent --accept-source-agreements --accept-package-agreements astral-sh.uv

exit /b 0
