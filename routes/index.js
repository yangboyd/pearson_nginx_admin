var express = require('express');
var bodyParser =require("body-parser");
var parser = require('./parser');
var router = express.Router();
var cpu=require('./cpu.js');
var os = require('os');
var path = require('path');
var NginxConfFile = require('nginx-conf').NginxConfFile;
var sys = require('sys');
var exec = require('sync-exec');


//var parser = require("nginx-log-parser")(source);

var app= express();
 app.set("view engine", 'ejs');
 app.use(express.static(__dirname + '/views'));
 app.use(bodyParser());
var server=require('http').createServer(app);


var child,cp;





var io = require('socket.io')(server);
   
server.listen('4445');

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('res', function () {
    // we tell the client to execute 'new message'
    cp=cpu.foo(os);
    

    var ramusg=((os.totalmem()/1024.00)/1024.00)-((os.freemem()/1024.00)/1024.00);

    socket.emit('res', {rmu: ramusg,frm:((os.freemem()/1024.00)/1024.00),host:os.hostname(),utime:format(os.uptime()),cpu:cp});

    
 });


});

// Listen for incoming socket requests on the special “connection” event

/* GET home page. */


router.get('/', function(req, res, next) {

	var nginxv="";
	 var sarr1=[];
	 var sarr="";
	 var err="";
	 
	
 sarr = exec('cat /var/log/nginx/access.log').stdout;
 nginxv=exec('nginx -v').stderr;

 var ngerr=exec('nginx -t').stderr;

 if((ngerr.search('syntax is ok') != -1) && (ngerr.search('test is successful') != -1) ){
 	err=''

 }else if((ngerr.search('syntax is ok') == -1)){

 	err='There is a syntax error in the nginx.conf file.'

 }else if(ngerr.search('test is successful') == -1){

 	err='There is an error in the configuration file. Nodes you have entered might be causing the error.'
 }

 //console.info(nginxv);
 console.info(ngerr);

// console.log(sarr);
  
//   console.log(child1.stdout.on);

  var str = new String(sarr);

	//console.info(str);
 
  console.log(str.split('\n').length);
 

   for(var t in str.split('\n')){

  	
  	var data = parser(str.split('\n')[t]);
 	
 	sarr1.push(data);

 	//console.log(data);
	
  }

  //console.log(sarr1);

  NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {
	  if (err) {
	    console.log(err);
	    
	  }else{

	  	var s=conf.nginx.http.server;

	  	//console.info(s);

	  	var h= new String(s);

	  	var msites=getsites(h);

	  	//console.log(sarr);

	}	

	});



res.render('index.ejs',{version:nginxv,error:err}); 
  
});


router.post('/pathpostconfig', function(req, res, next) {
	var err="";

	NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {
	  if (err) {
	    console.log(err);
	    
	  }else{

	 var arr=[];

	arr=req.body;

	for(var t in arr){

		console.log(eval(t+'._value = '+'arr[t]'+';'));

		console.log(t+'._value = '+arr[t]);
	}

	//console.log(arr);


	
	res.redirect('/path');

	}	

	});


  
});



router.get('/path', function(req, res, next) {

	var arr=[];

NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {
	var err="";
	  if (err) {
	    console.log(err);
	    
	  }else{

	  arr=getlocationforms('http',conf);


	  var ngerr=exec('nginx -t').stderr;

 if((ngerr.search('syntax is ok') != -1) && (ngerr.search('test is successful') != -1) ){
 	err=''

 }else if((ngerr.search('syntax is ok') == -1)){

 	err='There is a syntax error in the nginx.conf file.'

 }else if(ngerr.search('test is successful') == -1){

 	err='There is an error in the configuration file. Nodes you have entered might be causing the error.'
 }

	  //console.log(arr[0][0].vars);
	  res.render('pathconfig.ejs',{elements:arr}); 

	}	

	});

 

  
});


router.get('/general', function(req, res, next) {

  res.render('genaral.ejs');

});


