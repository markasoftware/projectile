#Projectile
Do you have a lot of node.js projects you're working on, and want to run them all from one website, on the same domain and port, but don't want to use a proxy? Projectile is what you should use! It's an easy way to have multiple node.js http servers and run them on different paths (e.g. /my-chat-client or /hello), without having to use a 
#Installation
Just a normal node.js package:

	npm install projectile

#Basic Example
Here's a basic example with two very, very simple projects and a "main" projectile file that manages routing and stuff
##The Files
###main.js, the "controller" file:

```javascript
//require it
var projectile=require('projectile');
//create a new server. This API is likely to change in the future
var serv=new projectile.Server();
//route reqs to /hello-world to hello.js, and /goodbye-world to goodbye.js
serv.route({
	'/hello-world':'hello.js',
	'/goodbye-world':'goodbye.js'
});
//listen on localhost:1337
serv.listen(1337,'127.0.0.1');
```

###hello.js, one of the servers

```javascript
//this is just our listener function, but instead of using
//http.createServer, we just set exports.listenFunc to it
exports.listenFunc=function(req,res){
	//just say "hello world" to all requests
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.end('Hello World');
}
```

###goodbye.js, the other server

```javascript
//define listener in same way
exports.listenFunc=function(req,res){
	//say goodbye to all requests
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.end('Goodbye World');
}
```

##Running the Server
To run this example, simply put all files in the same directory, then, make sure that is the working directory in console (projector currently searches the working directory for the project files, and doesn't yet support absolute paths), then start main.js like a normal node server:

	node main.js

##Results
Here are what the output should be when navigating to these different pages in a browser once the server is running:

	http://localhost:1337/                       => 404 error, no routing for this
	http://localhost:1337/hello-world            => "Hello World", was routed to hello.js
	http://localhost:1337/goodbye-world          => "Goodbye World", was routed to goodbye.js
	http://localhost:1337/hello-world/extrastuff => "Hello World", pathname starts with /hello-world, so it's still routed to hello.js

#API
Please note that the API is extremely unstable, if you're creating something with this as a dependency, I highly reccommend setting the dependency version for projectile to the current version, or it likely will break with an update to projectile
##new projectile.Server()
Create a new projectile server. Must use new keyword, it's a constructor, not a factory function
##server.route(Object routes)
Set some routes for the project. The object passed should have keys for the pathnames to match, and values for the file those should be routed to. So, `{'/test':'test-server.js','/hello':'take-over-the-world.js'}` would route requests whose pathname begins with `/test` to `test-server.js` and ones whose pathname begins with `/hello` to `take-over-the-world.js`. You must include the leading slash, I created this package in 20 minutes and was too lazy for fixing that
##server.listen(Number port, String hostname)
Basically the same as listen for an http server. Starts the server on the given hostname on the given port
#API for the servers/projects being routed to
In the server/project files, unless you're using a library like Express, require minimal configuration to work with projectile. Simply take the function that is the callback/listener in `http.createServer()`, and set that function to `exports.listenFunc`. So, if you had:

```javascript
require('http').createServer(function(req,res){
	//stuff here
}).listen(1337,'127.0.0.1');
```

Simply change that to:

```javascript
exports.listenFunc=function(req,res){
	//stuff here
}
```

#License
Projectile is released under the GNU Public License, version 2. See the LICENSE file for the full text of the license