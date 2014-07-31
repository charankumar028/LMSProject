/**
 * New node file
 */
var leaveApp = angular.module('leaveApp', []);

leaveApp.factory('myService', function($rootScope) {
	var sharedService = {};
	
	sharedService.hideStatusMessage = function() {
		$("#voice-box").fadeOut(500);
	   
	  };
	  return sharedService;
});
leaveApp.controller('navController',function($scope) {
	

	angular.element(document).ready(function () {
        console.log('Hello World');
        $('.nav li').click(function(e) {

            $('.nav li').removeClass('active').addClass('libgclr');

            var $this = $(this);
            if (!$this.hasClass('active')) {
                $this.removeClass('libgclr').addClass('active');
                if($this.hasClass('ne'))
                	{
	                	$('.leaveDetails').hide();
	                	$('.cancelLeave').hide();
	                	$('.applayLeave').hide();
	                	$('.approveLeave').hide();
	                	$('.newEmployee').show();
                	}
                else if($this.hasClass('al'))
                	{
	                	$('.leaveDetails').hide();
	                	$('.newEmployee').hide();
	                	$('.cancelLeave').hide();
	                	$('.approveLeave').hide();
	                	$('.applayLeave').show();
                	}
                else if($this.hasClass('ld'))
                	{
	                	$('.applayLeave').hide();
	                	$('.newEmployee').hide();
	                	$('.cancelLeave').hide();
	                	$('.approveLeave').hide();
	                	$('.leaveDetails').show();
                	}
                else if($this.hasClass('cl'))
                	{
	                	$('.applayLeave').hide();
	                	$('.newEmployee').hide();
	                	$('.leaveDetails').hide();
	                	$('.approveLeave').hide();
	                	$('.cancelLeave').show();
                	}
                else
                	{
	                	$('.applayLeave').hide();
	                	$('.newEmployee').hide();
	                	$('.leaveDetails').hide();
	                	$('.approveLeave').show();
	                	$('.cancelLeave').hide();
                	}
                
            };
            //e.preventDefault();
        });
    });
	
	
});
leaveApp.controller('newEmpController', function($scope,$http) {
	$scope.addEmployee = function() {
    	
    	
		if ($scope.myForm.$valid) {
			//alert('our form is amazing'+$scope.myForm);
			
			
			
			$scope.newempinfo = { employeeId: $scope.employeeId ,
					  employeeName: $scope.employeeName,
					  emailId:$scope.emailId,
					  designation:$scope.designation,
					  tla:$scope.totalLeavesApplicable,
					  managerEmailId:$scope.managerEmailId
				};
				
				var data= $scope.newempinfo;
				console.log(data.employeeId+"f"+data.employeeName+""+data.emailId);
				$http.post('/addemployee', data).success(function (data) {
				      console.log("data"+data);
				      if(data != null)
				 		 {
				    	  	console.log("hello");
					        $("#voice-box").fadeIn();
							setTimeout($scope.hideStatusMessage(), 6000);
				 		 };
				  });	
				
				$scope.employeeId = "";
				$scope.employeeName= "";
				$scope.emailId="";
				$scope.designation="";
				$scope.totalLeavesApplicable="";
				$scope.managerEmailId="";
				$scope.myForm.$setPristine();
			
		};
		
		
	};
	$scope.hideStatusMessage=function(){
			$("#voice-box").fadeOut(5000);
	};
});


