## System Manual

This document describes how the functionality provided was implemented (more or less)

## DB ERD & other info

A (poorly organized, probably out of date) ERD for the DB is saved in the OMSV1.mwb (from MySQL Workbench) and OMSv1.pdf

You can list the users in mysql w: select * from mysql.users;
You can list the tables in mysql w: select * from information_schema.tables;


### Page structure

Under the ui/src directory, 

---
-  ```frames``` - defines main page "frames" contents (header, classification (horizontal), and menu list (vertical) menus)
-  ```images``` - contains images used in pages (hint: there aren't many, not sure they're used, either.  The images displayed seem to be coming from ui/public/images)
-  ```js``` - (not used, though it has jquery.min.js)
-  ```mainpage``` - contains contents and login display
    - ```pages``` - contains (mostly) menu page handlers
        - ```displays``` - contains logic for the displays (forms & lists, mostly) for the menu pages.  Some of these pages actually do the display themselves w/o the need for a different list page.
            - ```forms``` - contains code to generate the forms for the admin pages
            - ```lists``` - contains code to generate the lists, mostly for the admin pages
            - ```objects``` - contains JavaScript objects to simplify data handling.  Could clearly add some functions to do stuff, but that's down the road for refactoring
        - ```requests``` - was originally intended to allow URI definitions for the various pages, but was deemed to add unncessary abstraction.
---

### Java REST program structure

This is all done w/Spring REST and myBatis.  That should be enough information.

---
-  the controllers are implemented in the ```oms``` project, e.g., ```us.avn.oms.rest.controller```
-  the myBatis sql Mappers are defined in the ```oms-shared``` project, e.g., ```src/main/resources/us.avn.oms.mapper```
-  the services are defined in the ```oms-shared``` project, i.e., ```src/main/java/us.avn.oms.service``` and implemented in the ```impl``` subdirectory of the services, i.e., ```src/main/java/us.avn.oms.service.impl```.
---

### Date handling (2019-09-10)

I haven't come up w/an elegant method for handling dates and time stamps.  What I have attempted to implement is letting Java and the DB handle the time stamps in their own particular formats (e.g., MySQL TIMESTAMPS and Java Instance).  This leaves the (hard) part to formatting the dates appropriately in the npm/react code.  I have tried to use the objects to format the dates to their needed strings and let the UI handle all dates and times as strings.  Then when returning the data back to the application server, (typically in the xxxxAdmin code), I convert the string back to a timestamp.

The DB maintains the timestamp in GMT (Zulu), so in the conversions to and fro, you'll need to include the local time zone.  I use moment.utc and moment.unix

There aren't a lot of timestamps where this needs to be done.  Alarms, Orders (Shipments) and Transfers are the big ones.

I'm using the ```moment``` package to handle the parsing and formatting. 

### Adding a new page

Pages are viewable (i.e., appear in your menu list) based on privileges, which are assigned to roles, which are assigned to users.  There are two privileges associated w/a page, a "view" privilege and an "execute" privilege.  

There are two kinds of menus, "horizontal" and "vertical".  The vertical menus are sub-menus, i.e., when you select a particular horizontal menu item, the vertical menu changes.  when adding a page to a menu, you are adding an item to a vertical menu.  The horizontal menu in which your item is placed is specified by the category ID.  

Menu Type is specified in MENU_TYPE_VW
Category is specified by the Horizontal Item ID
 
   ---
   | Menu Item | Menu Type | Category (ID) |
   | :---: | :---: | :---: |
   | Horizontal Items | Horizontal | none (NULL) |
   | Vertical Items | Vertical | Horizontal Item (HzID) |
   ---


   1.  Add record(s) to the privilege table.  Note the record ID(s).
   
   1.  Get the record ID's for the roles you want to assign these privileges to.
   
   1.  Add record(s) to the ROLE_PRIV table. (```insert into role_priv(role_id,priv_id) values(1,41);```)
   
   1.  Insert a record into the PAGE table.  The URI field is an artifact from the original PHP-based UI and can be ignored. (```insert into page(name,view_priv_id,exec_priv_id,active) values('Tag Admin',41,41,'Y'```)
   
   1.  Get the record ID for the page you just added.
   
   1.  Insert a record into the MENU table.
   
   Now comes the hard part.  You need to add the code to handle the request.
   
   1.  In ui/src/mainpage/Contents.js add the appropriate imports for the page handlers.
   
   1.  In ui/src/mainpage/Contents.js add the handler in the appropriate locations.  In case it's not obvious, the logic is
   
   ---
       case: horizontal tab value
          case: vertical tab value
          
       where the tab values have the embedded blanks removed.
   ---
   
   1.  Add the various page handlers you've added references to.  The Page Structure definition above should provide hints to how it was originally implemented.
   
   1.  Create the necessary data retrieval functions in the Java rest app.

