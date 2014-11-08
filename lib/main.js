/*
    Projectile, a node.js module by Mark Polyakov of markasoftware.com

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/
var http=require('http');
var parseUrl=require('url').parse;
var colors=require('colors/safe');
exports.Server=function(){
	//closure private vars
	var routes={};

	//optional 2nd argument is the base directory to search for the packes in if not the working directory
	this.route=function(newRoutes){
		for(var key in newRoutes){
			routes[key]={
				path: newRoutes[key],
				listenFunc: require((arguments[1]||process.cwd())+'/'+newRoutes[key]).listenFunc,
				slashes: (key.replace('./','').replace('../','').match(/\//g)||[]).length
			};
		}
	}
	this.listen=function(port,host){
		var printReqs=arguments[2]||false;

		console.log(colors.yellow('Projectile: Initializing and starting server'));

		http.createServer(function(req,res){
			if(printReqs) console.log(colors.cyan('Projectile: Incoming request, url: '+req.url));
			var maxSlashes=0;
			var maxSlashesKey=null;
			Object.keys(routes).forEach(function(curKey){
				if(routes[curKey].slashes>maxSlashes &&
					parseUrl(req.url).pathname.indexOf(curKey)===0){
					maxSlashes=routes[curKey].slashes;
					maxSlashesKey=curKey;
				}
			});
			if(maxSlashes!==0){
				req.url=req.url.substring(maxSlashesKey.length);
				routes[maxSlashesKey].listenFunc(req,res);
				return;
			}
			if(printReqs) console.log(colors.cyan('Projectile: No matching script found'))
			res.writeHead(404,{'Content-Type':'text/plain'});
			res.end('no appropriate script found');
		}).listen(port,host);
		console.log(colors.green('Projectile: Server listening on '+host+':'+port));
	}

	this.route(arguments[0]||{});
}