var express = require('express');
var bodyParser =require("body-parser");
var router = express.Router();
var os = require('os');
var path = require('path');
var NginxConfFile = require('nginx-conf').NginxConfFile;

var app= express();
 app.set("view engine", 'ejs');
 app.use(express.static(__dirname + '/views'));
 app.use(bodyParser());
var server=require('http').createServer(app);




var io = require('socket.io')(server);
   
server.listen('4444');

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('res', function () {
    // we tell the client to execute 'new message'

    var ramusg=((os.totalmem()/1024.00)/1024.00)-((os.freemem()/1024.00)/1024.00);

    socket.emit('res', {



      rmu: ramusg,frm:((os.freemem()/1024.00)/1024.00),host:os.hostname(),utime:format(os.uptime())});

    
 });
});



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

	  //	console.log(x);

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

		console.log(arr);

		if(String(arr[i]).split(',').length > 1){

			var spt= [];
			spt= String(arr[i]).split(',');

			// console.log(spt);

			for(var u=0; u<spt.length ;u++){

				//console.log(String(spt[u]).split(" ")[0]);
				eval('conf.nginx.http._remove('+ 'String(spt[u]).split(" ")[0]'+', u);');
			}


			for(var j in spt){

				console.log(String(spt[j]).split(" ")[0]);

				var q= "conf.nginx.http._add("+' String(spt[j]).split(" ")[0]'+","+' String(spt[j]).split(" ")[1].replace(";","")'+");";

				eval(q);

				// console.log(q);

				// console.log(eval(q));
			}

		}else{

			var q= i+"._value = "+ 'arr[i]'+";";

			eval(q);
		}

	}

});

});





