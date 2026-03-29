@echo off
chcp 65001 >nul
color 0A
title Site Grabber

:: 🔥 Script'in bulunduğu klasöre geç
cd /d "%~dp0"

echo.
echo ===================================================
echo          SITE GRABBER BASLADI
echo ===================================================
echo.

:: 1. dsmart.com.tr
echo [1/4] dsmart.com.tr isleniyor...
call npm run grab --- --site=dsmart.com.tr --output=./sites/dsmart.com.tr/guides.xml
if errorlevel 1 (
    echo.
    echo [HATA] dsmart.com.tr basarisiz oldu!
    echo.
) else (
    echo.
    echo [OK] dsmart.com.tr tamamlandi.
    echo.
)
echo ---------------------------------------------------
echo.

:: 2. tivibu.com.tr
echo [2/4] tivibu.com.tr isleniyor...
call npm run grab --- --site=tivibu.com.tr --output=./sites/tivibu.com.tr/guides.xml
if errorlevel 1 (
    echo.
    echo [HATA] tivibu.com.tr basarisiz oldu!
    echo.
) else (
    echo.
    echo [OK] tivibu.com.tr tamamlandi.
    echo.
)
echo ---------------------------------------------------
echo.

:: 3. turksatkablo.com.tr
echo [3/4] turksatkablo.com.tr isleniyor...
call npm run grab --- --site=turksatkablo.com.tr --output=./sites/turksatkablo.com.tr/guides.xml
if errorlevel 1 (
    echo.
    echo [HATA] turksatkablo.com.tr basarisiz oldu!
    echo.
) else (
    echo.
    echo [OK] turksatkablo.com.tr tamamlandi.
    echo.
)
echo ---------------------------------------------------
echo.

:: 4. tvplus.com.tr
echo [4/4] tvplus.com.tr isleniyor...
call npm run grab --- --site=tvplus.com.tr --output=./sites/tvplus.com.tr/guides.xml
if errorlevel 1 (
    echo.
    echo [HATA] tvplus.com.tr basarisiz oldu!
    echo.
) else (
    echo.
    echo [OK] tvplus.com.tr tamamlandi.
    echo.
)
echo ---------------------------------------------------
echo.

echo.
echo ===================================================
echo           TUM ISLEMLER TAMAMLANDI
echo ===================================================
echo.
pause