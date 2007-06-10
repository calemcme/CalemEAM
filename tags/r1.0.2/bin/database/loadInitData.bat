call ..\env.bat

echo load init data
%PHP_EXE% ..\..\server\setup\LoadInitDataCmd.php
