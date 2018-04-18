var express = require('express');
var bodyParser = require('body-parser') 
var app = express();

app.set('port', (process.env.PORT || 3000));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post('/register',function(request,response){

	if (request.body.email!=null && request.body.password!=null && request.body.phone!=null) {

		var returnObj = {
				    		status: "1",
				    		message: "Registeration success.",
				    		body: {
				    			email: request.body.email,
				    			phone: request.body.phone
				    	}
				    }
		response.status(200).send(returnObj);
	}else{
		var returnObj = {
				    		status: "0",
				    		message: "Registeration failed.",
				    		body: {}
				    	};
		response.status(403).send(returnObj);
	}
});