### System Configuration
In the "config" table, there are a set of key-value pairs that define the behavior of the system (mostly).  The current set of values are

   ---
   | Name | Value | Description |
   | ------------- | ------------ | --------------------- |
   | ```NORMCOLOR``` | ```darkgreen``` | ```Normal state "alarm" color``` |
   | ```HHCOLOR``` | ```red``` | ```High high alarm color``` |
   | ```HICOLOR``` | ```yellow``` | ```High alarm color``` |
   | ```LOCOLOR``` | ```yellow``` | ```Low alarm color``` |
   | ```LLCOLOR``` | ```red``` | ```Low Low alarm color``` |
   | ------------- | ------------ | --------------------- |
   | ```SITE``` | ```DeCity``` | ```Name of Site``` |
   | ```CURRENT_TEMP``` | ```DCT-0000``` | ```Name of tag to store current temperature in``` |
   | ```CURRENT_PRESSURE``` | ```DCP-0000``` | ```Name of tag to store current barometric pressure in``` |
   | ```CURRENT_WIND_DIR``` | ```DCM-0000``` | ```Name of tag to store current wind direction in``` |
   | ```CURRENT_WIND_SPEED``` | ```DCR-0000``` | ```Name of tag to store current wind speed in``` |
   | ```LAST_HOUR_PRECIP``` | ```DCL-0000``` | ```Name of tag to store the last hour's precipitation in``` |
   | ------------- | ------------ | --------------------- |
   | ```LOGGER_LEVEL``` | ```DEBUG``` | ```remnant of PHP implementation; not used``` |
   | ```UI_LOG_DIRECTORY``` | ```/home/xxxxxx/logs``` | ```remnant of PHP implementation; not used``` |
   | ------------- | ------------ | --------------------- |
   | ```GASOLINE-PERCENT``` | ```47.1``` | ```Used by simulator for output of refinery units``` |
   | ```FUELOIL-PERCENT``` | ```30.9``` | ```Used by simulator for output of refinery units``` |
   | ```JETFUEL-PERCENT``` | ```9.9``` | ```Used by simulator for output of refinery units``` |
   | ```NAPTHA-PERCENT``` | ```2.2``` | ```Used by simulator for output of refinery units``` |
   | ```LUBRICANTS-PERCENT``` | ```1``` | ```Used by simulator for output of refinery units``` |
   | ```WAXES-PERCENT``` | ```0``` | ```Used by simulator for output of refinery units``` |
   | ```COKE-PERCENT``` | ```5.30``` | ```Used by simulator for output of refinery units``` |
   | ```ASPHALT-PERCENT``` | ```1.90``` | ```Used by simulator for output of refinery units``` |
   | ```STILLGAS-PERCENT``` | ```4.2``` | ```Used by simulator for output of refinery units``` |
   | ------------- | ------------ | --------------------- |
   | ```NUMBER-SHIPS``` | ```2``` | ```Number of allowed ships``` |
   | ```NUMBER-TANKCARS``` | ```2``` | ```Number of tank cars that can be filled at a time``` |
   | ```NUMBER-TANKTRUCKS``` | ```2``` | ```Number of tank trucks that can be filled at a time``` |
   | ```SHIP-PRESENT-NAME``` | ```Ship%dHere``` | ```Reg-ex for name of digital tags which indicate that a ship is here``` |
   | ```TANKCAR-PRESENT-NAME``` | ```TC%dHere``` | ```Reg-ex for name of digital tags which indicate that a tank car is here``` |
   | ```TANKTRUCK-PRESENT-NAME``` | ```TT%dHere``` | ```Reg-ex for name of digital tags which indicate that a tank truck is here``` |
   | ------------- | ------------ | --------------------- |
   | ```WATCHDOG_EMAIL``` | XXXXXX@XXXXXXX.XXX | ```Email to send watchdog failure notifications to``` |
   | ```SMTP_HOST``` | ```smtp.comcast.net``` | ```SMTP host used to send watchdog failure notifications``` |
   | ```SMTP_PORT``` | ```587``` | ```SMTP port used to send ...``` |
   | ```EMAIL_FROM``` | XXXXXX@XXXXXXXX.XXX | **VALID** ```email as a from address``` |
   | ```EMAIL_USER``` | ```XXXXXX``` | ```User name for email used to send ... ``` |
   | ```EMAIL_PWD``` | ```XXXXXX``` | ```Password for email used to send ...``` |
   | ------------- | ------------ | --------------------- |
   | ```WEATHER_DELAY``` | ```16``` | ```The number of minutes past the hour that the weather values are requested and updated.``` |
   | ```WEATHER_INTERVAL``` | ```60``` | ```The interval (in minutes) that the weather values are requested and updated.``` |
   | ```WEATHER_LOCATION``` | ```KTME``` | ```NOAA weather location (see WEATHER_TYPE, below).``` |
   | ```WEATHER_TYPE``` | ```API``` | ```The choices are ACU, API, CSV, and XML.  The default is XML.  This is because the NOAA API doesn't return the same values as the XML and the XML values look right.  If you have a personal weather station that returns the values in a CSV file, you can use this.  The type for the AcuRite 01036M is ACU.  In the case of CSV and ACU, the WEATHER_LOCATION becomes the location of the the file created/updated by the station, and the WEATHER_DELAY and WEATHER_INTERVAL need to be suitably adjusted.``` |
   | ```Dock 1``` | ```DK1toC``` | ```Map for Ship Dock 1 to required template``` |
   | ```Dock 2``` | ```DK2toC``` | ```Map for Ship Dock 2 to required template``` |
   | ```Dock 3``` | ```DK3toC``` | ```Map for Ship Dock 3 to required template``` |
   | ```Dock 4``` | ```DK4toC``` | ```Map for Ship Dock 4 to required template``` |
   ---

   These names are defined as static values in the Config data element.
   
