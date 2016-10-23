'use strict';

angular.module('UpdateModule', [])
    .controller('UpdateController',
                ['$rootScope',
                 '$http',
                 'LocationHierarchyService',
                 'FieldWorkerService',
                 'LocationService',
                 'IndividualService',
                 'MembershipService',
                 'RelationshipService',
                 'ResidencyService',
                 'VisitService',
                 'DeathService',
                    'InMigrationService',
                    'OutMigrationService',
                 UpdateController ]);


function UpdateController($rootScope,
                          $http,
                          LocationHierarchyService,
                          FieldWorkerService,
                          LocationService,
                          IndividualService,
                          MembershipService,
                          RelationshipService,
                          ResidencyService,
                          VisitService,
                          DeathService,
                          InMigrationService,
                          OutMigrationService) {

    var vm = this;
    var headers = { authorization: "Basic " + $rootScope.credentials };

    vm.selectedHierarchy = [];


    vm.selectedLocation = null;
    vm.selectedIndividual = null;
    vm.submittedEvents = [];


    vm.currentResidency = null;
    vm.currentInMigration = null;
    vm.currentOutMigration = null;
    vm.currentDeath = null;
    vm.currentPregnancyObservation = null;
    vm.currentPregnancyOutcome = null;

    vm.submitVisit = function() {
        VisitService.submit(vm.currentFieldWorker, vm.visitDate, vm.selectedLocation, vm.visit)
            .then(function(response) {
                vm.currentVisit = response.data;
            });
        $('#locationTab').tab('show');
    };

    vm.submitInMigration = function(event){
        InMigrationService.submit(vm.currentFieldWorker, vm.collectionDateTime,
            vm.currentVisit, vm.currentIndividual, vm.currentResidency, event)
            .then(function(response) {
                vm.submittedEvents.push(response.data);
            });
        vm.currentInMigration = null;
    };

    vm.submitOutMigration = function(event){
        OutMigrationService.submit(vm.currentFieldWorker, vm.collectionDateTime,
            vm.currentVisit, vm.currentIndividual, vm.currentResidency, event)
            .then(function(response) {
                vm.submittedEvents.push(response.data);
            });
        vm.currentOutMigration = null;
    };

    vm.submitDeath = function(event) {
        DeathService.submit(vm.currentFieldWorker, vm.collectionDateTime, vm.currentVisit, vm.currentIndividual, event)
            .then(function(response) {
                vm.submittedEvents.push(response.data);
            });
        vm.currentDeath = null;
    };

    vm.submitPregnancyObservation = function(){
        // post logic
        // add to submitted events []
        vm.currentPregnancyObservation = null;
    };

    vm.submitPregnancyOutcome = function(){
        // post logic
        // add to submitted events []
        vm.currentPregnancyOutcome = null;
    };


    vm.finishVisit = function(){
        vm.submittedEvents = [];
        vm.selectedLocation = null;
        vm.selectedIndividual = null;
    };

    vm.saveLocationHierarchy = function() {
        var parentIndex = vm.selectedHierarchy.length - 2;
        var lastIndex = vm.selectedHierarchy.length - 1;

        var parent = vm.selectedHierarchy[parentIndex];
        var last = vm.selectedHierarchy[lastIndex];
        var children = vm.locationHierarchies[parent];
        vm.currentHierarchy = children.filter(function(child) {
            return child.uuid === last;
        })[0];

        LocationService.getByHierarchy(vm.currentHierarchy.uuid)
            .then(function(response) {
                vm.allLocations = response;
                vm.locationDisplayCollection = [].concat(response);
            });

        IndividualService.getByHierarchy(vm.currentHierarchy.uuid)
            .then(function(response) {
                vm.allIndividuals = response;
                vm.individualDisplayCollection = [].concat(response);
            });

        ResidencyService.getByHierarchy(vm.currentHierarchy.uuid)
            .then(function(response) {
                vm.allResidencies = response;
                vm.residencyDisplayCollection = [].concat(response);
            });


    };

    vm.setLocation = function(row) {
        vm.selectedLocation = row;

        vm.residencies = vm.allResidencies.filter(function(location){
            return location.uuid === row.uuid;
        });

    };

    vm.availableHierarchies = function() {
        var result = [];

        vm.selectedHierarchy.forEach(function(h) {
            result.push(vm.locationHierarchies[h]);
        });
        return result;
    };

    vm.setFieldWorker = function(fw){
        vm.currentFieldWorker = fw;
    };

    vm.init = function() {


        var codesUrl = $rootScope.restApiUrl + "/projectCodes/bulk.json";

        $http.get(codesUrl, {headers: headers})
            .then(function(response) {
                vm.codes = response.data;
            });

        FieldWorkerService.getAllFieldWorkers().then(function(fieldworkers) {
            vm.allFieldWorkers = fieldworkers;
        });

        LocationHierarchyService.locationHierarchies().then(function(hierarchyTree) {
            vm.locationHierarchies = hierarchyTree;
        });
        LocationHierarchyService.getLevels().then(function(response) {
            vm.allHierarchyLevels = response.data;
        });


    };

    return vm;

}
