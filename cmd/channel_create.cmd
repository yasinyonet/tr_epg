@echo off
chcp 65001 >nul
color 0B
title Channels Parser

:: 🔥 Script'in bulunduğu dizine geç
cd /d "%~dp0"

echo.
echo ===================================================
echo   CHANNELS PARSER BASLADI
echo ===================================================
echo.

:: 1. dsmart.com.tr
echo [1/4] dsmart.com.tr kanallar cekiliyor...
call npm run channels:parse -- --config=./sites/dsmart.com.tr/dsmart.com.tr.config.js --output=./sites/dsmart.com.tr/dsmart.com.tr.channels.xml
if errorlevel 1 (
    echo [HATA] dsmart.com.tr
) else (
    echo [OK] dsmart.com.tr
)
echo.

:: 2. tivibu.com.tr
echo [2/4] tivibu.com.tr kanallar cekiliyor...
call npm run channels:parse -- --config=./sites/tivibu.com.tr/tivibu.com.tr.config.js --output=./sites/tivibu.com.tr/tivibu.com.tr.channels.xml
if errorlevel 1 (
    echo [HATA] tivibu.com.tr
) else (
    echo [OK] tivibu.com.tr
)
echo.

:: 3. turksatkablo.com.tr
echo [3/4] turksatkablo.com.tr kanallar cekiliyor...
call npm run channels:parse -- --config=./sites/turksatkablo.com.tr/turksatkablo.com.tr.config.js --output=./sites/turksatkablo.com.tr/turksatkablo.com.tr.channels.xml
if errorlevel 1 (
    echo [HATA] turksatkablo.com.tr
) else (
    echo [OK] turksatkablo.com.tr
)
echo.

:: 4. tvplus.com.tr
echo [4/4] tvplus.com.tr kanallar cekiliyor...
call npm run channels:parse -- --config=./sites/tvplus.com.tr/tvplus.com.tr.config.js --output=./sites/tvplus.com.tr/tvplus.com.tr.channels.xml
if errorlevel 1 (
    echo [HATA] tvplus.com.tr
) else (
    echo [OK] tvplus.com.tr
)
echo.

echo ===================================================
echo   TUM ISLEMLER TAMAMLANDI
echo ===================================================
echo.
pause