### Tag Types

I like to think of these as intuitively obvious, but there are some properties of some of these which can't easily be determined from the code.  Following this list are some descriptions of those properties.

   ---
   | Code | Name | Description |
   | ------------- | ------------ | --------------------- |




   | ```AI``` | ```AnalogInput``` | Field sensor analog |
   | ```AO``` | ```AnalogOutput``` | Analog Output value |
   | ```C```  | ```CalculatedVariable``` | Calculated Variable |
   | ```CB``` | ```ControlBlock``` | Field control device (not used) |
   | ```CT``` | ```Container``` | Shipping container (not used) |
   | ```DI``` | ```DigitalInput``` | Field sensor digital |
   | ```DK``` | ```Dock``` | DockNumber |
   | ```DO``` | ```DigitalOutput``` | Digital output |
   | ```FLD``` | ```Field``` | Refinery field |
   | ```HS``` | ```Hot Spot``` | Hot spot (link to another page, not needed?) |
   | ```P``` | ```Pipe``` | Field pipe |
   | ```PG``` | ```PlotGroup``` | Group of tags for pre-defined plots (not used) |
   | ```PMP``` | ```Pump``` | Pump |
   | ```PU``` | ```ProcessUnit``` | Refinery Process Unit |
   | ```RU``` | ```RefineryUnit``` | Refinery Unit |
   | ```S``` | ```Ship``` | Ship |
   | ```SCM``` | ```Schematic``` | Refinery Schematic |
   | ```SCO``` | ```SchematicObject``` | Objects for Refinery Schematics |
   | ```STN``` | ```DockingStation``` | Pumping points for a Dock |
   | ```T``` | ```Train``` | Train, e.g., collection of tank cars |
   | ```TC``` | ```TankCar``` | Railroad tank car |
   | ```TK``` | ```Tank``` | Liquid container |
   | ```TT``` | ```TankTruck``` | Tank truck |
   | ```V``` | ```Valve``` | Valve |
   | ```XFR``` | ```Transfer``` | Defines the exchange of material |
   ---
   
### Analog Types

The ```pmc``` processor
 
   1.  Transfers the values from the RAW_DATA table to the ANALOG_INPUT table
   1.  Checks for an alarm violation
   1.  Updates the historical data as needed

#### Accumulator

