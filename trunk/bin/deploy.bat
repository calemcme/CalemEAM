call env.bat

echo Compress script files
set CALEM_BUILD=0
if "%1"=="build" (
  set CALEM_BUILD=1
)
%PHP_EXE% ..\build\CalemZipJsCmd.php