router.get('/http', function(req, res, next) {

var x=[];
var y=[];
var err="";
NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {
	  if (err) {
	    console.log(err);
	    
	  }else{

	  	x=getformarr('http',conf);
	  	//console.log(x);
	  	
	  	y=ElementAdder(x);

	  //	console.log(x);

	  	//console.info(JSON.stringify(y));
	  	
	  	var html='';

	  	for(var t in y)
	  	{
	  		html+=builditems(y[t]);
	  	}

	  child = exec("nginx -t");


var ngerr=exec('nginx -t').stderr;

 if((ngerr.search('syntax is ok') != -1) && (ngerr.search('test is successful') != -1) ){
 	err=''

 }else if((ngerr.search('syntax is ok') == -1)){

 	err='There is a syntax error in the nginx.conf file.'

 }else if(ngerr.search('test is successful') == -1){

 	err='There is an error in the configuration file. Nodes you have entered might be causing the error.'
 }




	  res.render('httpconfig.ejs',{elements:x,nodes:html,error:err} );

	}	

	});
  
});

router.post('/nodepost',function(req,res,next){

	var arr=req.body;

	NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {

		if(arr.value ==''){
			eval(arr.url+"._add("+'arr.header'+");");
		}else{
			eval(arr.url+"._add("+'arr.header'+","+'arr.value'+");");
		}
		

	});


	child = exec("nginx -t");
	//console.log(arr);

	res.redirect(arr.surl);
});


router.post('/removenodepost',function(req,res,next){

	var arr=req.body;

	NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {

		var splitt= arr.url.split('.');

	var url='';

		for(var o=0;o < splitt.length -1;o++){

			//console.log(splitt[o]);

			if(o== (splitt.length -2)){

				url+=splitt[o];

			}else{
				url+=splitt[o]+'.';
			}
			

		}

		//console.log((splitt.reverse()[0]).indexOf('['));

		if((splitt.reverse()[0]).indexOf('[') == -1){
			eval(url+"._remove("+'splitt[0]'+");");

			console.log(url);
			console.log(splitt.reverse()[0]);
		}else{
			
			var x=	(splitt.reverse()[0]).indexOf('[');
			var y=	(splitt.reverse()[0]).indexOf(']');
			var val='';

			for(var i=x+1;i<y;i++){

				val+=(splitt.reverse()[0]).charAt(i);

			}

		//console.log(val);
			eval(url+"._remove("+'splitt.reverse()[0]'+","+'val'+");");
		}
		
		console.log(url+"._remove("+'\''+splitt.reverse()[0]+'\''+");");
		console.log(splitt.reverse()[0]);



	});

		console.log(arr.surl);

		res.redirect(arr.surl);
	
});

router.get('/swconfig', function(req, res, next) {

	var nginxv="";
	var err="";

  child = exec("nginx -v");

 var ngerr=exec('nginx -t').stderr;

 if((ngerr.search('syntax is ok') != -1) && (ngerr.search('test is successful') != -1) ){
 	err=''

 }else if((ngerr.search('syntax is ok') == -1)){

 	err='There is a syntax error in the nginx.conf file.'

 }else if(ngerr.search('test is successful') == -1){

 	err='There is an error in the configuration file. Nodes you have entered might be causing the error.'
 }

  res.render('swconfig.ejs',{nv:nginxv,error:err});

});


router.post('/swconfigpost',function(req,res,next){



var arr=req.body;



	res.redirect('/swconfig');

});


router.post('/mainpost',function(req,res,next){

	var arr=[]

	arr=req.body;

	//console.log(arr);


NginxConfFile.create('/etc/nginx/nginx.conf', function(err, conf) {
  if (err) {
    console.log(err);
    return;
  }

	for(var i in arr){

		// console.log(i);
		// console.log(arr[i]);
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
	  	var err="";

	  	x=getformarr('',conf);



var ngerr=exec('nginx -t').stderr;

 if((ngerr.search('syntax is ok') != -1) && (ngerr.search('test is successful') != -1) ){
 	err=''

 }else if((ngerr.search('syntax is ok') == -1)){

 	err='There is a syntax error in the nginx.conf file.'

 }else if(ngerr.search('test is successful') == -1){

 	err='There is an error in the configuration file. Nodes you have entered might be causing the error.'
 }

	
	  	 res.render('mainconfig.ejs',{elements:x,error:err});
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

			var q= i+"._value = "+ 'arr[i]'+";";

			eval(q);

	}

});


res.redirect('http');

});