The Accumulator type is based on the AcuRite rain gauge behavior, which is based on a "rainfall event".  Once it starts raining, the value increases, according to the manual, until it stops raining for 8 hours or it stops raining for 1 hour and the pressure rises by 0.03 in Hg.  What we do is check the RAW value to the current value provided from the RAW_DATA table (the "new value or.  If the values are equal, no change is made.  If the new value is greater than the RAW value, the difference is added to the current scan_value for the record and the new value is stored as the raw value.  If the new value is zero (which means that the rain event is over), the raw value is set to 0.

#### Calculated Variables

Calculated variables are defined using multiple (up to 10) input variables (x0, x1 ... x9 ) and one output variable.  The output is an analog variable of analog type "calculated".  The input variables are the scan_value fields for the analog variables and digital variables.

The calculation is defined using Reverse Polish (Post-fix) notation.  If you understand that these calculations are done with the arguments on a stack, it's easier to understand.  The value returned is the last value left on the stack.  So, if you do "4 3 dup +", then the value returned is 6, even though the 4 is still left on the stack.

The input variables are related to the calc variable through the REL_TAG_TAG table.  The "key" is the order (ASCII numbers). 

* I'd like to add access to fields, i.e., ```x0.prevValue 32 - 5 * 9 /``` would run the Fahrenheit to Centigrade conversion on the previous value for a tag instead of the current value. 
   
* And if you want to test the calculation engine independently, you can
  - ```cd /d %OMS_HOME%\scada```    
  - ```set CLASSPATH=.;target/xfer.jar;libs/*```
  - ```java -cp %CLASSPATH% us.avn.rpn2.RPN2```
   

Some examples are:

   ---
   | Example | Description |
   | :--- | :--- |
   | ```x0 32 - 5 * 9 /``` | Converts from Fahrenheit to Centigrade for value x0 [degC = (degF-32)*5/9] |
   | ```x0 40 + 5 * 9 / 40 -``` | Also converts from Fahrenheit to Centigrade [degC = (degF-40)*5/9 - 40] |
   | ```x0 9 * 5 / 32 +```   | Converts from Centigrade to Fahrenheit [degF = 9*degC/5 + 32]|
   | ```x0 40 + 9 * 5 / 40 -``` | Also converts from Centigrade to Fahrenheit [degF = (degC+40)*9/5 - 40]|
   ---
   
If the calculation fails, the value returned in the output tag is -1001.

The operations supported are

   ---
   | Op Code | Operation | Example |
   | :--- | :--- | :--- |
   | . | "print" | ```4 .``` = 4  While this may be obvious, if the "." is left off and no operation is performed on it, the result will not be what you expect.  For example, if you want a floor to a value, ie, ```x0 13 < if 13 else x0 then .``` will return 13 whenever x0 is less than 13 otherwise it will return x0.  Again, leaving off the "." will return a 0 or 1 depending on the value of x0. |
   | + | addition | ```4 3 +``` = 7 |
   | - | subtraction | ```24 3 -``` = 21 |
   | * | multiplication | ```2 5 *``` = 10 |
   | / | division | ```24 3 /``` = 8 |
   | % | modulus | ```10 3 %``` = 1 |
   | ** | raised to the power | ```4 3 **``` = 64 |
   | pi | PI | ```pi``` = 3.14159... |
   | dup | duplicate value | ```4 dup +``` = 4 4 + = 8 |
   | swap | swap values on stack | ```4 3 swap **``` = 81 |
   | sin | sine (radians) | ```45 pi * 180 / sin``` = 0.707... |
   | cos | cosine (radians) | ```30 pi * 180 / cos``` = 0.866... |
   | tan | tangent (radians) | ```37 pi * 180 / tan``` = 0.753... |
   | log | log base 10 | ```2 log``` = 0.301... |
   | ln  | natural log | ```10 ln``` = 2.302... |
   | sqrt | square root | ```9 4 * sqrt``` = 6 |
   | abs | absolute value | ```-3 abs``` = 3 |
   | = | logical equality | ```3 4 =``` = 0;  ```3 3 =``` = 1 |
   | != | logical inequality | ```3 4 !=``` = 1;  ```3 3 !=``` = 0 |
   | > | logical greater than | ```3 4 >``` = 0;  ```3 2 >``` = 1 ```3 3 >``` = 0 |
   | >= | logical greater than or equal to | ```3 4 >=``` = 0;  ```3 3 >=``` = 1 ```3 2 >=``` = 1 |   
   | < | logical less than | ```3 4 <``` = 1;  ```3 2 <``` = 0 ```3 3 <``` = 0 |
   | <= | logical less than or equal to | ```3 4 <=``` = 1;  ```3 3 >=``` = 1 ```3 2 >=``` = 1 |   
   | 0= | logical zero equal to | ```0 0=``` = 1;  ```3 0=``` = 0 |
   | 0> | logical op greater than zero | ```3 0>``` = 1;  ```0 0>``` = 0 ```-3 0>``` = 0 |
   | 0< | logical op less than zero | ```3 0<``` = 0;  ```0 0<``` = 0 ```-3 0<``` = 1 |
   | if else then | conditional control block | ```5 x0 13 = if 5 else 3 then +``` = 10 if x0=13; = 8 otherwise.  You need to be careful with return values.  If, in the example, the "+" is left off, the result returned depends on the last operation performed, which in this case is the ```x0 13 =```.  |    
   ---
   
### Outputs (with some detail about variable processing)

The CONTROL_BLOCK is used as the mechanism for implementing outputs.  The fields as used by the simulator are

---
-   ```PV``` - the process variable, ie, the variable to be controlled.  This is value of the variable which the control output will change
-   ```SP``` - the setpoint, the desired value for the ```PV```
-   ```CO``` - the value to be output to change the value of ```PV``` to the ```SP```
-   ```BLOCK_TYPE``` - the type of algorithm to use to compute the output.  This field is currently ignored.  All values (including null) will cause a direct write from the value of the ```SP``` to the ```PV```, as though the control was done immediately w/no response time in the process.
---

As a simple example, take a car's cruise control.  The ```PV``` is the actual speed, the ```SP``` is the desired speed and the ```CO`` is how far you have to press the accelerator to make the ```PV``` equal to the ```SP```.

What we do here is ignore the ```CO``` and write the ```SP``` back to the ```PV```.  A more realistic control block needs some additional parameters to be able to correctly control the values.  Or, even better, this would be a supervisory control system and we would output the setpoint to a DCS or PLC and let them do the computations and the actual control.

And, of course, this is not the place for a full explanation for control system theory and I'm not the person to do that explanation, anyway.

My "control processor" runs after the analog inputs and before the analog outputs, and similarly for the digitals.  Note to self: the SP cannot be processed by the simulation.

This is how the processing works: 

**Analogs**
-   somehow, a setpoint gets written to the setpoint (```SP```) value in the ANALOG_INPUT table.  this would either be a manual update from the UI or a programmatic change from a model (not part of this implementation)
-   The control processor (part of the ```pmc``` process) writes the setpoint (```SP```) to the scan value in ANALOG_OUTPUT table.
-   The analog output processor (also part of the ```pmc``` process) writes the setpoint to the RAW_DATA table
-   The simulation process (the ```sim``` process) writes the value in the RAW_DATA table for the output tag (```CO```) to the value in the RAW_DATA table for the related input tag.  The related input tag is defined in the SIM_IO table.
-   The analog input processor (part of the ```pmc``` process) then gets the value from the RAW_DATA table for the ```PV```.

**Digitals**
-   somehow, a setpoint gets written to the output (```CO```) value in the DIGITAL_OUTPUT table.  this would either be a manual update from the UI or a programmatic change from a model (not part of this implementation).
-   The digital output processor (also part of the ```pmc``` process) writes the output to the RAW_DATA table
-   The simulation process (the ```sim``` process) writes the value in the RAW_DATA table for the output tag (```CO```) to the value in the RAW_DATA table for the related input tag.  The related input tag is defined in the SIM_IO table.
-   The digital input processor (part of the ```pmc``` process) then gets the value from the RAW_DATA table for the ```PV```.

### Docks

Docks are the stationary locations for ships, trains and trucks.  Docks have "stations" which are the locations of the pumps used to move contents to or from the ship, truck or train car.  All of these carriers must be defined entities and can be related to them via a REL_TAG_TAG record when they are docked.  Under "real" circumstances, this would be a manual process.  An operator would assign a dock to a ship and a sensor would trip when the ship had actually docked.  In the meantime, the simulator creates the relationship and sets the ship present indicator.  The transfer is then created and processed.  When the transfer is complete, the simulator deletes the relationship and clears the ship present flag.

Docks are implemented as a special usage of a Tag.  For a dock the input tag is the ID of the digital input which specifies that a carrier (ship, train, truck) is present at the dock.  The "output" tag is the ID of the carrier present at the dock.
N.B., trains are problematic because they actually consist of multiple tank cars which must be treated individually.

### Docking Stations

Associated with docks are docking stations (STN) 

### Fields

Fields are graphical displays of areas of the refinery.  The size is determined by the area selected to be displayed.  The display is updated every minute.

The items to be displayed, and right now, only tanks are worth showing, must be explicitly associated with the field via the Admin tab of the UI.  This association is defined with the REL_TAG_TAG table.  Since there is only a single list associated with a field, the REL_TAG_TAG code value is null. 

### Plot Groups

Plot groups are groups of up to 4 different analog variables that allow a user to plot the values over the last two days.  In addition, all active transfers are displayed, though (currently) only the source and destination ID's are graphed.  The display is updated every minute.

### Process Units

A process unit is a collection of variables which are displayed as a table.  The display is updated every minute.

The items displayed must be explicitly associated with the process unit via the Admin tab of the UI.  This association is defined with the REL_TAG_TAG table.  Since there is only a single list associated with a field, the REL_TAG_TAG code value is null.

### Schematics

Schematics are a graphical representation of the state of various objects which allow the ability to control various objects (pumps, valves) [```this is a future capability.  currently, it is being implemented as display only 2018/07/28```].

Schematics (tag type SCM), like Process Units (PU), are defined as a TAG objects w/no separate table.  Fields (FLD) are similar, but there is an associated table.  Note that there are no positions (i.e., c1_lat, c1_long, c2_lat, c2_long) associated with a schematic.  Associated with a schematic is a list of Schematic Objects (tag type SCO), related via the REL_TAG_TAG table.  Schematic Objects require a position (c1_lat, etc), that that position is NOT a latitude/longitude, but an XY position within the schematic display.  Furthermore, also related to the schematic object is a tag (analog or digital) which is used to define various display characteristics for that object.  This tag is related to the schematic object via the REL_TAG_TAG table.

Active transfers also show up in the schematic list.  Unlike a normal schematic, transfers are displayed on a field the size of the entire refinery.  Tanks are displayed scaled to the size of the field. 

Object Sizes:
Tanks, gauges, and pipes are scaled based on the values of the NW and SE corners.  Valves, refinery units, ships and pumps are not.  They are a fixed size, with the NW corner value used to specify the location.  Text field sizes depend more on the number of characters displayed than the size determined by the NW and SE corners.AAA

For convenience, there are views used to specify 
-   the types of tags that can be used as schematic objects (SCM_OBJECT_VW) and
-   the "contents" of schematics, fields, process units (CHILD_VALUE_VW)

### Shipping Vessels

The following are used to receive crude or ship product
-   Trucks
-   Trains, composed of multiples of Tank Cars
-   Ships, composed of multiple holds 

Here, we make the simplifying assumption that all shipping vessels contain the same product.  This is undoubtedly incorrect.

Containers specify the discrete holds in a ship or a train (the tank cars).  As such a container has only 

Ships tie up at docks at which they are unloaded or loaded.  Also, a ship has multiple holds from which/to which product is transferred.

Ships (tag type = "S")  
Trains (tag type = "T")
Trucks (tag type = "TT")

All three of these are implemented as tags.  Their owner is specified in a relationship where the ship/train/truck ID is the parent tag ID and the customer ID is the child tag ID.  The value of the code is "C". 
### Tags

Tags are the root definition object.  The meaning of most of the Tag fields is self-evident, but the "inTag" (inTagId), "outTag" (outTagId), "inTagList", and "outTagList" probably need some additional explanation.  The usage of these tags is dependent on the tag type.  The names also originate in Control Blocks (CB) which needed an input tag for the process variable and an output tag for the output.  All of these relationships are defined in the REL_TAG_TAG table and (mostly) require codes to discriminate between their usage. 

Calculated (C) variables need
 - variables used to calculate result (CODE = "1","2", etc)

Docks (DK) need
 - inputTag - specifies the digital input that indicates the presence of a carrier docked.
 - outputTag - specifies the ID of the carrier docked at this location. 

Fields (FLD) need
 - list of items (Tanks) in field
 
Process Units (PU) need
 - list of items (Tanks, Analog Inputs, Digital Inputs) to display 
 
Refinery Units (RU) (probably a bad name) need 
 - "status" tag (is unit ON (operating) or OFF)
 - list of equipment (pipes, valves, pumps) coming INTO the unit from the Crude tanks
 - list of equipment (pipes, values, pumps) going INTO the refined product tanks
 
Tanks (TK) need
 - level tag
 - temperature tag
 - equipment (pipes, valves, pumps) to refined unit (not implemented)
 - equipment (pipes, valves, pumps) from docks (not implemented)
 
Schematics (SCM) need
 - list of schematic objects to display
 
Schematic Objects (SCO) need
 - MISC is used to specify the object type (see SCM_OBJECT_VW) 
 - an input tag
 - an output tag
 
Pipes need
 - MISC is used to specify the type of fluid (CONTENT_TYPE_VW)   
 - an input tag to specify the state of the flow (ie, flowing/active or not)

Transfers need
 - MISC is used to specify the type of fluid being transferred (CONTENT_TYPE_VW)
 - 


### Tanks

Tanks currently are related to two tags, a temperature and a level tag, both are analog inputs.  This allows us to specify in process units and field displays a tank which automatically implies (supplies?) the temperature and level.  These tags are related to the tank through the REL_TAG_TAG table with a null CODE value.

Other potential tags related to a tank would be a pump (output pump), valves, and pipes.  These items are also related to the tank through the REL_TAG_TAG table, but their CODE value is either "IN" or "OUT", depending on whether the tank is a transfer source or destination.

Currently, there is no temperature compensation for volume so that the volumes are all compared at standard temperature. 

The volume is computed using interpolations with the VOLUME table.  The units are bbl, barrels.

### Shipments (Orders)

Shipments (Orders) are requests for material.  They are either a purchase of crude oil or a sale of refined product.  Orders are placed manually or automagically by the simulator based on either a lack of crude oil or the refined product tanks being full.

The processing is 

Create Order | Manual, Simulator
Create the Transfer | Transfer
Dock Carrier | Manual, Simulator
Start the Transfer | Transfer
Update the volume transferred | DevIO
End the Transfer | Transfer 
Undock the Carrier | Simulator


### Transfers

Transfers are the objects that define how oil and refined products are transferred from one place to another.  This could be from a ship to a tank, from a crude oil tank to a refining unit, from a refining unit to a refined products tank, from a refined project tank to a ship or a tank car or a tank truck, or even from one tank to another tank which has the same contents.  (NB, not sure that check is made...).

Transfers exist as either a template or as an executable transfer (i.e., the transfer type, see the ```transfer_type_vw```).  Templates are used as (wait for it) templates to create executable transfers, i.e., they are a method to schedule a transfer.  When the ```transfer``` processor runs, it checks to see if a template is due to be started.  If so, it will create the transfer as an executable transfer.

Transfers also have a status, 

  ---
  | id | name       | code | value | description                     |
  |  1 | Active     | A    |     0 | Transfer currently in progress  |
  |  2 | Complete   | C    |     1 | Transfer complete               |
  |  4 | Incomplete | I    |     3 | Transfer not completely defined |
  |  5 | Pending    | P    |     4 | Transfer waiting on activation (mostly (?) templates) |
  |  3 | Scheduled  | S    |     2 | Transfer scheduled, completely defined, but not yet time to activate |
  ---
Transfers are somewhat different from other objects, e.g., Analog Inputs or Digital Inputs, in that only templates or ad hoc transfers have a record in the TAG table.  All scheduled transfers assume the tag ID of the template that they were created from.  This is implemented with a TAG_ID field in the TRANSFER table.

Events that should create a transfer
 - vessel (tag type: S=ship; T=train; TT=tank truck) appears at dock w/associated order (shipment)
 - daily transfer from crude tank to refining unit
 - daily transfer from refining unit to product tanks

Daily transfers are based on templates which start at midnight and last for one day.  At the end of the day, they are completed and new ones begun, assuming that the refinery unit is on.  The transfer from the crude unit(s) is done FROM the two fullest tanks to the refinery units.  The transfers to the product tanks is done TO the emptiest product tanks.  The transfers to the product tanks for a given product should NOT be to the same tank.

If a vessel appears at a dock, then there must be an order (shipment) associated with it.

How do we know that the vessel is present at the dock?
- there is a vessel (tag type: T, TT, S) which has a REL_TAG_TAG record as a child to the dock (parent).  This record is created manually by an operator (!) or automagically by the simulator. 
- the digital indicator for the vessel is set, as part of the manual process or (again) automagically by the simulator
- every ten minutes (?) the transfer program checks for the presence of a vessel by checking for docks that have a vessel present via a) the digital indicator and b) a child RTT record of code CRR. 

