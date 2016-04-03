// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','ui.bootstrap.datetimepicker'])

.run(function ($ionicPlatform,$rootScope) {
    
    if (window.localStorage.getItem("User") != null)
    {
        $rootScope.user = JSON.parse(window.localStorage.getItem("User"));
    }
    
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/auth/walkthrough');

    
     $stateProvider.state("auth", {
        url: "/auth",
        templateUrl: "templates/auth.html",
        "abstract": true,
    }).state("auth.walkthrough", {
        url: "/walkthrough",
        templateUrl: "templates/walkthrough.html"
    }).state("auth.login", {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "LoginCtrl"
    }).state("auth.signup", {
        url: "/signup",
        templateUrl: "templates/signup.html",
         controller: "SignupCtrl"
     }).state("app", {
        url: "/app",
        "abstract": true,
        cache: false,
        templateUrl: "templates/menu.html",
        controller: "AppCtrl"
    }).state("app.trip", {
        url: "/trip",
        views: {
            menuContent: {
                templateUrl: "templates/triplist.html",
                controller: "tripCtrl"
            }
        }
    }).state("app.tripdetail", {
        url: "/trip/:Id",
        views: {
            menuContent: {
                templateUrl: "templates/tripdetail.html",
                controller: "tripdetailCtrl"
            }
        }
    })
     
    // if none of the above states are matched, use this as the fallback

});
