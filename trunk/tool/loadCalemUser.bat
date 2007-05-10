set PHP_DIR=c:\wamp\php
set PHP_EXE=%PHP_DIR%\php.exe

echo load calem for design
cd calem_setup
%PHP_EXE% CalemLoadDesignUser.php
cd ..
