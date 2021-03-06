## OMS ("Oil Movement System")

This project provides a simulation of an oil refinery w/a UI for watching/controlling the action.  Controlling is a bit of a misnomer, since the only real control currently is in the management of transfers.  The "action" occurs in "real" time, that is, there is no compression of time to make the action happen faster.

**DISCLAIMER 1:**  The provided picture and DB is of the Delaware City, Delaware refinery.  There has been no communication between me and the past or present owners of this site about the nature of their refinery.  If there is any correlation between this implementation and the actual site, it is strictly co-incidental.  I have made some use of my (meager) knowledge to distinguish (correctly, I hope) between crude tanks and refined product tanks. 

**DISCLAIMER 2:**  This is my re-interpretation of a system I worked on early in my career.  There is no relationship between this system and the original OMS produced by that employer, even though I have borrowed the name.  Any mistakes in this re-interpretation are, of course, mine.  The original system had a single page menu whose items were activated by a light pen and location of the pen.  There was a hidden location from which Star Trek could be run.  That particular feature has not been carried over.

**DISCLAIMER 3:**  The historical compression algorithms are my implementations of some algorithms originally developed at another employer.  FWIW, while I had access to the code that implemented these, I do not currently have access nor do I remember the details. (It was a long time ago.) That employer bears no responsibility for any errors in my implementations. 

**Terminology clarification:  I usually use braces (curly brackets) to indicate the replacement of that with the value of the symbol/environment variable, e.g., {OMS_HOME} is replaced with /

