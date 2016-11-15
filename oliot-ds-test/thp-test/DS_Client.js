var util = require('util');
var argv =  require('optimist')
		.usage('Usage: $0 -n [num] -a [string]')
		.default({n:1000, a:'143.248.56.222'})
		.argv;

var qs = require('querystring');

var rest = require('../rest');

var totalFailResponse=0;
var totalSuccessResponse=0;
var delta; 

var num = argv.n; 
var address = argv.a;

var username;
var password;
var token = "dcdebe3afb25eee9b95ec9297465fed9d771c358";
var ds_api_address;

username = 'kaist';
password = 'password';
ds_api_address = 'http://'+address+':3001';

var initTime = new Date(2016, 10, 15, 18, 1, 9, 0);
var tzoffset = (new Date()).getTimezoneOffset() * 60000;
var interval_hour = 100*3600000;

var start = Date.now();
var i = 0;
for(i = 0; i< num; ++i){

	var rand_thing = randomInt(0, 9);
	var thingname= "urn:epc:id:sgtin:8800000.300025."+rand_thing;
	
	if(i%5 === 0){
		//console.log("time query");
		var localfromtime, localtotime;

		var rand_offset_from = randomInt(0, interval_hour);
		
		localfromtime = (new Date(initTime - (tzoffset-rand_offset_from))).toISOString();
		
		var rand_offset_to = randomInt(rand_offset_from, rand_offset_from + 3600000);
		
		localtotime = (new Date(initTime - (tzoffset-rand_offset_to))).toISOString();

		
		var queryJson={};
		
		queryJson["thingname"] = thingname;
		queryJson["from"]=localfromtime;
		queryJson["to"]=localtotime;
		
		var queryStr = qs.stringify(queryJson);
		
		rest.getOperation(ds_api_address, "query?"+queryStr,null, token, null, null, function(error, response){
			if (error) {
				totalFailResponse++; 
				if(totalFailResponse + totalSuccessResponse === num){
					delta = (Date.now()) - start;
					console.log("Success: "+totalSuccessResponse+", Fail: " + totalFailResponse);
					console.log("Finished time: "+delta+"ms");
				}
			} else {
				totalSuccessResponse++;
				//console.log(response);
				if(totalFailResponse + totalSuccessResponse === num){
					delta = (Date.now()) - start;
					console.log("Success: "+totalSuccessResponse+", Fail: " + totalFailResponse);
					console.log("Finished time: "+delta+"ms");
				}	
			}
		});
		
	} else{
		//console.log("latest query");
		rest.getOperation(ds_api_address, "thing/"+thingname+"/latest",null, token, null, null, function(error, response){
			if (error) {
				totalFailResponse++; 
				if(totalFailResponse + totalSuccessResponse === num){
					delta = (Date.now()) - start;
					console.log("Success: "+totalSuccessResponse+", Fail: " + totalFailResponse);
					console.log("Finished time: "+delta+"ms");
				}
			} else {
				totalSuccessResponse++;
				if(totalFailResponse + totalSuccessResponse === num){
					delta = (Date.now()) - start;
					console.log("Success: "+totalSuccessResponse+", Fail: " + totalFailResponse);
					console.log("Finished time: "+delta+"ms");
				}	
			}
		});
	}
}

var delta = (Date.now()) - start;
console.log('Finished processing request: ' + delta.toString() + 'ms');



function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


