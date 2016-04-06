angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$rootScope,$state) {
    $rootScope.username = $rootScope.user.username;
    $rootScope.usertype = $rootScope.user.type;
    $scope.logout = function(){
        window.localStorage.removeItem("User");
        $state.go('auth.login', {
            clear: true
        });
    }
    
})

.controller('LoginCtrl', function ($scope, $state, $ionicLoading, $rootScope,$http,$ionicPopup) {
    scope = $scope
    $scope.error = new Object();
    $scope.user = {
        name: '',
        password: ''
    };

    $scope.signIn = function (form) {
        console.log(form);
        if (form.$invalid)
        {
            return false
        }
        $ionicLoading.show()
        var User = form.user.$modelValue
        var Password = form.password.$modelValue;
        
        $http.post("http://dev.dharmajivancottons.com/trucker/authentic/login",{"name":User,"password":Password}).then(function(result){
            console.log(result)	 
            if (result.data.success)
            {
                $ionicLoading.hide();
                $rootScope.user = result.data.User;
                window.localStorage.setItem("User",JSON.stringify($rootScope.user));
                $rootScope.isLoggedIn = true;
                 $state.go('app.trip', {
                        clear: true
                    });
            }else
            {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Error',
                    template: 'Invalid Username or Password Please try again.',
                });
            }
        });
    };


})

.controller('SignupCtrl', function($scope) {
    
})

