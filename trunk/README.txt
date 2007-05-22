This is the readme for r1.0.1x.

What's the new in r1.0.1x?
A few changes have been made in r1.0.1x to facilitate installation on Linux servers.
See http://www.calemeam.com/support_setup.html for updated instructions for Linux.

1. Added jsmin_x86 to support jsmin on x86 based Linux servers. A PHP based jsmin is also provided.
See setup guide for instructions how to prepare a jsmin executable.

2. Corrected a lookup data entry issue where lookup field changes via keys are not reported.

3. Fixed build/database/createSchema.bat to use env.bat (not init.bat).

4. Modified shell scripts (.sh files) under CalemEAM/bin to get rid of control chars.

5. Reorganized directory structures to facilitate access control configuration for Apache.

6. Provided a sample access control configuration (at CalemEAM/etc/httpd-calemeam.conf).
   
   
What is CalemEAM Open Source?

CalemEAM Open Source is an open source Enterprise Asset Management (EAM) application
published and supported by CalemEAM (www.calemeam.com). Check out www.calemeam.com for 
other products available from CalemEAM.
