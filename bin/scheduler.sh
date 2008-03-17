#!/bin/bash
# To run this script with a scheduler uncomment next line and set the path to the bin directory of your installation
# cd /opt/lampp/htdocs/CalemEAM/bin
. env.sh  
$PHP_EXE scheduler/CalemSchedulerCmd.php
