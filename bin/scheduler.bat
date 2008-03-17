REM To run this script with a scheduler uncomment next line and set the path to the bin directory of your installation
REM cd \wamp\www\CalemEAM\bin
call env.bat

%PHP_EXE% scheduler\CalemSchedulerCmd.php
