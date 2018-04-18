var express = require('express');
var mysql      = require('mysql');
var bodyParser = require('body-parser') 
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var connection;

function handleDisconnect() {
  connection = mysql.createConnection({
				  host     : '162.215.253.14',
				  user     : 'intri9i1',
				  password : 'Jlamwtf__0032',
				  database : 'intri9i1_cakery'
									}); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

//to login a user
app.post('/login',function(request,response){
	  console.log('The request is: ', request.body);


	connection.query('SELECT * from profile WHERE email="'+request.body.email+'" AND password="'+request.body.password+'"', function(err, rows, fields) {
	  	if (err) {
			console.log("error while registering!!","user/register");
			var returnObj = {
			    		status: "fail",
			    		message: "Unable to Login.",
			    		body: {}
			    	};
	   		response.status(500).send(returnObj);
			return;
		}else{
			if (rows.length > 0) {
			    	var returnObj = {
			    		status: "success",
			    		message: "Logged in successfully.",
			    		body: rows[0]
			    	};
			    	response.send(returnObj);
		    } else {

			    	var returnObj = {
			    		status: "fail",
			    		message: "Please check login credentials!",
			    		body: {}
			    	};
			    	response.status(403).send(returnObj);
		    } 
		}
	});

});

//to register a new user
app.post('/user/register',function(request,response){

	connection.query('SELECT * from profile WHERE email=" '+request.body.email+'"', function(err, rows, fields) {
	   	if(err) {
	   		console.log("error while registering!!","user/register");
	   		var returnObj = {
			    		status: "fail",
			    		message: "Unable to register.",
			    		body: {}
			    	};
	   		response.status(500).send(returnObj);

			return;
		}else{
			if (rows.length > 0) {
			    	var returnObj = {
			    		status: "fail",
			    		message: "Email Id already in use.",
			    		body: {}
			    	};
			    	response.send(returnObj);
		    } else {

				connection.query('INSERT INTO profile (`id`, `name`, `email`, `password`, `phone`) VALUES ("", " '+ request.body.name + '", " '+ request.body.email + '", " '+ request.body.password + '", " '+ request.body.phone + '")', function(err, rows, fields) {
				  if (err) throw err;


						var body = {};

						connection.query('SELECT * from profile WHERE email=" '+request.body.email+'"', function(err, rows, fields) {
	  						if(rows.length > 0){
						    	body = rows[0];
						    }

						    var returnObj = {
					    		status: "success",
					    		message: "User registered successfully.",
					    		body: body
					    	};
					    	response.send(returnObj);
						});

				});
					    
			}
		}

	});
});


//connection.end();

//to add a product
app.post('/product/add',function(request,response){
	var queryString = 'INSERT INTO products (`productId`, `productName`, `productPrice`, `productDescription`, `productImage`, `productAvailability`, `productType`,`productAddedTime`,`productExpiryTime`,`productDiscount`) VALUES ("", "'+request.body.productName+'", "'+request.body.productPrice+'", "'+request.body.productDescription+'", "'+request.body.productImage+'", "'+request.body.productAvailability+'", "'+request.body.productType+'",NOW(), "'+request.body.productExpiryTime+'", "'+request.body.productDiscount+'")';
		   console.log("error while adding product!!",queryString);

	connection.query(queryString, function(err, rows, fields) {
	   	if(err) {
	   		console.log("error while adding product!!","product/add"+err);
	   		var returnObj = {
			    		status: "fail",
			    		message: "Unable to add product.",
			    		body: {}
			    	};
	   		response.status(500).send(returnObj);

			return;
		}else{
			var returnObj = {
			    		status: "success",
			    		message: "Product added successfully.",
			    		body: {}
			    	};
	    	response.send(returnObj);
		}
	});

});

//to get all products
app.get('/product/all',function(request,response){

	connection.query('SELECT * from products', function(err, rows, fields) {
	   	if(err) {
	   		console.log("error while getting all products!!","product/all"+err);
	   		var returnObj = {
			    		status: "fail",
			    		message: "Unable to find products.",
			    		body: {}
			    	};
	   		response.status(500).send(returnObj);

			return;
		}else{

			var body = {};

			if(rows.length > 0){
		    	body = rows;
		    }

		    var returnObj = {
	    		status: "success",
	    		message: "products fetched successfully.",
	    		body: body
	    	};
	    	response.send(returnObj);

		}

	});
});







