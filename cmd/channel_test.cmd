@echo off
title IPTV Test Runner
color 0A

:: 🔥 Script'in bulunduğu klasöre geç
cd /d "%~dp0"

:: Başlangıç ekranı
cls
echo ==========================================
echo        IPTV TEST CALISTIRICI v1.1
echo ==========================================
echo.
echo Calisma dizini: %cd%
echo.
timeout /t 2 >nul

:: 1. TEST
cls
echo ==========================================
echo   [1/4] dsmart.com.tr TEST EDILIYOR
echo ==========================================
echo.
call npm test --- dsmart.com.tr
echo.
echo Tamamlandi!

:: 2. TEST
echo ==========================================
echo   [2/4] tivibu.com.tr TEST EDILIYOR
echo ==========================================
echo.
call npm test --- tivibu.com.tr
echo.
echo Tamamlandi!

:: 3. TEST
echo ==========================================
echo   [3/4] turksatkablo.com.tr TEST EDILIYOR
echo ==========================================
echo.
call npm test --- turksatkablo.com.tr
echo.
echo Tamamlandi!

:: 4. TEST
echo ==========================================
echo   [4/4] tvplus.com.tr TEST EDILIYOR
echo ==========================================
echo.
call npm test --- tvplus.com.tr
echo.
echo Tamamlandi!

:: Bitiş
color 0B
echo ==========================================
echo        TUM TESTLER TAMAMLANDI
echo ==========================================
echo.
pause >nul
exit