function getsites(h){
var sites=[];
var sites1=[];
var msite='';


var x=h.split('\n');

	  	for(var t in x){

	  		if(x[t].search('listen') !=-1){

	  			console.log(x[t]);

	  			if(x[t] != ''){
	  				sites.push(x[t]);
	  			}
	  		 	
	  		}


	  	}

	  	console.log('Hell-cat '+ValidateIPaddress('192.21.12.33:8080'));   

	  	for(var y in sites){

	  		var str= new String(sites[y]);

	  		var strarr=str.trim().split(' ');

	  		var v=strarr.reverse();

	  		if(v[0].search('default_server') != -1){

	  			if(v[1].match(/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/) != null){

	  				msite='http://localhost:'+v[1];

	  			}else if(ValidateIPaddress(v[1]) == true){

	  				msite='http://'+v[1];

	  			}

	  		}else if(ValidateIPaddress(v[1]) == true){
	  				
	  				msite='http://'+v[1];
	  			}


	  		sites1.push(msite);

	  	}

return sites1;

}


function builditems(y){

	
			//console.log(y);
	  		 var html = "<li class='dd-item dd3-item'  data-url='"+ y.url+"' data-id='" + y.name + "'>";
  			 html += "<div class='dd3-handle dd-nodrag'  data-url='"+ y.url+"'></div>";
  			 html+="<div class='dd3-content' style='padding: 0px 10px 5px 40px !important;' data-url='"+ y.url+"'>" +y.name+ "<span class='btn glyphicon glyphicon-minus col-md-push-5 rmnode' url='"+y.url+"'></span></div>";

  			//console.log(y.children);

  			
	  		if( y.children.length > 0){

	  			//console.log(y);
	  			var o = y.children;
	  			html += "<ol class='dd-list'>";

	  			//console.log(o);

	  			for(var b in o){
	  			//console.log(o[b]);
	  			//	console.log('********');
	  			//	console.log(o[b]);

	  				html+= builditems(o[b]);
	  			//	 console.log('********');
	  			}

	  			html += "</ol>";
	  		}

	  	

	  		html += "</li>";

	  		
	  	return html;
}


