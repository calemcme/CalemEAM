This is the readme for r1.0.1x.

What's the new in r1.0.1x?
r1.0.1x can use PHP to compress deployment packages so there's no dependency on jsmin.exe
which is not available on Linux. see detailed change logs below:

1. Added configuration to use PHP to compress deployment packages. This is done to support Linux servers.
(see http://www.calemeam.com/support_setup.html for details)

2. Fixed build/database/createSchema.bat to use env.bat (not init.bat).

3. Corrected a lookup data entry issue where change event is not sent to field object so 
   a change in lookup field might be lost.
   
   
What is CalemEAM Open Source?

CalemEAM Open Source is an open source Enterprise Asset Management (EAM) application
published and supported by CalemEAM (www.calemeam.com). Check out www.calemeam.com for 
other products available from CalemEAM.
