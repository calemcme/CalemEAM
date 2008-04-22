call ..\env.bat

echo Run upgrade command
%PHP_EXE% %CALEM_DIR%/server/upgrade/CalemUpgradeCmd.php r2-0-1 r1-0-2
