call ..\init.bat

echo Create DB schema
%PHP_EXE% ..\..\server\setup\CreateSchemaCmd.php