function getformarr(type,cnf){

	var conf=cnf;
	var t,m,l;


	var hierarchy=[];
	var child=[];

	count=1;



	if(type==''){


		l=eval('conf.nginx');
		t= Object.keys(eval('conf.nginx'));

		

	}else{
		l=eval('conf.nginx.'+type);
		t= Object.keys(eval('conf.nginx.'+type));

	}		
	//console.log('dhuhudf');

	

	var z=JSON.stringify(l);

	var pssed=JSON.parse(z);

		//console.log(pssed);

	var arr=[];

	


	if(type ==''){

		for(var i in pssed) {  

			

			if(pssed[i].constructor == Array){

				
				
			}else{

//				console.log(i);
				arr.push({name:i,url:'conf.nginx.'+i, value:eval('conf.nginx.'+i+'._value'),sid:'',pid:''});
			}

			


		}



	}else{

			for(var i in pssed) {      

				//console.log(eval('conf.nginx.'+type+'.'+i).constructor);

			    if(eval('conf.nginx.'+type+'.'+i).constructor == Array) {

			    	//console.log(i);
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
				    									//console.log('**********');

				    									for(var mk in mnkeys){

				    										//console.log(eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]).constructor);

				    										if(eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]).constructor == Array){

				    											var arkeys=Object.keys(eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]));

				    											//console.log(arkeys);

				    											for(var r in arkeys){

				    													arr.push({name:i +'-'+mnkeys[mk]+'-'+arkeys[r],url:'conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]+'['+arkeys[r]+']', value:eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]+'['+arkeys[r]+']._value'),key:mnkeys[mk],sid:'',pid:''});

				    											}

				    											

				    											


				    										}else if(eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]).constructor == Object){

				    												arr.push({name:i +'-'+mnkeys[mk],url:'conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk], value:eval('conf.nginx.'+type+'.'+i+'['+yt+'].'+mnkeys[mk]+'._value'),key:mnkeys[mk],sid:'',pid:''});
				    										}

				    									}


				    							
				    							}else{

				    									arr.push({name:i +'-',url:'conf.nginx.'+type+'.'+i+'['+yt+']', value:eval('conf.nginx.'+type+'.'+i+'['+yt+']._value'),key:'',sid:'',pid:''});

				    							}

				    						}else{

				    								
				    							}

				    					}

			    } else {
			    // Do another thing

			     if(eval('conf.nginx.'+type+'.'+i+'._value') == ''){
			  		var j=Object.keys(eval('conf.nginx.'+type+'.'+i))
						  j.shift();
						  j.shift();
						  j.shift();
						  j.shift();

						  console.log(i);
			    		var data =[];
			    				data=Object.keys(eval('conf.nginx.'+type+'.'+i));

			    					data.shift();
			    					data.shift();
			    					data.shift();
			    					data.shift();
			    					console.log(data.length);

			    		if(data.length ==0){
			    			arr.push({name:i ,url:'conf.nginx.'+type+'.'+i,value:eval('conf.nginx.'+type+'.'+i+'._value'),key:'',sid:'',pid:''});
			    		}else{

			    			for(var k in data){

			    				
				    				if(eval('conf.nginx.'+type+'.'+i+'.'+data[k]+'').constructor == Array) {
				    	
				    					var tdata=eval('conf.nginx.'+type+'.'+i+'.'+data[k]+'');

				    					for(var yt in tdata){

				    						var mydt=eval('conf.nginx.'+type+'.'+i+'.'+data[k]+'['+yt+']');
				    						//console.log(mydt);
				    						if(mydt.constructor == Object){

				    							var mdata=eval('conf.nginx.'+type+'.'+i+'.'+data[k]+'['+yt+']'+'.'+'_value');

				    							
				    						}   						

				    					}
  								    				

						    		}else{
						    			console.log(data[k]);
						    			arr.push({name:i +' - ' + data[k],url:'conf.nginx.'+type+'.'+i+'.'+data[k],value:eval('conf.nginx.'+type+'.'+i+'.'+data[k]+'._value'),key:'',sid:'',pid:''});
						    		}

					     		}

			    		}

			    		

			    }else{

			    		arr.push({name:i,url:'conf.nginx.'+type+'.'+i, value:eval('conf.nginx.'+type+'.'+i+'._value'),key:'',sid:'',pid:''});

			    	}
			    
			    }
			}
	}
console.info(arr);
	return arr;
}

