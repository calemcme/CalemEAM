# HOME_DIR is the root location of your website. 
# Default XAMPP home directory is /opt/lampp if you have root access, or /home/<username>/www on a production server 
HOME_DIR=/opt/lampp
# This is the location of your php exe file
PHP_EXE=$HOME_DIR/bin/php
# This is the location of your CalemEAM root directory and could also be /$HOME_DIR/CaleamEAM
CALEM_HOME=$HOME_DIR/htdocs/CalemEAM
# Export CALEM_DIR which is used in PHP scripts
export CALEM_DIR=$CALEM_HOME/

