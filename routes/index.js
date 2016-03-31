var express = require('express');
var bodyParser =require("body-parser");
var router = express.Router();
var path = require('path');
var NginxConfFile = require('nginx-conf').NginxConfFile;
var app= express();

    app.set("view engine", 'ejs');
    app.use(express.static(__dirname + '/views'));

	app.use(bodyParser());





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

	  	

	  	res.render('httpconfig.ejs',{elements:x} );

		

	}	

	});


  
});

router.get('/swconfig', function(req, res, next) {
  res.render('swconfig.ejs');
});


router.post('/mainpost',function(req,res,next){

	var arr=[]

	arr=req.body;

	console.log(arr);


NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {
  if (err) {
    console.log(err);
    return;
  }

	for(var i in arr){

		console.log(i);
		console.log(arr[i]);
		eval(i+'._value ='+' arr[i]' +';');


		
	}

});

res.redirect('/main');
});

router.get('/main', function(req, res, next) {



var x=[];

NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {
	  if (err) {
	    console.log(err);
	    
	  }else{

	  	x=getformarr('',conf);

	  	console.log(x);

	  	 res.render('mainconfig.ejs',{elements:x});

		

	}	

	});


 
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



function getformarr(type,cnf){

	var conf=cnf;
	var t,m;



	if(type==''){



		t= Object.keys(eval('conf.nginx'));

	}else{

		t= Object.keys(eval('conf.nginx.'+type));

	}		
	console.log('dhuhudf');
var l=eval('conf.nginx.http');

	var z=JSON.stringify(l);

	var pssed=JSON.parse(z)

		console.log(pssed);

	for(var y in pssed){

		if(y.constructor == Object){
			console.log(y.constructor);
		}else{
			//console.log(y);
			console.log(y);
			console.log(pssed[y].constructor);
		}
	}

	t.shift();
	t.shift();
	t.shift();
	t.shift();

	var arr=[];

	


	if(type ==''){

		for(var i in t) {  

			

			if(eval('conf.nginx.'+t[i]+'._value') == ''){
				
			}else{
				arr.push({name:t[i],url:'conf.nginx.'+t[i], value:eval('conf.nginx.'+t[i]+'._value')});
			}

			


		}



	}else{

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
			    		

			    		for(var k in j){

			    			arr.push({name:t[i] +' - ' + j[k],url:'conf.nginx.http.'+t[i]+'.'+j[k],value:eval('conf.nginx.http.'+t[i]+'.'+j[k]+'._value')});

			    		}

			    }else{

			    		arr.push({name:t[i],url:'conf.nginx.http.'+t[i], value:eval('conf.nginx.http.'+t[i]+'._value')});



			    	}


			    
			    }
			}

	}

	
	
	return arr;
}


module.exports = router;

