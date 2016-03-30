var express = require('express');
var bodyParser =require("body-parser");
var router = express.Router();
var path = require('path');
var NginxConfFile = require('nginx-conf').NginxConfFile;
var app= express();

    app.set("view engine", 'ejs');
    app.use(express.static(__dirname + '/views'));

	app.use(bodyParser());

console.log(getconf().nginx);



/* GET home page. */
router.get('/', function(req, res, next) {
 
res.render('index.ejs'); 
  
});

router.get('/general', function(req, res, next) {
  res.render('genaral.ejs');
});

router.get('/http', function(req, res, next) {

var x=[];

NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {
	  if (err) {
	    console.log(err);
	    
	  }else{

	  	x=getformarr('http',conf);

	  	console.log(x);

	  	res.render('httpconfig.ejs',{elements:x} );

		

	}	

	});


  
});

router.get('/swconfig', function(req, res, next) {
  res.render('swconfig.ejs');
});

router.get('/main', function(req, res, next) {
  res.render('mainconfig.ejs',{user:conx.nginx.user._value,wkpc:conx.nginx.worker_processes._value,
wrn:conx.nginx.worker_rlimit_nofile._value,err:conx.nginx.error_log._value,pid:conx.nginx.pid._value});
});


router.post('/httppost',function(req,res){

	var arr=[]

	arr=req.body;

NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {
  if (err) {
    console.log(err);
    return;
  }

	for(var i in arr){


		eval(i+'._value ='+ arr[i] +';');


		console.log(i);
		console.log(arr[i]);
	}

});

});



function getconf(){

	var cnf='';

NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {
	  if (err) {
	    console.log(err);
	    
	  }else{

	  	cnf=conf;

		

	}	

	});

return cnf;
}




function getformarr(type,cnf){

	var conf=cnf;

		
	var t= Object.keys(eval('conf.nginx.'+type));
	t.shift();
	t.shift();
	t.shift();
	t.shift();

	var arr=[];


	for(var i in t) {                    
    if(typeof t[i] === Object) {
    	
    	//console.log(t[i]);
    	console.log(t[i] +' == '+  eval('conf.nginx.http.'+ t[i] +'._value'));

    } else {
    // Do another thing

     if(eval('conf.nginx.http.'+t[i]+'._value') == ''){
  		var j=Object.keys(eval('conf.nginx.http.'+t[i]))
			  j.shift();
			  j.shift();
			  j.shift();
			  j.shift();
    		console.log(j);

    		for(var k in j){

    			arr.push({name:t[i] +' - ' + j[k],url:'conf.nginx.http.'+t[i]+'.'+j[k],value:eval('conf.nginx.http.'+t[i]+'.'+j[k]+'._value')});

    		}

    }else{

    		arr.push({name:t[i],url:'conf.nginx.http.'+t[i], value:eval('conf.nginx.http.'+t[i])});



    	}


    
    }
}
	
	return arr;
}


module.exports = router;

