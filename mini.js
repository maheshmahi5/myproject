'use strict';

const Hapi = require('@hapi/hapi');
const MySQL = require('mysql');

const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
server.route({
	method:'GET',
	path:'/',
    handler: (request, h) => {
    	return 'hello world'
}
});

server.route({
        method: 'GET',
        path:'/api/producer',
        handler: (request, h) => {
       	return new Promise((resolve,reject)=>{

		const connection = MySQL.createConnection({
     	host: 'localhost',
    	user: 'root',
     	database: 'project'
       });
     	connection.connect();
  		
  		connection.query('SELECT * from producer',function (error, results, fields) {
       if (error) 
       	{
       		reject(error);
       	}
 			resolve(results);
            });
  		connection.end()
        }); 
    }
    });

server.route({
	method:'POST',
	path :'/api/producer',
	handler:(request,h)=>{
		var new_name=request.payload.name;
	 	var new_email=request.payload.email;
	 	var new_password=request.payload.password;
	 	var new_twittername=request.payload.twittername;
	 	var new_soundcloud=request.payload.soundcloud;
	 	var new_status=request.payload.status;

	 	if(new_name.length>32)
		return "length should be less than 32 characters only"
		else if((new_email.includes("@gmail.com")==false)&&(new_email.includes("@yahoo.com")==false))
			return "not a proper email";
		else if(new_email.length>256)
			return " length should be less than 256 characters only"
		else if(new_twittername>16)
			return "length should be less than 16 characters only"
		else if(new_soundcloud.length>32)
			return "length should be less than 32 characters only"
		else {


	 return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();

   connection.query(`insert into producer(name,email,password,twittername,soundcloud,status) values('${new_name}','${new_email}',
   	'${new_password}','${new_twittername}','${new_soundcloud}','${new_status}')`, function (error,producers, fields){
   		if (error) reject(error);

   		resolve(producers);
   		});
   	connection.end()
   })
	}
	}
});

//DELETE

server.route({
        method: 'DELETE',
        path:'/api/producer/{id}',
        handler: (request, h) => {
        var id=request.params.id;

        return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();

    connection.query(`delete from producer where id=${id}`, function (error,producers, fields) {
            if(error)  reject(error);
             
             resolve(producers)
          });
           
          connection.end();
    })
    }
});
//put

server.route({
        method: 'PUT',
        path:'/api/producer/{id}',
        handler: (request, h) => {
        var new_id=request.payload.id
        var id=request.params.id;
        var new_name=request.payload.name;
	 	var new_email=request.payload.email;
	 	var new_password=request.payload.password;
	 	var new_twittername=request.payload.twittername;
	 	var new_soundcloud=request.payload.soundcloud;
	 	var new_status=request.payload.status;

	 	if(new_name.length>32)
		return "length should be less than 32 characters only"
		else if((new_email.includes("@")==false)||(new_email.includes(".")==false))
			return "not a proper email";
		else if(new_email.length>256)
			return " length should be less than 256 characters only"
		else if(new_twittername>16)
			return "length should be less than 16 characters only"
		else if(new_soundcloud.length>32)
			return "length should be less than 32 characters only"
		else {

        return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();
    connection.query(`update producer set id=${new_id} where id=${id}`,function(error,producers,fields)
    {
    	if(error) reject (error);

    	resolve(producers)
    });
    connection.end();

   })
   }
    }
 });

//6th question 


server.route({
        method: 'GET',
        path:'/api/producer/{id}/approvedbeats',
        handler: (request, h) => {
        var id=request.params.id;

        return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();
    connection.query(`select beatname,producerid from beats where approved=1 && producerid=${id}`,function(error,result,fields)
    {
    	if(error) reject(error);

    	resolve(result)
    });
    connection.end();
	});
  }
});

//7thquestion

server.route({
        method: 'GET',
        path:'/api/producer/{id}/submittedbeats',
        handler: (request, h) => {
        var id=request.params.id;

        return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();
    connection.query(`select name,beatname from producer inner join beats on producer.id=beats.producerid where producerid=${id}`,function(error,result,fields)
    {
    	if(error) reject(error);

    	resolve(result)
    });
    connection.end();
	});
  }
});

//section 2

//1st question 

server.route({
        method: 'GET',
        path:'/api/beats/submitted',
        handler: (request, h) => {
        var id=request.params.id;

        return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();
    connection.query(`select beatname from beats  where approved!=1`,function(error,result,fields)
    {
    	if(error) reject(error);

    	resolve(result)
    });
    connection.end();
	});
  }
});

// 2nd question 

server.route({
        method: 'GET',
        path:'/api/beats/approved/{startdate}/{enddate}',
        handler: (request, h) => {
        var startdate=request.params.startdate;
        var enddate=request.params.enddate;

        return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();
    connection.query(`select beatname from beats where postdata_time > '${startdate}' and postdata_time < '${enddate}' && approved=1 `,function(error,result,fields)
    {
    	if(error) reject(error);

    	resolve(result)
    });
    connection.end();
	});
  }
});

//3rd Question

