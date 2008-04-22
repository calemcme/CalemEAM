call ..\env.bat

echo load sample data
%PHP_EXE% ..\..\server\setup\LoadSampleDataCmd.php
