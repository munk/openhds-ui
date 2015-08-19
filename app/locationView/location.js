'use strict';

angular.module('openHDS.location', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/location/new', {
            templateUrl: 'locationView/create.html',
            controller: 'LocationController'
        });

    }])

    .controller('LocationController', ['$scope', '$http', 'userService', 'locationService', function($scope, $http, scopeService, locationService) {
        $scope.data = scopeService;
    }])

    .factory('locationService', function() {
        var scopeServiceInstance = {
            fieldWorkerId: null,
            locationHierarchy: ['Country', 'Region', 'District', 'Village', 'Subvillage'],
            locationType: null,
            name: "",
            pos: {
                coords: {
                    latitude: 'calculating...',
                    longitude: 'calculating...',
                    accuracy: 'calculating...',
                    altitude: 'calculating...'
                }
            }
        };

        navigator.geolocation.getCurrentPosition(function(pos) {
            scopeServiceInstance.pos = pos;
            console.log(scopeServiceInstance.pos.coords);
        });

        //$http.get('http://10.0.1.28:5000/locationHierarchy')
        //    .success(function(d, s, h, c) {
        //        scopeServiceInstance.locationHierarchy = d;
        //        console.log(scopeServiceInstance.locationHierarchy[0]);
        //    })
        //    .error(function(d, s, h, c) {
        //        console.log('Unable to connect to remote server. Please check your connection.');
        //    });

        return scopeServiceInstance;
    });