How do we identify the vessel?  The vessel can be determined by the RTT record of code CRR.  Tank Trucks and Ships appear (presumably) repeatedly.  Trains, again, presumably, do not, since the contents are received from/delivered to different customers w/different tank cars.  OTOH, trains can be treated the same as Ships and TankTrucks, but a new Tag will be created for every train.

What do we do once we find a vessel at a dock?  Is the process the same for Ships, Trains, and TankTrucks? (I think so)
- look for a template associated w/that dock and that product type
- create a new transfer to be started ASAP
- turn on the associated pumps
- open the associated valves (and close others?)

Once the transfer is complete, at some point the vessel needs to be undocked, either manually or, by the simulator, automagicially

When a transfer is started or stopped, the ```transfer``` program starts or stops pumps and opens or closes the valves related to that transfer.  The dilemma for tanks that have separate pumps, valves, or pipes for different destinations, e.g., from the docks to the crude tanks, from the refined product tanks to the docks, from the crude tanks to the refinery units is to correctly identify the objects that ought to be opened/closed, started/stopped.  Another way to say this is, does this source/destination pump/valve/pipe affect the given destination/source ?  Example: we don't want to open a valve to refinery unit 2 if the tank is supplying refinery unit 1. 

The following methods were considered.  They fall into two categories, explicit association or implicit association.  Explicit associations would be a linked list for a parent (e.g., a tank) and the associated pumps, valves, and pipes.  An implicit association would be a naming convention for the tag which would indicate both the source and destination.  One problem w/explicit associations is that they have to be explicitly managed; one problem w/implicit associations is generalizing the naming convention so that different instantiations can use different naming conventions.

