date /t && time/t

pushd .
cd /d %OMS%\sim

set CLASSPATH=.;target/classes;libs/*

java -cp %CLASSPATH% it.avn.oms.sim.Sim

popd