#!/bin/sh

. /etc/profile

cd $OMS_HOME/scada

export CLASSPATH=target/xfer.jar:libs/*
export LOG=logs/pmcError.txt
date >> $LOG
echo "cp=$CLASSPATH" >> $LOG
pwd >> $LOG
whoami >> $LOG

java -cp $CLASSPATH it.avn.oms.pmc.Pmc >>$LOG 2>&1 &

echo "pidfile=$PMC_PID" >> $LOG 2>&1
if [ ! -z "$PMC_PID" ]; then
  echo $! > "$PMC_PID"
fi
date >> $LOG