server.route({
        method: 'GET',
        path:'/api/beats/approved/{startdate}',
        handler: (request, h) => {
        var startdate=request.params.startdate;
       //var enddate=request.params.enddate;

        return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();
    connection.query(`select beatname from beats where postdata_time > '${startdate}'  && postdata_time < current_timestamp && approved=1 `,function(error,result,fields)
    {
    	if(error) reject(error);

    	resolve(result)
    });
    connection.end();
	});
  }
});

//4th question


server.route({
        method: 'GET',
        path:'/api/beats/pending',
        handler: (request, h) => {
       // var startdate=request.params.startdate;
       //var approvaldate=request.params.approvaldate;

        return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();
    connection.query(`select beatname from beats where approved=1 && approval_date is null `,function(error,result,fields)
    {
    	if(error) reject(error);

    	resolve(result)
    });
    connection.end();
	});
  }
});

// 5th question 

server.route({
	method:'POST',
	path :'/api/beats',
	handler:(request,h)=>{
		var new_beatname=request.payload.beatname;
	 	var new_url=request.payload.url;
	 	var new_approved=request.payload.approved;
	 	var new_submit_date=request.payload.submit_date;
	 	var new_approval_date=request.payload.approval_date;
	 	var new_postdata_time=request.payload.postdata_time;

	 	if(new_beatname.length>64)
		return "length should be less than 32 characters only"
		else if((new_beatname.includes("mustlisten")==true))
			return "not a proper beatname";
		
		else {


	 return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();

   connection.query(`insert into beats(beatname,url,approved,submit_date,approval_date,postdata_time) values('${new_beatname}','${new_url}',
   	'${new_approved}','${new_submit_date}','${new_approval_date}','${new_postdata_time}')`, function (error,result, fields){
   		if (error) reject(error);

   		resolve(result);
   		});
   	connection.end()
   })
	}
	}
});

//6th question


server.route({
        method: 'GET',
        path:'/api/beats/{id}',
        handler: (request, h) => {
        var id=request.params.id;

        return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();
    connection.query(`select * from beats where beatid=${id}`,function(error,result,fields)
    {
    	if(error) reject(error);

    	resolve(result)
    });
    connection.end();
	});
  }
});

//7th Question 

server.route({
        method: 'DELETE',
        path:'/api/beats/{id}',
        handler: (request, h) => {
        var id=request.params.id;

        return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();
    connection.query(`delete from beats where beatid=${id}`,function(error,result,fields)
    {
    	if(error) reject(error);

    	resolve(result)
    });
    connection.end();
	});
  }
});

//8th question  

server.route({
	method:'PUT',
	path :'/api/beats/{id}',
	handler:(request,h)=>{
		var new_beatid=request.payload.beatid
		var new_beatname=request.payload.beatname;
	 	var new_url=request.payload.url;
	 	var new_approved=request.payload.approved;
	 	var new_submit_date=request.payload.submit_date;
	 	var new_approval_date=request.payload.approval_date;
	 	var new_postdata_time=request.payload.postdata_time;
	 	var id=request.params.id;

	 	if(new_beatname.length>64)
		return "length should be less than 32 characters only"
		else if((new_beatname.includes("mustlisten")==true))
			return "not a proper beatname";
		
		else {


	 return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();

   connection.query(`update beats set beatid='${new_beatid}' where beatid=${id}`, function (error,result, fields){
   		if (error) reject(error);

   		resolve(result);
   		});
   	connection.end()
   })
	}
	}
});

//9th Question 

server.route({
	method:'PUT',
	path :'/api/beats/{id}/approve',
	handler:(request,h)=>{
		var new_beatid=request.payload.beatid
		var new_beatname=request.payload.beatname;
	 	var new_url=request.payload.url;
	 	var new_approved=request.payload.approved;
	 	var new_submit_date=request.payload.submit_date;
	 	var new_approval_date=request.payload.approval_date;
	 	var new_postdata_time=request.payload.postdata_time;
	 	var id=request.params.id;
	 return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();

   connection.query(`update beats set approval_date='${new_approval_date}' where beatid=${id}`, function (error,result, fields){
   		if (error) reject(error);

   		resolve(result);
   		});
   	connection.end()
   })
	}
	
});

//10th question


server.route({
	method:'PUT',
	path :'/api/beats/{id}/unapprove',
	handler:(request,h)=>{
		var new_beatid=request.payload.beatid
		var new_beatname=request.payload.beatname;
	 	var new_url=request.payload.url;
	 	var new_approved=request.payload.approved;
	 	var new_submit_date=request.payload.submit_date;
	 	var new_approval_date=request.payload.approval_date;
	 	var new_postdata_time=request.payload.postdata_time;
	 	var id=request.params.id;
	 return new Promise((resolve,reject)=>{
	 
	const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project'
    });
    connection.connect();

   connection.query(`update beats set approval_date="null" where beatid=${id}`, function (error,result, fields){
   		if (error) reject(error);

   		resolve(result);
   		});
   	connection.end()
   })
	}
	
});




server.start();
console.log('Server running on %s', server.info.uri);