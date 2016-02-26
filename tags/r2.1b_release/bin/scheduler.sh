#!/bin/bash
# reset directory to current script directory
cd `dirname $0`
. env.sh  
$PHP_EXE scheduler/CalemSchedulerCmd.php