leaveApp.controller('applyLeaveController', function($scope,$http) {
			$scope.submitLeave = function() {
					$scope.showSubmitleave=false;  
					var checkdate=new Date();
					var date = checkdate.getDate();
					var month =  checkdate.getMonth();
					month += 1;
					var year = checkdate.getFullYear();
					var submitdate=month+"/"+date+"/"+year;
					var fromDate=document.getElementById("datepickerFrom").value;
					var toDate=document.getElementById("datepickerTo").value;
						var showFlag=true;
					 	if(fromDate.length==0){
					 		alert("Enter From date");
					 		showFlag=false;
						}
						if(toDate.length==0){
							alert("Enter To date");
							showFlag=false;
						}
						var ONE_DAY = 1000 * 60 * 60 * 24;
					    var fromDateTime = new Date(fromDate).getTime();
					    var todateTime = new Date(toDate).getTime();
					    var dateDifference = Math.round(todateTime - fromDateTime);
					    if (dateDifference<0) {
				            alert("to date must be greater than From date");
				            showFlag=false;
				        }
					     
						if(fromDate.length!=0 && toDate.length!=0){
						    dateDifference= (Math.round(dateDifference/ONE_DAY))+1;
						}
						var emailId=$scope.leaveApproverEmail;
						if(emailId == undefined || emailId.length==0 ){
							alert("enter email");
							 showFlag=false;
						}
						else if(!emailId.match(/^\"?[\w-_\.]*\"?@atmecs\.com$/))
				        {             
				            alert('Please Enter Valid EmailId:(example@atmecs.com)');
				            showFlag=false;
				        }
						if(showFlag==true){
							 var info =
			    			   {      
			    					   leaveFromAppliedDate  : fromDate,
			    					   leaveToAppliedDate    : toDate,
			    					   reasonForApplyleave   : $scope.reasonForApplyleave,
			    					   leaveApproverEmail    : $scope.leaveApproverEmail ,
			    					   totalLeavesApplied    :dateDifference,
			    					   leaveActionStatus     : "pending",
			    					   leaveRequestType      : $scope.leaveType,
			    					    leaveActionDate      : submitdate,
						
			    			   };
							 
							 $http.post('/submitLeave', info).success(function (data) {
				            		console.log("success");
				            		
			        			$scope.showSubmitleave=true;
				            		$scope.leaveFromAppliedDate="";
				            		$scope.leaveToAppliedDate="";
				            		$scope.leaveType="";
				            		$scope.reasonForApplyleave="";
				            		$scope.leaveApproverEmail="";
			 				}).error(function(err){
			 					console.log("failure");
			 				});
						};

			
					
			};
		
			$scope.getHolidays = function() {
					
							console.log("in get");
							if($scope.holidayList == undefined)
								{
									$http.get('/holidayList').success(function (data) {
								 		
								 		console.log(data);
								 		  $scope.holidayList = data;
								 		 $scope.status = true;
								 	}).error(function(err){
								 		console.log("failure");
								 	});
								}
							else
								{
								 $scope.status = true;
								}
					};
			$scope.closed = function() {
					
					console.log("in closed");
					$scope.status=false;
					
				};

});
leaveApp.controller('cancelLeaveController', function($scope,$http) {
	
	$scope.cancelLeave= function() {
		  
			$scope.showCancelLeave=false;  
			var checkdate=new Date();
			var date = checkdate.getDate();
			var month =  checkdate.getMonth();
			month += 1;
			var year = checkdate.getFullYear();
			var submitdate=month+"/"+date+"/"+year;
			var fromDate=document.getElementById("datepickerFrom1").value;
			var toDate=document.getElementById("datepickerTo1").value;
				var showFlag=true;
			 	if(fromDate.length==0){
			 		alert("Enter From date");
			 		showFlag=false;
				}
				if(toDate.length==0){
					alert("Enter To date");
					showFlag=false;
				}
				var ONE_DAY = 1000 * 60 * 60 * 24;
			    var fromDateTime = new Date(fromDate).getTime();
			    var todateTime = new Date(toDate).getTime();
			    var dateDifference = Math.round(todateTime - fromDateTime);
			    if (dateDifference<0) {
		            alert("to date must be greater than From date");
		            showFlag=false;
		        }
			     
				if(fromDate.length!=0 && toDate.length!=0){
				    dateDifference= (Math.round(dateDifference/ONE_DAY))+1;
				}
				var emailId=$scope.leaveApproverEmail;
				if(emailId == undefined ||emailId.length==0){
					alert("enter email");
					 showFlag=false;
				}
				else if(!emailId.match(/^\"?[\w-_\.]*\"?@atmecs\.com$/))
		        {             
		            alert('Please Enter Valid EmailId:(example@atmecs.com)');
		            showFlag=false;
		        }
				if(showFlag==true){
					 var info =
	    			   {      
	    					   leaveFromAppliedDate  : fromDate,
	    					   leaveToAppliedDate	 : toDate,
	    					   reasonForCancelleave  : $scope.reasonForCancelleave,
	    					   leaveApproverEmail  	 : $scope.leaveApproverEmail ,
	    					   totalLeavesApplied	 :dateDifference,
	    					   leaveActionStatus	 : "pending",
	    					   leaveRequestType		 : $scope.leaveType,
	    					   leaveActionDate		 : submitdate,
				
	    			   };
					 
					 $http.post('/cancelLeave', info).success(function (data) {
	            		console.log("success");
            			$scope.showCancelLeave=true;
            			$scope.leaveFromAppliedDate="";
	            		$scope.leaveToAppliedDate="";
	            		$scope.leaveType="";
	            		$scope.reasonForCancelleave="";
	            		$scope.leaveApproverEmail="";
	            		
    				}).error(function(err){
    					console.log("failure");
    				});
				}

		};
		$scope.sendMail= function(){
			$http.post('/sendMail').success(function (data) {
        		console.log("success");
    			
        		
			}).error(function(err){
				console.log("failure");
			});
			
		};
	
	
	
});

	
	
	
	


