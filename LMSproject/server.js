
/**
 * Module dependencies.
 */
var express = require('express'),
   routes = require('./routes'),
   User = require('./routes/user'),
   employeeInfo = require('./routes/employeeRecords'),
   http = require('http'),
   path = require('path'),
   nodemailer = require("nodemailer"),
   //redisStore = require('connect-redis')(express),
   passport = require('passport'),
   googleStrategy = require('passport-google-oauth').OAuth2Strategy,
   clientID = '888479721397-aeuk0osmgfe92998srsevoo9ies6rese.apps.googleusercontent.com',
   clientSecret	='u0RtLkq0HYrDiyp2mmIlfjVo',
   app = express(),
   userProfile={};
var accessToken;
var smtpTransport= nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
    	
        user: "charan.kumar@atmecs.com",
        pass: "charan@atmecs"
    }
});
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.cookieParser());
/*app.use(express.session({ store: new RedisStore({
	  host:'127.0.0.1',
	  port:6380,
	  prefix:'sess'
	}), secret: 'SEKR37' }));*/
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
passport.use(new googleStrategy({
    clientID        : clientID,
    clientSecret    : clientSecret,
    callbackURL     : 'http://localhost:3000/oauth2callback',

},
function(accessToken, refreshToken, profile, done) {
	console.log("is loggedin1");
	// make the code asynchronous
	// User.findOne won't fire until we have all our data back from Google
	if(profile._json.hd === "atmecs.com"){
		
		
	process.nextTick(function() {
		
		//userProfile.name = profile.displayName;
		//userProfile.id= profile.id;
		userProfile.email= profile.emails[0].value;
		accessToken=accessToken;
		//userProfile.token= token;
		//userProfile.picture=profile._json.picture;
		console.log(profile._json.hd+""+profile._json.picture);
		done(null, profile);

        // try to find the user based on their google id
       
    });
	}
	else
		{
		
	        // fail        
	        done(new Error("Invalid host domain"));
	    
		}

}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/oauth2callback',
        passport.authenticate('google', {
                successRedirect : '/home',
                failureRedirect : '/'
        }));

app.get('/home', function(req, res, next) {
	
	var emailId= userProfile.email;
	employeeInfo.getLeaveDetails(emailId,function(err,leaveStatus){
		//console.log(leaveStatus);
		res.render('home.ejs',{userinfo :leaveStatus });
	});
	});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
app.post('/addemployee', function(req, res,next){
	console.log("in ap.post method");
	employeeInfo.addEmployee(req.body, function( error, docs) {
		console.log("user!@"+docs);
        //res.redirect('/');
			/*function(err,user ) {
        if(err) return next(err); // do something on error
		console.log("user"+user);*/
		var mailOptions = {
				
			    from: "vinaykorupolu@gmail.com", // sender address
			    to: req.body.emailId, // list of receivers
			    subject: "Welcome to Atmecs Leave Management System", // Subject line
			    text: "Hello world ✔", // plaintext body
			    html: "dsf"+req.body.emailId+"sdaf" // html body
			};
		/*smtpTransport.sendMail(mailOptions, function(error, response){
		    if(error){
		        console.log(error);
		    }else{
		        console.log("Message sent: " + response.message);
		    }
		});*/

        res.json(docs); // return user json if ok	
	
		
    });
});
app.post('/submitLeave', function(req,res) {
	
	//console.log(req.body);
	
	employeeInfo.submitLeave(req.body,function( error, docs){
		console.log("Submit Leave"+docs);
		res.json(docs);
	});
});
app.get('/holidayList',function(req,res){
	employeeInfo.holidayList(req,function(err,items){
		console.log("items"+items);
		res.json(items);
		
	});
});
/*app.post('/sendMail',function(req,res){
	var url= "localhost:3000/auth/google";
	var html1= "";
	html1 += '<a href='+url+'>clickhere</a>';
	var mailOptions = {
			
		    from: "vinaykorupolu@gmail.com", // sender address
		    to: "vinaykumar.korupolu@atmecs.com", // list of receivers
		    subject: "Welcome to Atmecs Leave Management System", // Subject line
		    text: "Hello world ✔", // plaintext body
		    html: html1 // html body
		};
	smtpTransport.sendMail(mailOptions, function(error, response){
	    if(error){
	        console.log(error);
	    }else{
	        console.log("Message sent: " + response.message);
	    }
	});

	
});*/
app.post('/cancelLeave', function(req,res) {
	
	//console.log("user profile"+JSON.stringify(userProfile));
	//cancelInfo.emailid=userProfile.email;
	//console.log("in appjs cancel"+request.emailId+"and"+JSON.stringify(request.body));
	employeeInfo.cancelLeave(req.body,function( error, docs){
		console.log("Cancel Leave"+docs);
		res.json(docs);
	});
});

function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		{
		return next();
		}
	else
		{
		console.log("is loggedin");
		return next();
		}
	
	
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
