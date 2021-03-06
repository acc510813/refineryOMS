@echo off
rem archive history and transfer tables
rem Usage:   archive.bat db-pwd number-of-months-to-keep
rem          archive.bat pwd 1  --will keep the last month of history and transfers

rem Note: the date on the file will be the date the archive was made

rem  thanks to Antonio Perez Ayala
rem  https://stackoverflow.com/questions/11210997/windows-console-date-math

pushd .
echo -----------------------
cd /d %OMS_HOME%\db\archive
echo %date% >>archive.log
set yy=%date:~10,4%
set mm=%date:~4,2%
set dd=%date:~7,2%
rem echo %mm% >>archive.log
set /a dd=10%dd% %% 100, mm=10%mm% %% 100
set /a A=YY/100, B=A/4, C=2-A+B, E=36525*(YY+4716)/100, F=306*(MM+1)/10, JDN=C+DD+E+F-1524

set /a nd=jdn

set /a W=(%nd%*100-186721625)/3652425, X=W/4, A=%nd%+1+W-X, B=A+1524, C=(B*100-12210)/36525, D=36525*C/100, E=(B-D)*10000/306001, F=306001*E/10000, DD=B-D-F, MM=E-1, YY=C-4716
IF %MM% GTR 12 SET /A MM-=12, YY+=1
IF %DD% LSS 10 SET DD=0%DD%
IF %MM% LSS 10 SET MM=0%MM%
set /a pd=%YY%%MM%%DD%

rem echo %pd% >>archive.log

rem extract and purge the alarm table

mysqldump -uoms -p%1 oms alarm --no-create-info --where "create_dt < date_sub(sysdate(), interval %2 month) and acknowledged = 'Y'" --result-file=alarm.archive
rename "alarm.archive" alarm-%pd%.arch
gzip alarm-%pd%.arch

mysql -uoms -p%1 -Doms --execute="set @days=%2; delete from alarm where create_dt < date_sub(sysdate(), interval %2 month) and acknowledged = 'Y'"
mysql -uoms -p%1 -Doms -E --execute="select min(create_dt) as 'minAlarmDate' from alarm;" >>archive.log


rem extract and purge the history table

mysqldump -uoms -p%1 oms history --no-create-info --where "create_dt < date_sub(sysdate(), interval %2 month)" --result-file=history.archive
rename "history.archive" history-%pd%.arch
gzip history-%pd%.arch

mysql -uoms -p%1 -Doms --execute="set @days=%2; delete from history where create_dt < date_sub(sysdate(), interval %2 month)"
mysql -uoms -p%1 -Doms -E --execute="select min(create_dt) as 'minHistoryDate' from history;" >>archive.log

rem extract and purge the transfer table

mysqldump -uoms -p%1 oms transfer --no-create-info --compact --where "create_dt < date_sub(sysdate(), interval %2 month) and transfer_type_id <> 7" --result-file=transfer.archive

rename "transfer.archive" transfer-%pd%.arch
gzip transfer-%pd%.arch

mysql -uoms -p%1 -Doms --execute="set @days=%2; delete from transfer where create_dt < date_sub(sysdate(), interval %2 month) and transfer_type_id = (select id from transfer_type_vw where code='X')"

mysql -uoms -p%1 -Doms -E --execute="select min(create_dt) as 'minTransferDate' from transfer where transfer_type_id = (select id from transfer_type_vw where code='X');" >>archive.log

rem extract and purge the shipment_item table

mysqldump -uoms -p$pwd oms shipment_item --no-create-info --compact --where "create_dt < date_sub(sysdate(), interval $int month) and active not in ('A','P')" --result-file=shipment_item.archive
rename "shipment_item.archive" shipment_item-%pd%.arch
gzip shipment_item-%pd%.arch

mysql -uoms -p$pwd -Doms --execute="set @months=$int; delete from shipment_item where create_dt < date_sub(sysdate(), interval @months month) and active not in ('A','P')"
mysql -uoms -pomsx -Doms -E -e"select min(create_dt) as 'minOrderItemDate' from shipment_item" >>archive.log

rem extract and purge the shipment table

mysqldump -uoms -p$pwd oms shipment --no-create-info --compact --where "create_dt < date_sub(sysdate(), interval $int month) and active = 'A')" --result-file=shipment.archive
rename shipment.archive shipment-%pd%.arch
gzip shipment-%pd%.arch

mysql -uoms -p$pwd -Doms --execute="set @months=$int; delete from shipment where create_dt < date_sub(sysdate(), interval @months month) and shipment_id not in (select shipment_id from shipment_item)"
mysql -uoms -pomsx -Doms -E -e"select min(create_dt) as 'minOrderDate' from shipment" >>archive.log

popd
