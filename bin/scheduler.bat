REM Reset working directory to current directory
cd /d %~dp0
call env.bat

%PHP_EXE% scheduler\CalemSchedulerCmd.php
