/**
 * New node file
 */
/*exports.addEmployee = function(req, res){
  
  console.log("in add employee function4"+req.employeeId);
};*/
var mongo = require('mongodb');
var Db = mongo.Db,
	BSON = mongo.BSONPure,
	server = new mongo.Server('localhost', 27017, {auto_reconnect: true},{safe:true}),
	db = new Db('leaveApplication', server);
 
db.open(function(err, db) {
if(!err) {
console.log("Connected to 'leaveApplication' database");
db.collection('employeeRecords', {strict:true}, function(err, collection) {
if (err) {
console.log("The 'employeeRecords' collection doesn't exist. Creating it with sample data...");
}
});
}
});


exports.addEmployee = function(req, callback) {
	var employee = {
			
			empId : req.employeeId,
			empName: req.employeeName,
			empEmail: req.emailId,
			employeeDesignation: req.designation,
			tatalLeavesApplicable: req.tla,
			leavesGranted:0,
			leavesApprovedDates : ["NIL"],
			leaveAppliedDatesSubmitted : ["NIL"],
			totalLeavesApplied : 0,
			totalLeaveBalanace : req.tla,
			reasonForApplyleave : "NIL",
			leavesCancelledDates : ["NIL"],
			leaveCancellationSubmitted : ["NIL"],
			totalLeavesCancelled : "0",
			reasonForCancelLeave : "NIL",
			aproveLeaveStatus : "NIL",
			cancelLeaveStatus: "NIL",
			leaveApproverId : ["AIN015","AIN001"],
			leaveApproverEmail: [req.managerEmailId,"srilatha.vellanki@atmecs.com"]

			
			
			};
			var info= {};
			console.log('Adding New Employee: ' + JSON.stringify(employee));
			db.collection('employeeRecords', function(err, collection) {
				collection.insert(employee,function() {
			          callback(null, employee);
										
				});
				
			});
			
	
};
exports.submitLeave = function(req, callback) {
			var insertData=JSON.stringify(req);
			console.log("first"+insertData);
			var userEmailId="sindhu.sathyanarayana@atmecs.com";// get from session.. Vinay integaration.
		    db.collection('employeeRecords', function(err, collection) {
		        collection.findOne({empEmail: userEmailId},function(err, empRecords) {
		        	if (err) {
		        		callback(err);
		    		} 
		        	else{
		        		console.log("employee=="+JSON.stringify(empRecords));
		    			empObjectId=empRecords._id;
		    			var employeeInsert = JSON.parse(insertData);
		    			employeeInsert.empId=empObjectId.toString();
		    	    	if(empObjectId!=null){
		    		        db.collection('employeeLeaveRequest', function(err, collection) {
		    		    		collection.insert(employeeInsert, {safe:true}, function(err, result) {
		    		    			if (err) {
		    		    				callback(err);
		    		    			} else {
		    		    			console.log('Success Employee Leave: ' + JSON.stringify(result[0]));
		    		    				empObjectId= JSON.stringify(result[0]);
		    		    				callback(null, result);
		    		    			}
		    		    		});
		    		    	});
		    	    	}
		    	    	
		    	    	
		    		}	
		         });
				       
		        
		    });
};
exports.holidayList = function(req, callback) {
	db.collection('holidayCalendar', function(err, collection) {
		collection.find().toArray(function(err, items) {
		if(err) { 
			callback(err);
			}
			else {
			console.log("items=="+JSON.stringify(items));
			callback(null,items);
			}	
		});
	});
};

exports.cancelLeave = function(req, callback) {
	var insertData=JSON.stringify(req);
	var userEmailId="sindhu.sathyanarayana@atmecs.com";// get from session.. Vinay integaration.
    db.collection('employeeRecords', function(err, collection) {
        collection.findOne({empEmail: userEmailId},function(err, empRecords) {
        	if (err) {
        		callback(err);
    		} 
        	else{
        		console.log("employee=="+JSON.stringify(empRecords));
    			empObjectId=empRecords._id;
    			var employeeInsert = JSON.parse(insertData);
    			employeeInsert.empId=empObjectId.toString();
    	    	if(empObjectId!=null){
    		        db.collection('employeeLeaveRequest', function(err, collection) {
    		    		collection.insert(employeeInsert, {safe:true}, function(err, result) {
    		    			if (err) {
    		    				callback(err);
    		    			} else {
    		    			console.log('Success Employee Leave: ' + JSON.stringify(result[0]));
    		    				empObjectId= JSON.stringify(result[0]);
    		    				callback(null, result);
    		    			}
    		    		});
    		    	});
    	    	}
    	    	
    	    	
    		}	
         });
		       
        
    });
};




exports.getLeaveDetails = function(req,callback) {
	
	console.log("req email"+req);
	var email= req;
	db.collection('employeeRecords', function(err, collection) {
	collection.find({"empEmail":email}).toArray(function(err, leaveStatus) {
		if(err) { callback(err);}
		else {
		console.log(leaveStatus[0]);
		callback(null,leaveStatus[0]);
		}	
		
	}); 
	});

};