@echo off
rem FluxVerse CityWatch - CEO city progress viewer (read-only, zero interference).
rem Group U060 silent pattern: wscript wrapper, no console flash.
wscript.exe //B //nologo "%~dp0..\Tools\devloop\InvisibleRunner.vbs" powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0city-watch.ps1" -Open
