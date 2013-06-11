/*
 * mp3chief-node
 * https://github.com/paulomcnally/mp3chief-node
 * http://mp3chief.com to json
 * version 0.1
 * created 10/06/2013
 * last update 10/06/2013
 * Example: http://localhost/?q=mana
 */

// require
var http = require('http');
var request = require("request");
var cheerio = require("cheerio");
var express = require('express');

// express app instance
var app = express();

var result = [];


app.get('/', function(req, res){
	// result array json
	result = [];

	// query
	var q = req.param('q');

	if( q ){
		request({ uri: "http://www.mp3chief.com/search?q="+encodeURIComponent( q ),}, function(error, response, body) {
			var $ = cheerio.load(body, {ignoreWhitespace: true,xmlMode: false});


			$("#song_items .song_item").each(function(){
				var _$ = cheerio.load($(this).html());
				var name = _$(".item_name").text();
				var link = _$(".item_links .download a").attr("href");

				var obj = {};
				obj.link = link;
				obj.name = name;
				result.push(obj);
			});

			res.send( JSON.stringify(result) );
		});
	}
	else{
		res.send( '<a href="/?q=mana">Song from Mana</a>' );
	}

});

app.listen(process.env.VCAP_APP_PORT || 3000);