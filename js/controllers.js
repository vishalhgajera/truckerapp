angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$rootScope,$state) {
    root = $rootScope;
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
        
        
        $http.post("http://dev.dharmajivancottons.com/trucker/trip/triplist",{userid:$rootScope.user.cliendID}).then(function(result){
           console.log(result.data.results);
             $rootScope.trips = [];
             if (result.data.results.length)
            {
                $rootScope.trips  = result.data.results;
            }
            
            $scope.$broadcast('scroll.refreshComplete');
             $ionicLoading.hide();
        });
    }

     $ionicLoading.show();
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
             console.log(result);
            $scope.modal.remove();
             if (result.data.success == true)
             {
                $rootScope.trips.push($scope.tripField);
             }
        });
    }
    
    
    $scope.deleteTrip = function(tripID,index){ 	
         $http.post("http://dev.dharmajivancottons.com/trucker/trip/tripdelete",{
          userid:$rootScope.user.cliendID,
          tripID: tripID
         }) .then(function(response) {
            if (response.data.success == true)
            {
                $scope.trips.splice(index,1);
            }
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


.controller('searchtripCtrl', function ($scope, $state, $ionicLoading, $rootScope, $ionicModal, $ionicPopup, $ionicScrollDelegate,$http,$filter) {
    scope = $scope;
    root = $rootScope;
    http = $http;
    $scope.tripField = {Scity:'',Sstate:'',Slocation:'',Ecity:'',Estate:'',Elocation:''}

    
   
   
   
    $scope.states = States;
    $scope.cities = Cities;

    

    
    
    $scope.searchTrip = function (form) {
        console.log(form)
        if (!form.$valid) {
            return false;
        }		
		console.log($scope.tripField);
		$scope.tripField.Estate =  States[$scope.tripField.Estate];
		$scope.tripField.Sstate =  States[$scope.tripField.Sstate];
        
         $http.post("http://dev.dharmajivancottons.com/trucker/trip/searchtrip",{
          searchtype:'both',
          Sstate:$scope.tripField.Sstate,
          Scity:$scope.tripField.Scity,
          Slocation:$scope.tripField.Slocation,
          Estate:$scope.tripField.Estate,
          Ecity:$scope.tripField.Ecity,
          Elocation:$scope.tripField.Elocation
         }) .then(function(response) {
            console.log(response);
      });
        
        
    }
    
    
    
})

.controller('archivetripCtrl', function ($scope, $state, $ionicLoading, $rootScope, $ionicModal, $ionicPopup, $ionicScrollDelegate,$http,$filter) {
    scope = $scope;
    root = $rootScope;
    http = $http;
    $scope.tripField = {}
    $scope.tripField.userid = $rootScope.user.cliendID;
    
    $scope.doRefresh = function () {
        $http.post("http://dev.dharmajivancottons.com/trucker/trip/getarchive",{userid:$rootScope.user.cliendID}).then(function(result){
           console.log(result.data.results);
            $rootScope.trips = [];
            if (result.data.results.length)
            {
                $rootScope.trips  = result.data.results;
            }
            
            $scope.$broadcast('scroll.refreshComplete');
             $ionicLoading.hide();
        });
    }
    
    $ionicLoading.show();
    $scope.doRefresh();
    $scope.states = States;
    $scope.cities = Cities;
})



.controller('tripdetailCtrl', function ($scope, $state, $ionicLoading, $rootScope, $ionicModal, $filter, $ionicPopup,$http) {
    scope = $scope;
    root = $rootScope;
    $scope.tripId = $state.params.Id;
    $scope.bidprice = null;
    $scope.biddata = false;
    $scope.edit = false;
    $scope.currentobjId = '';
    $scope.trip = $filter('filter')($rootScope.trips, {ID: $state.params.Id})[0];
    $scope.editPrice = false;
    $scope.bidId = '';
    $scope.allBids;
    
    
     $http.post("http://dev.dharmajivancottons.com/trucker/trip/getbid",{
      userid:$rootScope.user.cliendID,
      tripID: $scope.trip.ID
     }) 
    .then(function(response) {
         $scope.allBids = []
      console.log(response);
         if (response.data.results.length)
         {
             if (scope.usertype != "agent")
             {   
                $scope.bidprice = Number(response.data.results[0].price);
                $scope.bidId = response.data.results[0].ID;
             }
             else
             {
                 $scope.allBids = response.data.results;
                  console.log($scope.allBids);
             }
         }   
    });
    
    $scope.bidsubmit = function (bidAmount) {
        console.log(bidAmount);
        $scope.bidAmount = bidAmount;
        $http.post("http://dev.dharmajivancottons.com/trucker/trip/addbid",{
          tripid:$scope.trip.ID,
          userid: $rootScope.user.cliendID,
          bidid:$scope.bidId,
          price:bidAmount,
         })
          .then(function(response) {
            console.log(response);
            $scope.bidprice = $scope.bidAmount;
            $scope.editPrice = false;
          });
    }
    
    $scope.selectBider = function(bidder){
         $http.post("http://dev.dharmajivancottons.com/trucker/trip/makedeal",{
          bidder:bidder,
          bidowner:$rootScope.user.cliendID,
          tripID:$scope.trip.ID,
         })
          .then(function(response) {
            console.log(response);
          });
    }
});




States = ["Gujarat ", "Goa", "Delhi"]
Cities = [
        ["Ahmedabad", "Ahwa", "Amod", "Amreli", "Anand", "Anjar", "Ankaleshwar", "Babra", "Balasinor", "Banaskantha", "Bansada", "Bardoli", "Bareja", "Baroda", "Barwal", "Bayad", "Bhachav", "Bhanvad", "Bharuch", "Bhavnagar", "Bhiloda", "Bhuj", "Billimora", "Borsad", "Botad", "Chanasma", "Chhota Udaipur", "Chotila", "Dabhoi", "Dahod", "Damnagar", "Dang", "Danta", "Dasada", "Dediapada", "Deesa", "Dehgam", "Deodar", "Devgadhbaria", "Dhandhuka", "Dhanera", "Dharampur", "Dhari", "Dholka", "Dhoraji", "Dhrangadhra", "Dhrol", "Dwarka", "Fortsongadh", "Gadhada", "Gandhi Nagar", "Gariadhar", "Godhra", "Gogodar", "Gondal", "Halol", "Halvad", "Harij", "Himatnagar", "Idar", "Jambusar", "Jamjodhpur", "Jamkalyanpur", "Jamnagar", "Jasdan", "Jetpur", "Jhagadia", "Jhalod", "Jodia", "Junagadh", "Junagarh", "Kalawad", "Kalol", "Kapad Wanj", "Keshod", "Khambat", "Khambhalia", "Khavda", "Kheda", "Khedbrahma", "Kheralu", "Kodinar", "Kotdasanghani", "Kunkawav", "Kutch", "Kutchmandvi", "Kutiyana", "Lakhpat", "Lakhtar", "Lalpur", "Limbdi", "Limkheda", "Lunavada", "M.M.Mangrol", "Mahuva", "Malia-Hatina", "Maliya", "Malpur", "Manavadar", "ndvi", "Mangrol", "Mehmedabad", "Mehsana", "Miyagam", "Modasa", "Morvi", "Muli", "Mundra", "Nadiad", "Nakhatrana", "Nalia", "Narmada", "Naswadi", "Navasari", "Nizar", "Okha", "Paddhari", "Padra", "Palanpur", "Palitana", "Panchmahals", "Patan", "Pavijetpur", "Porbandar", "Prantij", "Radhanpur", "Rahpar", "Rajaula", "Rajkot", "Rajpipla", "Ranavav", "Sabarkantha", "Sanand", "Sankheda", "Santalpur", "Santrampur", "Savarkundla", "Savli", "Sayan", "Sayla", "Shehra", "Sidhpur", "Sihor", "Sojitra", "Sumrasar", "Surat", "Surendranagar", "Talaja", "Thara", "Tharad", "Thasra", "Una-Diu", "Upleta", "Vadgam", "Vadodara", "Valia", "Vallabhipur", "Valod", "Valsad", "Vanthali", "Vapi", "Vav", "Veraval", "Vijapur", "Viramgam", "Visavadar", "Visnagar", "Vyara", "Waghodia", "Wankaner"],
["anacona", "Candolim", "Chinchinim", "Cortalim", "Goa", "Jua", "Madgaon", "Mahem", "Mapuca", "Marmagao", "Panji", "Ponda", "Sanvordem", "Terekhol"],
    ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "South Delhi", "South West Delhi", "West Delhi"]
    ]
