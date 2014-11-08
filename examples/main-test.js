var projectile=require('projectile');
var serv=new projectile.Server();
serv.route({
	'/hello':'hello-server.js',
	'/hello/there':'hello-there-server.js'
});
serv.listen(1337,'127.0.0.1',true);