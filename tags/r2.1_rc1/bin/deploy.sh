#!/bin/bash

. env.sh
CALEM_BUILD=0
export CALEM_BUILD
# process inputs
for i in $*
	do
	case "$1" in
		build)
	        CALEM_BUILD=1
			export CALEM_BUILD
	      ;;
	esac
	done	  
$PHP_EXE $CALEM_HOME/build/CalemZipJsCmd.php
