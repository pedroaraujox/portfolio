@echo off
echo ==========================================
echo Preparando para deploy na Vercel...
echo ==========================================
echo.
echo 1. Verificando build...
call npm run build
if %errorlevel% neq 0 (
    echo Erro no build. Verifique os logs acima.
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Iniciando Vercel CLI...
echo Voce precisara fazer login e responder algumas perguntas (aceite os padroes com Enter).
echo.
call npx vercel
echo.
pause