function getformarr(type,cnf){

	var conf=cnf;
	var t,m,l;



	if(type==''){


		l=eval('conf.nginx');
		t= Object.keys(eval('conf.nginx'));

	}else{
		l=eval('conf.nginx.'+type);
		t= Object.keys(eval('conf.nginx.'+type));

	}		
	//console.log('dhuhudf');

	

	var z=JSON.stringify(l);

	var pssed=JSON.parse(z)

		//console.log(pssed);

	var arr=[];

	


	if(type ==''){

		for(var i in pssed) {  

			

			if(pssed[i].constructor == Array){

				console.log('arrrr');
				
			}else{
				arr.push({name:i,url:'conf.nginx.'+i, value:eval('conf.nginx.'+i+'._value')});
			}

			


		}



	}else{

			for(var i in pssed) {      

				//console.log(eval('conf.nginx.'+type+'.'+i).constructor);

			    if(eval('conf.nginx.'+type+'.'+i).constructor == Array) {


			    	var ldata=Object.keys(eval('conf.nginx.'+type+'.'+i));

			    	//console.log(ldata);

				    					for(var yt in ldata){

				    						//console.log('********');

				    						var mydt=eval('conf.nginx.'+type+'.'+i+'['+yt+']');

				    						var mkeys=Object.keys(eval('conf.nginx.'+type+'.'+i+'['+yt+']'));
				    						
				    						if(mydt.constructor == Object){

				    								if(eval('conf.nginx.'+type+'.'+i+'['+yt+']._value') == ''){
				    										var mnkeys=Object.keys(eval('conf.nginx.'+type+'.'+i+'['+yt+']'));

				    										mnkeys.shift();
				    										mnkeys.shift();
				    										mnkeys.shift();
				    										mnkeys.shift();

				    									// /console.log(mnkeys);
				    									console.log('**********');

				    									for(var mk in mnkeys){

				    										console.log(eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]).constructor);

				    										if(eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]).constructor == Array){

				    											var arkeys=Object.keys(eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]));

				    											console.log(arkeys);

				    											for(var r in arkeys){

				    													arr.push({name:i +'-'+mnkeys[mk]+'-'+arkeys[r],url:'conf.nginx.'+type+'.'+i[yt], value:eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]+'['+arkeys[r]+']._value')});

				    											}

				    											

				    											


				    										}else if(eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]).constructor == Object){

				    												arr.push({name:i +'-'+mnkeys[mk],url:'conf.nginx.'+type+'.'+i[yt], value:eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]+'._value')});
				    										}

				    									}


				    							
				    							}else{

				    									arr.push({name:i +'-',url:'conf.nginx.'+type+'.'+i[yt], value:eval('conf.nginx.'+type+'.'+i+'['+yt+']._value')});

				    							}

				    						}else{

				    								
				    							}

				    						

				    					}


			    	
			    						// for(var y in mydt){
				    												    								
				    					// 			if(mydt[y].constructor == Array){

				    					// 				if(eval('conf.nginx.'+type+'.'+i+'['+yt+']')== Array){

				    					// 						arr.push({name:i +'-'+yt,url:'conf.nginx.'+type+'.'+i+'['+yt+']', value:eval('conf.nginx.'+type+'.'+i+'['+yt+']._value')});

				    					// 				}else{
				    					// 						arr.push({name:i +'-'+yt,url:'conf.nginx.'+type+'.'+i+'['+yt+']', value:eval('conf.nginx.'+type+'.'+i+'['+yt+']._value')});
				    					// 				}

				    										
				    									
				    									
				    									
				    									
				    					// 			}else if(mydt[y].constructor == Object){

				    					// 				//arr.push({name:i +'-'+yt,url:'conf.nginx.'+type+'.'+i[yt], value:eval('conf.nginx.'+type+'.'+i+'['+yt+']._value')});

				    					// 			}
				    								
				    					// 		}
			    //	console.log(i +' == '+  eval('conf.nginx.http.'+ i +'._value'));
			    //	arr.push({name:i,url:'conf.nginx.'+type+'.'+i, value:eval('conf.nginx.'+type+'.'+i)});

			    } else {
			    // Do another thing

			     if(eval('conf.nginx.'+type+'.'+i+'._value') == ''){
			  		var j=Object.keys(eval('conf.nginx.'+type+'.'+i))
						  j.shift();
						  j.shift();
						  j.shift();
						  j.shift();
			    		var data =[];
			    				data=Object.keys(eval('conf.nginx.'+type+'.'+i));

			    					data.shift();
			    					data.shift();
			    					data.shift();
			    					data.shift();




			    		for(var k in data){

			    				
				    				if(eval('conf.nginx.'+type+'.'+i+'.'+data[k]+'').constructor == Array) {
				    	
				    					var tdata=eval('conf.nginx.'+type+'.'+i+'.'+data[k]+'');

				    					for(var yt in tdata){

				    						var mydt=eval('conf.nginx.'+type+'.'+i+'.'+data[k]+'['+yt+']');
				    						//console.log(mydt);
				    						if(mydt.constructor == Object){

				    							var mdata=eval('conf.nginx.'+type+'.'+i+'.'+data[k]+'['+yt+']'+'.'+'_value');

				    							if( mdata != null && data[k] == 'location'){

				    								arr.push({name:i +'-'+data[k]+mdata,url:'conf.nginx.'+type+'.'+i+'.'+data[k]+'['+yt+']', value:eval('conf.nginx.'+type+'.'+i+'.'+data[k]+'.'+mdata+'._value')});
				    								

				    							}else{

				    								arr.push({name:i +'-'+data[k],url:'conf.nginx.'+type+'.'+i+'.'+data[k]+'['+yt+']', value:mdata});
				    							}

				    						}

				    						

				    					}

				    				
				    				

						    		}else{
						    			
						    			arr.push({name:i +' - ' + data[k],url:'conf.nginx.'+type+'.'+i+'.'+data[k],value:eval('conf.nginx.'+type+'.'+i+'.'+data[k]+'._value')});
						    		}

					     		}

			    }else{

			    		arr.push({name:i,url:'conf.nginx.'+type+'.'+i, value:eval('conf.nginx.'+type+'.'+i+'._value')});



			    	}


			    
			    }
			}

	}

	
	
	return arr;
}


function format(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}
module.exports = router;

