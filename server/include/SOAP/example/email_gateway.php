<?php
/**
 * This reads a message from stdin, and passes the request to a SOAP server
 * residing on a web server, sends the response out as an email. You can use
 * this from qmail by creating a .qmail-soapgateway file with:
 * <code>
 * | /usr/bin/php /path/to/email_server.php
 * </code>
 *
 * PHP versions 4 and 5
 *
 * LICENSE: This source file is subject to version 2.02 of the PHP license,
 * that is bundled with this package in the file LICENSE, and is available at
 * through the world-wide-web at http://www.php.net/license/2_02.txt.  If you
 * did not receive a copy of the PHP license and are unable to obtain it
 * through the world-wide-web, please send a note to license@php.net so we can
 * mail you a copy immediately.
 *
 * @category   Web Services
 * @package    SOAP
 * @author     Shane Caraveo <Shane@Caraveo.com>   Port to PEAR and more
 * @author     Jan Schneider <jan@horde.org>       Maintenance
 * @copyright  2003-2007 The PHP Group
 * @license    http://www.php.net/license/2_02.txt  PHP License 2.02
 * @link       http://pear.php.net/package/SOAP
 */

/* SOAP_Server_Email_Gateway */
require_once 'SOAP/Server/Email_Gateway.php';

/* Read stdin. */
$fin = fopen('php://stdin', 'rb');
if (!$fin) {
    exit(1);
}

$email = '';
while (!feof($fin) && $data = fread($fin, 8096)) {
    $email .= $data;
}

fclose($fin);

/* Do it! */
$server = new SOAP_Server_Email_Gateway();
$server->service($data, 'http://localhost/soap/example/server.php');
