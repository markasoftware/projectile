exports.listenFunc=function(req,res){
	res.writeHead(200,{'Content-Type':'text/plain'});
	res.write('The url passed to me, myself, and I is: '+req.url+' yeah you heard me full well.');
	res.end('Hello world! A projectile is coming your way!');
}