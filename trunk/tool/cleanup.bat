echo Clean up sessions
c:
cd .. 
SET HOME_DIR=%CD%

cd %HOME_DIR%\server\cache\session
del /Q *.*

cd %HOME_DIR%\custom\group\CALEM_OOB\backup
del /Q *.*

cd %HOME_DIR%\custom\user\1001\backup
del /Q *.*

cd %HOME_DIR%\custom\global\message\backup
del /Q *.*

cd %HOME_DIR%\custom\global\metadata\backup
del /Q *.*

cd %HOME_DIR%\custom\global\dropdown\backup
del /Q *.*

cd %HOME_DIR%\server\conf
ren install.php inst.php
del /Q install.php.*
ren inst.php install.php

cd %HOME_DIR%
