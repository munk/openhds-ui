'use strict';

describe('openHDS.location module', function() {

    var locationCtrl;
    var scope = {};
    var $location, $route, $rootScope;

    describe('Location Controller', function() {
        beforeEach(module('openHDS.location'));

        beforeEach(inject(function(_$location_, _$route_, _$rootScope_){
            $location = _$location_;
            $route = _$route_;
            $rootScope = _$rootScope_;
        }));

        beforeEach(inject(function($controller, $http) {
            locationCtrl = $controller('LocationController', {
                    $scope: scope,
                    $http: $http,
                    userService: {}});
        }));

        // We need to setup a mock backend to handle the fetching of templates from the 'templateUrl'.
        beforeEach(inject(function($httpBackend) {
            $httpBackend.expectGET('locationView/create.html').respond(200, 'main HTML');
        }));

        it('LocationController should be defined', function() {
            expect(locationCtrl).toBeDefined();
        });

        it('Location controller data should be defined', function() {
           expect(scope.data).toBeDefined();
        });

        it('Location controller should handle route at /location/new', function() {
            $location.path('/location/new');
            $rootScope.$digest();
            expect($location.path()).toBe('/location/new');
            expect($route.current.controller).toBe('LocationController');
        });
    });
});
