/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This file handles the database and JWT configurations
*/

//please update this file according to your database
//'mongodb://<dbusername>:<dbuserpassword>@ds163870.mlab.com:63870/<dbname>'

module.exports = {
    'secret' : 'chatappsecret',
    'database' : 'mongodb://<dbusername>:<dbuserpassword>@ds163870.mlab.com:63870/<dbname>'
}