There are a number of features which have not (yet) been implemented.  These include, but are not limited to 
- [x] Linux installation procedures.
- [ ] On the field displays, selecting a tank, will generate a more detailed display of the tank selected.  While cute, I'm not sure of the value of this.  The information the system has on a tank is the volume, temperature corrected volume (future), level, temperature, and some configuration values.  Is this worth a special page to display?
- [ ] digital input processing [the full implementation of this would be associated w/inputs indicating the presence of tank cars, tank trucks and ships (set by the simulator based on a schedule defined somewhere or a random number ) and on cute animations of transfers]
- [x] analog output processing (the assumption is that these are setpoints.  For the simulator to respond "realistically", we need to define the input(s) which reflects the actions of the setpoint which would imply needing to understand the reaction time (IIRC, dead time) to the set point. Sorry, TMI required).  **Sortof implemented, i.e., not realistically.  At the very least, it needs a DEAD_TIME field in the table.  Added a table (SIM_IO) which relates the output tag (ID) to the input tag (IN_ID).  Also added a field (IS_NEW) to the ANALOG_OUTPUT (and DIGITAL_OUTPUT) table(s) to indicate when an output has been requested, i.e., that the SCAN_VALUE for these tables has been updated.**
- [x] digital output processing (like the analog outputs, the effect of a digital output is shown in some other value, e.g., the status of a valve or an analog value, like a pump or valve position) **See comment for analog outputs, above**
- [ ] implementation of digital inputs to more realistically handle tank car, tank truck, and ship presence
- [ ] temperature correction of the volumes (http://www.oilconsultancy.com/pdf/warm-fuel.pdf; http://www.emerson.com/documents/automation/-engineer%E2%80%99s-guide-to-tank-gauging-en-175314.pdf).  Standard temperature 15 deg C. It turns out this is a non-trivial problem, despite all the talk in the second article about it being computerized.
- [ ] simulated arrival of additional crude for processing
- [ ] automated transfers for refined products to tank cars (railroads), tank trucks, and ships.  There is a first pass implementation of this, but it needs additional testing.  For this to work properly, it should be possible to set up transfers to the tank cars and or tank trucks for multiple products and the transfers end up being multiply defined.  In addition, the presence of a given tank car/truck would ideally have a product associated with it.
- [ ] graphical display of transfers (cute animations!).  **Schematics are a more static implmentation of this.  The idea here is to list the active transfers in the schematics list (done) and the display of the schematic will show the various sources and destinations w/pipes, pumps, and valves.**
- [x] computed variables (implemented w/an RPN, e.g., post-fix, but only allows analog inputs.)
- [x] an archival mechanism for the historical data **db/archive.bat; db/archive.sh**
- [ ] automated payment
- [x] watchdog to notification that applications are down
- [ ] user manual

The application is built using a Java-based REST data source (Tomcat/Spring) which references a MySQL database.  The UI is implemented in react.  Underlying the UI and the database are some ancillary programs, all implemented in Java.  

-  The transfer service automatically creates transfers based on transfer templates
-  The SCADA/PMC service transfers values between the RAW_DATA table to the appropriate type table (analog/digital input/output) and saves the data
-  The simulator generates semi-realistic values for the values based on the temperature (fetched from the USWS), the transfer definitions, and the refinery output fractions.  Both the temperature location and the refinery output fractions are defined in the CONFIG table and are accessible via the admin UI.  Note that "real" data could be provided from actual devices if the simulator was replaced with a scanner to read those devices.
-  The watchdog checks the watchdog table to verify that the update count is changing on the active records.  If not, it sends an email to the contents of the CONFIG WATCHDOG_EMAIL.  There are additional parameters used to configure the watchdog email:   EMAIL_FROM, EMAIL_PWD, EMAIL_USER, SMTP_HOST, and SMTP_PORT.  In the utility to extract the data from the CONFIG table (ExtractDB.php), these values are all set to lower case versions of their item name.


There are additional files provided to enable creation of the services for Windows users.
-  start the simulator, transfer, scada/pmc and watchdog services (createScheduledJobs.bat)
-  purge log files for Tomcat and the services.  Note that the purgeOMSLogs.bat and purgeOMSLogs.bat need to be modified to correctly set the directory in which they are located.
-  save the database every night. (db/extractDB.bat)

## Installation - So you've pulled the repo into {oms}.


### Required products:

The following are assumed to be installed:

    -  MariaDB
    -  Java (Version 8 or greater)
    -  Tomcat 8
    -  node/npm
    -  react-konva, rechart, moment, victory
    -  php (used to load DB and extract DB configuration)
    -  Developers: Eclipse/your favorite IDE (the projects use Maven dependencies)

### Assumptions:

For the startup procedures, the Linux installation is assumed to be in /usr/share/oms.

There is also an assumption that whoever's doing this is conversant w/the above products and the languages used for this.  The languages used are:

   -  Java - for the webapp, which is only used as a set of REST services for the React app to consume.  Java is also used for the transfer, scada (pmc), simulate, and watchdog programs.
             
   -  ECMAscript (JavaScript) - for the React-based UI.
    
   -  SQL  - Shouldn't need to know this unless you're updating the services
    
   -  PHP - there are some utilities written in PHP which are leftovers from the original UI.  There is a PHP based version of the UI which has not been updated since the UI was converted to React.
   
   -  powershell needs its execution policy set correctly to run the purge log scripts.  If you're not worried about security, then "set-executionpolicy unrestricted" will work.

### Things to know:

   1.  The DB instance is "oms", the username is "oms" and the password is "omsx".  If you want to change these, then you'll need to make lots of changes.  The places to look for these are in db/includes/constants.php, the various application context (app_context.xml, application_context.xml) files in the Java services, and the extractDB.bat

   1.  Tomcat has the CORS filters set up.  If you want to continue running the UI from npm, you'll need to do this.
   ```
   ** Allowed Origins **
   http://localhost:3000  (may vary...)
   ** Allowed Methods **
   GET, POST, PUT
   ** Allowed Headers **
   Content-Type,Cache-Control,X-Requested-With,Accept,Authorization,Origin,Access-Control-Request-Method,Access-Control-Request-Headers
   ```
   
   1.  Tomcat also has Smap suppression set for JSP page compilers, which apparently is required.
   ```
        <init-param>
            <param-name>suppressSmap</param-name>
            <param-value>true</param-value>
        </init-param>
   ```
   
To configure this 
       
   1.  If you don't like my colors, the background and text color are defined in the oms.css file and in various js and html files.  The alarm colors can be changed in the System  Configuration Admin page, as NORMCOLOR, HHCOLOR, HICOLOR, LOCOLOR, LLCOLOR.  The background color is "midnightblue"
   
   1.  The I/O devices are configured using the ```device``` table.  The simulator should always be device id 1.  The weather station device actually retrieves the current weather conditions from the US weather service, e.g., https://w1.weather.gov/xml/current_obs/KILG.xml. The "KILG" is the code for the Wilmington/New Castle County, DE airport.  This is defined in the config table w/item_name='WEATHER_LOCATION' and can be changed in the System Configuration Admin.  See http://w1.weather.gov/xml/current_obs/seek.php to locate XML weather observation feeds available.  Eh, might be KTME, the Katy, TX executive airport.  NOAA has a new API, https://api.weather.gov/stations/XXXX/observations/current which has been configured here to use the JSON data return.  See https://www.weather.gov/documentation/services-web-api for additional information.   The weather station is defined in its own package.

### To Install:

   1.  Create environment variables OMS_HOME and OMS_LOGS.  Create an oms user to use as the account under which these process will run.  
   
   1.  Set up a mySQL DB instance and knows the user name and password.  Create the user(s).  Using a single user, i.e., "oms" allows  anyone w/the oms password to change your schema, which is probably not desirable, but unless this is a production system (unlikely), then security is probably not a high priority.  For that matter, the default  password for the OMS schema is not secure.  Change the 'omsx' as so desired

    ```
          create schema oms;                   
          create user oms identified by "omsx";
    ```
- if security desired

    ```
    #---create user omssys identified by "{systempwd}";
    grant all privileges on oms.* to omssys;
    grant select, update, insert on oms.* to oms;
    grant delete on oms.rel_tag_tag to oms;
    grant delete on oms.user_role to oms;
    grant delete on oms.role_priv to oms;
    GRANT SUPER ON *.* TO oms;
    ```
- else

    ```
    grant all privileges on oms.* to oms;
    grant all privileges on *.* to oms@localhost identified by 'omsx' with grant option;
    grant all privileges on *.* to oms@127.0.0.1 identified by 'omsx' with grant option;
    GRANT SUPER ON *.* TO oms;
    ```
- end if
            
   1.  To install the database, from the command line.  FWIW, the only {site name} that is available is 'DelawareCity'.  Setting up a site is non-trivial, though it can be done via csv-based files.

       **Windows**:
    ```
           cd /d {oms}\db
           oms.bat {omspwd} {site name}
    ```
	   To redirect all output to a file db.log
    ```
           oms.bat {omspwd} {site name} >db.log 2>&1
               
    ```
       **Linux**: 
    ```
           cd {oms}/db
           oms.bash  {oms password} {site name}
    ```
	       
	   The log file can be checked to verify that all tables and views have been created and all the records have been inserted.  Look for occurrences of
	   
	       'mysql' which is **not** an error, but a warning that the password shouldn't be entered on the command line, which, BTW, it isn't.  Not really.
	       'false' (not case sensitive) There should be two entries found on one line for an insert
	       '0 row' the DB insert will sometimes indicate success, but 0 rows inserted.  This is an error, usually indicating that either a lookup or the select used for the insert has failed.
	      
   1.  The webapp must be deployed to Tomcat.  NB, logging is done to {catalina.base}/logs, so if you deploy to Jetty or some other server, you'll need to update the log4j2.xml to correct the location
   
   1.  To schedule the services, 
-  **Windows (cmd)**: execute the createScheduledJobs.bat (createScheduledJobs.bat <user> <pwd> <OMShome>)
-  **Linux**  : move the files (sim.init; transfer.init; pmc.init; watchdog.init) to the init.d directory, rename them, make them executable, and set up symlinks in the rc3.d directory.  The jobs to purge the logs (purgeOMSLogs.sh; purgeTomcatLogs.sh) and save the DB (extractDB.sh) will need to be added to cron by hand ("45 0 * * * {OMS_HOME}/purgeOMSLogs.sh"; "30 0 * * * {OMS_HOME}/purgeTomcatLogs.sh"; "45 0 * * * {OMS_HOME}/extractDB.sh") 

   1.  To start the services, you can reboot (ugh!) or 
-  **Windows**: run the services
-  **Linux**: start the services (/etc/init.d/xxxx start, where xxxx are the files you moved to init.c)
 
   1.  The node_modules were deliberately excluded, so you'll need to do an "npm install"
    
   1.  The UI still runs under npm, so you'll need to start that up ... 
-  **Windows (cmd)** : cd /d %OMS_HOME%\ui && npm start oms.js
-  **Windows (powershell)**: cd $Env:OMS_HOME\ui; npm start oms.js 
-  **Linux**: cd $OMS_HOME/ui; npm start oms.js).  And who knows, this might even start up a browser session for you!
   
At this point (see above), you should be able to bring up a browser, enter the appropriate URL (typically, http://localhost:3000), and go.

## Known defects
   1.  Under transfers, "Admin Executable" and "Admin Template" can be selected consecutively, e.g., after selecting "Admin Executable", you need to select something else before "Admin Template".  If you select it next, there will be no response

   1.  ...
   
## Further Information:

   1. You should be able to import the Eclipse projects (oms-shared, oms, pmc (scada), sim, transfer, watchdog) for additional development.  If it's not clear, the "oms-shared" project is shared among the others, where "oms" is the Java webapp (using REST data services) and the others are (I hope) obvious.
   
   1. **See the SystemManual.md for more documentation on the design and implementation details.**
   