One caveat: this is only necessary for actual objects, not for the "schematic objects" used to display schematics.  They have their own problems.

So, here's how I'm gonna try to do it:

-  Add a boatload of records (well, ok, 3) to the config table which provide the necessary definitions for the naming conventions
-  Add the code to the ```transfer``` program in UpdateTransfer.changeTransferState.

My naming convention is for pumps, valves, and pipes.  If there's any other tag type that needs this ability, I may need to update this.  Also, I only need a pattern for multiple source/destination objects, so if it doesn't match the pattern. For now, the naming convention will be something like

-  Pipe:  NAME-PATTERN-PIPE  - T2RU[0-9]+-P
-  Valve: NAME-PATTERN-VALVE - T[0-9]{3,3}-V{o|i}
-  Pump:  NAME-PATTERN_PUMP  - T[0-9]{3,3}-Pmp

so the idea is that I do a regex on the name.  If there's no match, then the refinery unit isn't coded in the name and i can safely execute the action, i.e., start/stop/open/close/on/off.  If there is a match, then i have to figure out the tank (first two digits, for valves and pumps) and the refinery unit (third digit).  Except for pipes, where if it matches, the digit determines the refinery unit.  Also, the ACTUAL regex pattern used has to include the tank's contents code, which means I append the pattern to the contents code from the tank or pipe.  (note the assumption: all pumps and valves w/this problem are associated w/a tank.  Pipes use the **misc** field to specify what's being transferred in this pipe)