.controller('tripCtrl', function ($scope, $state, $ionicLoading, $rootScope, $ionicModal, $ionicPopup, $ionicScrollDelegate,$http,$filter) {
    scope = $scope;
    root = $rootScope;
    http = $http;
     $scope.tripField = {}
     $scope.tripField.userid = $rootScope.user.cliendID;
    
   
    $scope.doRefresh = function () {
         $rootScope.trips = [];
        
        $http.post("http://dev.dharmajivancottons.com/trucker/trip/triplist",{userid:$rootScope.user.cliendID}).then(function(result){
           console.log(result.data.results);
             if (result.data.results.length)
            {
                $rootScope.trips  = result.data.results;
            }
            
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.doRefresh();
    $scope.states = States;
    $scope.cities = Cities;

    $scope.sstate = $scope.estate = $scope.scity = $scope.ecity = "";
    $ionicModal.fromTemplateUrl('templates/tripform.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $rootScope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });

    
    
    $scope.addTrip = function (form) {
        $ionicScrollDelegate.resize()
        console.log($scope.tripField);
        if (!form.$valid) {
            return false;
        }		
		console.log($scope.tripField);
		
		$scope.tripField.Estate =  States[$scope.tripField.Estate];
		$scope.tripField.Sstate =  States[$scope.tripField.Sstate];
        $http.post("http://dev.dharmajivancottons.com/trucker/trip/add", $scope.tripField).then(function(result){
           console.log(result.data.results);
             if (result.data.results.length)
            {
                $rootScope.trips  = result.data.results;
            }
            
            $scope.$broadcast('scroll.refreshComplete');
        });
        
        
    }
    
    
    
    $scope.openDatePicker = function() {
        $scope.tmp = {};
        $scope.tmp.newDate = $scope.tripField.reportingDate;

        var birthDatePopup = $ionicPopup.show({
          template: '<datetimepicker ng-model="tmp.newDate"></datetimepicker>',
          title: "Reporting Date",
          scope: $scope,
          buttons: [{
            text: 'Cancel'
          }, {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              $scope.tripField.reportingDate = $filter('date')($scope.tmp.newDate, 'dd/MM/yyyy HH:mm'); ;
            }
          }]
        });
      }
    
})
.controller('tripdetailCtrl', function ($scope, $state, $ionicLoading, $rootScope, $ionicModal, $filter, $ionicPopup,$http) {
    scope = $scope;
    root = $rootScope;
    $scope.tripId = $state.params.Id;
    $scope.bidprice = null;
    $scope.biddata = false;
    $scope.edit = false;
    $scope.bidAmount = '';
    $scope.currentobjId = '';
    $scope.trip = $filter('filter')($rootScope.trips, {ID: $state.params.Id})[0];
    $scope.editPrice = false;
    $scope.bidId = '';

   /* bidQuery.find({
        success: function (results) {
            $scope.biddata = true;
			console.log("my Result");
            console.log(results);
            if (results.length > 0) {
                
				
				$scope.bidprice = results[0].attributes.price
				$scope.currentobjId = results[0].id;
                console.log($scope.currentobjId);
				var tempUser = []
				if ($scope.usertype == 'agent')
				{
					$scope.totalBids = results
					
					angular.forEach(results,function(el,index){
						console.log(el.attributes.userid);
						tempUser.push(el.attributes.userid);
					});
					var query = new Parse.Query(Parse.User);
					query.equalTo("objectId",el.attributes.userid );
					query.find({
					  success: function(women) {
						console.log(women);
					  }
					});
				}
            }
        },
        error: function (error) {
            $scope.biddata = true;
            $ionicPopup.alert({
                title: 'Bid retriving failer',
                template: 'Failed to create new object, with error code:  ' + error.message,
            });
        }
    });*/

    
    
     $http.post("http://dev.dharmajivancottons.com/trucker/trip/getbid",{
      userid:$rootScope.user.cliendID,
      tripID: $scope.trip.ID
     }) 
    .then(function(response) {
      console.log(response);
         if (response.data.success == "true")
         {
             $scope.bidprice = Number(response.data.results[0].price);
             $scope.bidId = response.data.results[0].ID;
         }
             
    });
    
    $scope.bidsubmit = function () {
        $http.post("http://dev.dharmajivancottons.com/trucker/trip/addbid",{
          tripid:$scope.trip,
          userid: $rootScope.user.cliendID,
          bidid:$scope.bidId,
          price:'5000',
         })
          .then(function(response) {
              $scope.myWelcome = response.data;
          });
    }
    
    
   /* $scope.bidsubmit = function () {
		console.log($scope.bidAmount);
        if($scope.bidAmount == "") {
            $ionicPopup.alert({
                title: 'Wrong Bid Amount',
                template: 'Please enter proper bid Amount',
            });
            return false;
            
        }
        if (!$scope.edit)
		{
			newbid = new bid();
			newbid.setACL(new Parse.ACL(Parse.User.current()));
			newbid.set({
				tripid: $scope.trip,
				userid: $rootScope.user,
				price: $scope.bidAmount
			});
			
			newbid.save(null, {
				success: function (truck) {
					$ionicPopup.alert({
						title: 'Bid submited',
						template: 'Bid has been submited',
					});
					$scope.bidprice = $scope.bidAmount;
				},
				error: function (truck, error) {
					$ionicPopup.alert({
						title: 'Bid submited failer',
						template: 'Failed to create new object, with error code:  ' + error.message,
					});
				}
			});
	    }
        else {
            bidQuery.get($scope.currentobjId, {
              success: function(truck) {
                  truck.set({ price: $scope.bidAmount})
                  truck.save();
                  $scope.biddata = true;
                  $scope.bidprice = $scope.bidAmount;
                    $ionicPopup.alert({
                        title: 'Bid submited',
                        template: 'Bid has been updated',
                    });
                // The object was retrieved successfully.
              },
              error: function(object, error) {
                 $ionicPopup.alert({
                    title: 'Bid submited failer',
                    template: 'Failed to create new object, with error code:  ' + error.message,
                });
              }
            });
        }
        console.log($rootScope.user);
        console.log($scope.trip);
    }*/
});




States = ["Gujarat ", "Goa", "Delhi"]
Cities = [
        ["Ahmedabad", "Ahwa", "Amod", "Amreli", "Anand", "Anjar", "Ankaleshwar", "Babra", "Balasinor", "Banaskantha", "Bansada", "Bardoli", "Bareja", "Baroda", "Barwal", "Bayad", "Bhachav", "Bhanvad", "Bharuch", "Bhavnagar", "Bhiloda", "Bhuj", "Billimora", "Borsad", "Botad", "Chanasma", "Chhota Udaipur", "Chotila", "Dabhoi", "Dahod", "Damnagar", "Dang", "Danta", "Dasada", "Dediapada", "Deesa", "Dehgam", "Deodar", "Devgadhbaria", "Dhandhuka", "Dhanera", "Dharampur", "Dhari", "Dholka", "Dhoraji", "Dhrangadhra", "Dhrol", "Dwarka", "Fortsongadh", "Gadhada", "Gandhi Nagar", "Gariadhar", "Godhra", "Gogodar", "Gondal", "Halol", "Halvad", "Harij", "Himatnagar", "Idar", "Jambusar", "Jamjodhpur", "Jamkalyanpur", "Jamnagar", "Jasdan", "Jetpur", "Jhagadia", "Jhalod", "Jodia", "Junagadh", "Junagarh", "Kalawad", "Kalol", "Kapad Wanj", "Keshod", "Khambat", "Khambhalia", "Khavda", "Kheda", "Khedbrahma", "Kheralu", "Kodinar", "Kotdasanghani", "Kunkawav", "Kutch", "Kutchmandvi", "Kutiyana", "Lakhpat", "Lakhtar", "Lalpur", "Limbdi", "Limkheda", "Lunavada", "M.M.Mangrol", "Mahuva", "Malia-Hatina", "Maliya", "Malpur", "Manavadar", "ndvi", "Mangrol", "Mehmedabad", "Mehsana", "Miyagam", "Modasa", "Morvi", "Muli", "Mundra", "Nadiad", "Nakhatrana", "Nalia", "Narmada", "Naswadi", "Navasari", "Nizar", "Okha", "Paddhari", "Padra", "Palanpur", "Palitana", "Panchmahals", "Patan", "Pavijetpur", "Porbandar", "Prantij", "Radhanpur", "Rahpar", "Rajaula", "Rajkot", "Rajpipla", "Ranavav", "Sabarkantha", "Sanand", "Sankheda", "Santalpur", "Santrampur", "Savarkundla", "Savli", "Sayan", "Sayla", "Shehra", "Sidhpur", "Sihor", "Sojitra", "Sumrasar", "Surat", "Surendranagar", "Talaja", "Thara", "Tharad", "Thasra", "Una-Diu", "Upleta", "Vadgam", "Vadodara", "Valia", "Vallabhipur", "Valod", "Valsad", "Vanthali", "Vapi", "Vav", "Veraval", "Vijapur", "Viramgam", "Visavadar", "Visnagar", "Vyara", "Waghodia", "Wankaner"],
["anacona", "Candolim", "Chinchinim", "Cortalim", "Goa", "Jua", "Madgaon", "Mahem", "Mapuca", "Marmagao", "Panji", "Ponda", "Sanvordem", "Terekhol"],
    ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "South Delhi", "South West Delhi", "West Delhi"]
    ]
