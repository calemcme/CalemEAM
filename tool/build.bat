set PHP_DIR=c:\wamp\php
set PHP_EXE=%PHP_DIR%\php.exe

echo Compress script files
%PHP_EXE% ..\build\CalemZipJsCmd.php

set CALEM_URI=CalemEAM/main
set CALEM_DIR=c:\wamp\www\CalemEAM\main\

if a_%1==a_client goto client
if a_%1==a_all goto client
goto clientdone
:client


echo Starting Browser test - FireFox
rem start "FF test suite" "C:\Program Files\Mozilla Firefox\firefox.exe"  -height 600 -width 800 "http://localhost/%CALEM_URI%/client/ztests/jsunit/testRunner.html?testpage=localhost/%CALEM_URI%/client/ztests/jsCalemosTestSuites.php&autorun=true" -new-tab "http://localhost/%CALEM_URI%/client/ztests/CalemEAM/beta1/common/desktop/systemTestCalemFormTabView.php?loadmode=gzip&loopCount=50"
start "FF test suite" "C:\Program Files\Mozilla Firefox\firefox.exe"  -height 600 -width 800 "http://localhost/%CALEM_URI%/test/client/jsunit/testRunner.html?testpage=localhost/%CALEM_URI%/test/client/jsCalemTestSuites.php&autorun=true" -new-window "http://localhost/%CALEM_URI%/test/client/calemeam/common/desktop/systemTestCalemFormTabView.php?loadmode=gzip&loopCount=50"
rem start "FF desktop test" "C:\Program Files\Mozilla Firefox\firefox.exe" -height 600 -width 800 -new-window "http://localhost/CalemEAM/beta1/client/ztests/calemeam/common/desktop/systemTestCalemFormTabView.php"

echo Starting Browser test - IE
start "IE test suite" "C:\Program Files\Internet Explorer\IEXPLORE.EXE" "http://localhost/%CALEM_URI%/test/client/calemeam/common/desktop/systemTestCalemFormTabView.php?loadmode=gzip&loopCount=50"
start "IE desktop test" "C:\Program Files\Internet Explorer\IEXPLORE.EXE" "http://localhost/%CALEM_URI%/test/client/jsunit/testRunner.html?testpage=localhost/%CALEM_URI%/test/client/jsCalemTestSuites.php&autorun=true"

:clientdone

if a_%1==a_server goto server
if a_%1==a_all goto server
goto serverdone

:server

set PHING_DIR=c:\wamp\php
set CALEM_BATCH_TEST=1
call %PHING_DIR%/phing.bat

:serverdone