function getlocationforms(type,cnf){

var conf=cnf;

var arr=[];

var val=eval('conf.nginx.'+type+'.server');



for(var t in val)
{
	console.log(t);

	var loc=eval('conf.nginx.'+type+'.server['+t+'].location');
	var locs=eval('conf.nginx.'+type+'.server['+t+']');

			
	for(var r in locs){

		//console.log(r);
	}
	if(locs['location'] == null){

		//console.info('null')
		continue;
	}
	
	//console.log('*******');
	//var j=Object.keys(loc).length;


	var j=locs['location'].length;
	//console.log(j);
	
	//console.log(locs);




	if(j == null){

		var arr2=[];
		var marr1=[];

		var locd=eval('conf.nginx.'+type+'.server['+t+'].location');

		console.log('------- 1');


		var x=Object.keys(locd);
			x.shift();
			x.shift();
			x.shift();
			x.shift();

			console.log(x);

			if(x.length > 0)
			{

				console.log('------- 2');
				for(var w in x){

					console.log('------- 3');

					arr2.push({name:x[w],url:'conf.nginx.'+type+'.server['+t+'].location.'+x[w],value:eval('conf.nginx.'+type+'.server['+t+'].location.'+x[w]+'._value')});

				}

				console.log('------- 6');
				marr1.push({mname:eval('conf.nginx.'+type+'.server['+t+'].location._value'),vars:arr2 } );
	
				
			}else{

				console.log('------- 4');
				arr1.push({name:x,url:'conf.nginx.'+type+'.server['+t+'].location',value:eval('conf.nginx.'+type+'.server['+t+'].location.'+'_value')});

				marr1.push({mname:eval('conf.nginx.'+type+'.server['+t+'].location._value'),vars:arr2});
			}

			arr.push(marr1);
	}else{
		console.log('------- 5');


	for(var h=0 ;h<loc.length;h++){


		//console.log(h);
		if(loc[h].constructor == Object){

			var arr1=[];
			var marr=[];

			var locd=eval('conf.nginx.'+type+'.server['+t+'].location['+h+']');


			var x=Object.keys(locd);
			x.shift();
			x.shift();
			x.shift();
			x.shift();

			if(x.length >0)
			{
				for(var w in x){

					arr1.push({name:x[w],url:'conf.nginx.'+type+'.server['+t+'].location['+h+'].'+x[w],value:eval('conf.nginx.'+type+'.server['+t+'].location['+h+'].'+x[w]+'._value')});

				}

				marr.push({mname:eval('conf.nginx.'+type+'.server['+t+'].location['+h+']._value'),vars:arr1,murl:'conf.nginx.'+type+'.server['+t+'].location['+h+']' } );
				
			}else{

				
				arr1.push({name:x,url:'conf.nginx.'+type+'.server['+t+'].location['+h+']',value:eval('conf.nginx.'+type+'.server['+t+'].location['+h+'].'+'_value')});

				marr.push({mname:eval('conf.nginx.'+type+'.server['+t+'].location['+h+']._value'),vars:arr1,murl:'conf.nginx.'+type+'.server['+t+'].location['+h+']'});
			}

			arr.push(marr);
		}

	}

	}

}

console.info(arr);

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


function ElementAdder(arr){

	var data = arr;
	var arr=[];
	var parr=[];
	var elarr=[];
	count=1;

	//console.log(arr);

	for(var i in data){



		var y = new String(data[i].url);
		var split=y.split('.');

		console.info(i);

		for(var f=0; f<split.length; f++){
				//console.log(split[f]);

			if( objectfinder(arr,split[f]) == 1){

				if((split[f] != 'conf') && (split[f] != 'nginx')){

						
					//console.log(f);
					if(f == 0){
							

					arr.push({name:split.reverse()[0],id:count,parent:split.reverse()[1],url:data[i].url,children:new Array()});

					}else{
						console.info(split[f]);
					arr.push({name:split[f],id:count,parent:split.reverse()[1],url:data[i].url,children:new Array()});

					}

					
				}
				count++;
				
			}
		}
	}

	//console.info(arr);

	for(var r in arr){
	
		if(objectfinder(parr,arr[r].name) == 1){

			var x=arr[r].url.lastIndexOf(arr[r].name);
			var y =arr[r].name.length;

			var url=arr[r].url.slice(0,x+y);

			//console.log(x);

			var par=url.split('.');

			var t=arr[r].url.substring(0,4);

			parr.push({name:arr[r].name,id:arr[r].name,children:new Array(),url:url,parent:par.reverse()[1]});

		}
	}

	//console.info(arr);

	for(var k in parr){

		for(var f in parr)
		{
			if(parr[k].parent == parr[f].id){

				parr[f].children.push(parr[k]);

			}
		}


	}

	for(var k in parr){

		for(var f in parr)
		{
			if((parr[f] != null) && (parr[k] != null)){

				if(objectfinder(parr[f].children,parr[k].name)){

				//parr[f].children.push(parr[k]);
				
				if(parr[k].name != 'http'){
					//console.info(parr[k]);
					parr.splice(k,1,null);
				}
				

			}

			}
			
		}


	}

	parr=parr.filter(function(n){ return n != undefined });

	
	//console.info(parr);

	return parr;
}

function objectfinder(arr,mname){

	for(var t in arr){

		if(arr[t].name == mname){

			return -1;
		}
	}
	return 1;
}

function ValidateIPaddress(ipaddress)   
{  

	if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\:([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/.test(ipaddress)){
     
    return (true) 

  }else if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))  
 	{
  	return (true)
  }  	

return (false)  
} 




module.exports = router;