For valves the {o|i} is an indicator whether the valve is output or input, though that's mostly for uniqueness and user "friendliness".  Uniqueness because valves are present for both input and output.

### 
### Watchdogs

The OMS comes with the following "watchdogs".

   ---
   | Name | Description (Implementing class) |
   | :--- | :--- |
   | ```AnalogInput``` | The analog input processor.  Part of the **pmc** process (XferAnalogData) |
   | ```Calculated``` | The calculated variable processor.  Part of the **pmc** process (XferAnalogData) |
   | ```ControlBlock``` | The control block processor.  Part of the **pmc** process (XferAnalogData) |
   | ```AnalogOutput``` | The analog output processor.  Part of the **pmc** process (XferAnalogData) |
   | ```DigitalInput``` | The digital input processor.  Part of the **pmc** process (XferDigitalData) |
   | ```DigitalOutput``` | The digital output processor.  Part of the **pmc** process (XferDigitalData) |
   | ```DataCollectionAI``` | The analog input simulator.  Part of the **simulate** process (SimulateAIData) |
   | ```DataCollectionAO``` | The analog output simulator.  Part of the **simulate** process (SimulateAOData) |
   | ```DataCollectionDI``` | The digital input simulator.  Part of the **simulate** process (SimulateDIData) |
   | ```DataCollectionDO``` | The digital output processor.  Part of the **simulate** process (SimulateDOData) |
   | ```Transfer``` | The **transfer** processor |
   | ```PSE``` | Pseudo-Random Events, i.e., ships, trucks, trains arriving.  Part of the **simulate** process |
   ---

The watchdog process checks all of the active watchdogs and sends an email if it detects that the process is not updating.  If the process continues to fail to update, it sends an email every hour.