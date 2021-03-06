describe('UpdateController', function() {

    var controller,
        $rootScope,
        $location,
        $httpBackend,
        mockLocationService,
        mockSocialGroupService,
        mockIndividualService,
        mockMembershipService,
        mockRelationshipService;

    beforeEach(module('ui.tree'));
    beforeEach(module('LoginModule'));
    beforeEach(module('UpdateModule'));
    beforeEach(module('openhds'));
    beforeEach(module('smart-table'));

    beforeEach(inject(function(_$controller_, _$httpBackend_,
                               _$rootScope_, _$location_){

        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $location = _$location_;
        var args = {};
        controller = _$controller_('UpdateController', args);
        $rootScope.restApiUrl = 'http://example.com';
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('Inits controller', function() {
        expect(controller).toBeDefined();
    });

    it('submitPregnancyObservation sets currentPregnancyObservation', function() {
        $httpBackend.expectPOST("http://example.com/pregnancyObservations", {
            "collectedByUuid":123,
            "visitUuid":456,
            "motherUuid":789,
            "pregnancyObservation": {
                "pregnancyDate":"now",
                "expectedDeliveryDate":"later",
                "collectionDateTime":"now"
            }
        }) .respond({uuid: "xyz"});

        controller.currentFieldWorker = {uuid: 123};
        controller.currentVisit = {uuid: 456, visitDate: "now"};
        controller.currentIndividual = {uuid: 789};
        controller.submitPregnancyObservation({
            deliveryDate: "later"
        });

        $httpBackend.flush();

        expect(controller.submittedEvents).toEqual([{uuid: "xyz",
                                                     individual: {uuid: 789},
                                                     eventType: "pregnancy observation"}]);
        expect(controller.currentPregnancyObservation).toBeNull();
    });

    it('submitPregnancyOutcome sets currentPregnancyOutcome', function() {
        $httpBackend.expectPOST("http://example.com/pregnancyOutcomes", {
                "collectedByUuid":123,
                "visitUuid":456,
                "fatherUuid":987,
                "motherUuid":789,
                "pregnancyOutcome":{"outcomeDate":"then"}
        }) .respond({uuid: "xyz"});

        $httpBackend.expectPOST('http://example.com/pregnancyResults', {
            "collectedByUuid":123,
            "pregnancyOutcomeUuid":"xyz",
            "pregnancyResult":{type: "test"}
        }).respond({});

        controller.currentFieldWorker = {uuid: 123};
        controller.collectionDateTime = null;
        controller.currentVisit = {uuid: 456};
        controller.currentIndividual = {uuid: 789};
        controller.currentPregnancyOutcome = {
            father: {uuid: 987},
            outcomeDate: "then",
            results : [ {type:"test"} ]
        };


        controller.currentPregnancyResult = {
            type: "test"
        };

        controller.submitPregnancyOutcome(controller.currentPregnancyOutcome);

        $httpBackend.flush();

        expect(controller.currentPregnancyOutcome).toEqual({results :[]});
    });

    it('creates individual if live birth', function() {
        $httpBackend.expectPOST("http://example.com/pregnancyOutcomes", {
                "collectedByUuid":123,
                "visitUuid":456,
                "fatherUuid":987,
                "motherUuid":789,
                "pregnancyOutcome":{"outcomeDate":"then"}
        }) .respond({uuid: "xyz"});

        $httpBackend.expectPOST('http://example.com/individuals', {
            "collectedByUuid":123,
            "individual":{}
        }).respond({});

        $httpBackend.expectPOST('http://example.com/pregnancyResults', {
            "collectedByUuid":123,
            "pregnancyOutcomeUuid":"xyz",
            "pregnancyResult":{"type":"LIVE_BIRTH"}
        }).respond({});

        controller.currentFieldWorker = {uuid: 123};
        controller.collectionDateTime = null;
        controller.currentVisit = {uuid: 456};
        controller.currentIndividual = {uuid: 789};
        controller.currentPregnancyOutcome = {
            father: {uuid: 987},
            outcomeDate: "then",
            results : [
                { child: {uuid: 12345}, type: "LIVE_BIRTH" }
            ]
        };



        controller.submitPregnancyOutcome(controller.currentPregnancyOutcome);

        $httpBackend.flush();

        expect(controller.currentPregnancyOutcome).toEqual({results :[]});
    });

    it('finishVisit resets submittedEvents, selectLocation and selectedIndividual', function() {
        $ = function(value) {
            return {
                click: function(handler) {
                    handler(event);
                },
                tab: function(e) {
                    tabCalled = e;
                }
            };
        };
        controller.finishVisit();
        expect(controller.submittedEvents).toEqual([]);
        expect(controller.selectedLocation).toBeNull();
        expect(controller.selectedIndividual).toBeNull();

        delete $;
    });

    it('shows no pregnancy option if currentIndividual is null', function() {
        controller.currentIndividual = null;
        expect(controller.pregnancyDisableCheck()).toBe(false);
    });

    it('shows no pregnancy option if currentIndividual is male', function() {
        controller.currentIndividual = {gender: "MALE"};
        expect(controller.pregnancyDisableCheck()).toBe(false);
    });

    it('shows pregnancy option if currentIndividual is not male', function() {
        controller.currentIndividual = {};
        expect(controller.pregnancyDisableCheck()).toBe(true);
    });

    it('setLocation sets selectedLocation and filters allResidencies', function() {
        $httpBackend.expectGET("http://example.com/individuals/findByLocation/?locationUuid=1").respond([{uuid: 1}, {uuid: 2}]);
        controller.allResidencies = [{uuid: 1, name: "test residency",
                                      location: {uuid: 1}}];

        controller.setLocation({uuid: 1});
        $httpBackend.flush();

        expect(controller.allIndividuals).toEqual([{uuid: 1}, {uuid: 2}]);
        expect(controller.selectedLocation).toEqual({uuid: 1});
    });


    it('Available hierarchies returns list of hierarchies', function() {
        controller.selectedHierarchy = [0, 1];
        controller.locationHierarchies = {
            0: [{uuid: 1}],
            1: [{uuid: 2}, {uuid: 3}],
            2: [{uuid: 4}],
            3: [],
            4: []
        };
        var hierarchies = controller.availableHierarchies();
        expect(hierarchies).toEqual([[{uuid: 1}],
                                     [{uuid:2}, {uuid:3}]]);
    });

    it('initializes', function() {
        var event = {
            preventDefault: function() {}
        };
        $ = function(value) {
            return {
                click: function(handler) {
                    handler(event);
                },
                tab: function(e) {
                    tabCalled = e;
                }
            };
        };


        $httpBackend.expectGET("http://example.com/projectCodes/bulk.json")
            .respond(['code1', 'code2']);

        $httpBackend.expectGET("http://example.com/fieldWorkers/bulk.json")
            .respond([{uuid: 1, fieldWorkerId: 1, firstName: "test", lastName: "test"}]);

        $httpBackend.expectGET("http://example.com/locationHierarchyLevels/bulk.json")
            .respond([{uuid: 2}]);

        $httpBackend.expectGET("http://example.com/locationHierarchies/bulk.json")
            .respond([{uuid: 1, extId: "ROOT", level: {uuid: 2}}]);

        $httpBackend.expectGET("http://example.com/locationHierarchyLevels/bulk.json")
            .respond([{uuid: 1}]);

        controller.init();

        $httpBackend.flush();

        expect(controller.allFieldWorkers).toEqual([{uuid: 1, id: 1, firstName: "test", lastName: "test"}]);
        expect(controller.locationHierarchies).toEqual([{
            id: 1, title: 'ROOT', collapsed: true, nodes: []
        }]);
        expect(controller.allHierarchyLevels).toEqual([{uuid: 1}]);

        delete $;
    });

    it('sets father', function() {
        controller.currentPregnancyOutcome = null;
        controller.setFather("father");
        expect(controller.currentPregnancyOutcome.father).toEqual("father");

        controller.setFather("12345");
        expect(controller.currentPregnancyOutcome).toEqual({father: "12345"});
    });

    it('sets current individual', function() {
        controller.residencies = null;
        controller.setCurrentIndividual('foo');
        expect(controller.currentIndividual).toEqual('foo');
    });

    it('submits visit', function() {
        $ = function(value) {
            return {
                click: function(handler) {
                    handler(event);
                },
                tab: function(e) {
                    tabCalled = e;
                }
            };
        };

        $httpBackend.expectPOST('http://example.com/visits/generateExtId')
            .respond("extId");
        $httpBackend.expectPOST("http://example.com/visits", {
            "collectedByUuid":123,
            "locationUuid":456,
            "visit":{
                "extId": "extId",
                "visitDate":"then",
                "collectionDateTime": "then"
            }
        }).respond({uuid: "visit"});
        controller.currentFieldWorker = {uuid: 123, id: "fwId"};
        controller.selectedLocation = {uuid: 456, extId: "locId"};
        controller.visitDate = "then";

        controller.visit = {extId: "visitId", visitDate: "then"};

        controller.submitVisit();

        $httpBackend.flush();

        expect(controller.currentVisit).toEqual({uuid: "visit"});

        delete $;
    });

    it('submits individual for external in-migration', function() {
        $httpBackend.expectPOST('http://example.com/individuals', {
            collectedByUuid: 123,
            individual: {
                collectionDateTime: "now"
            }
        }).respond({uuid: 1});

        controller.currentVisit = {visitDate: "now"};
        controller.currentFieldWorker = {uuid: 123};

        controller.submitIndividual({});
        $httpBackend.flush();
    });

    it('saves search hierarchy', function() {
        controller.selectedHierarchy = [0, 1, 3];
        controller.locationHierarchies = {
            0: [{uuid: 1}],
            1: [{uuid: 2}, {uuid: 3}],
            2: [{uuid: 4}],
            3: [],
            4: []
        };

        controller.saveSearchHierarchy();
        expect(controller.searchHierarchy).toEqual({uuid: 3})
    });

    it('clears results', function() {
        controller.queryResult = {data: [1,2,3], displayCollection: [1, 2, 3]};
        controller.clearResults();
        expect(controller.queryResult).toEqual({data: [], displayCollection: []});
    });

    it('looks up entity by extId', function() {
        var entity = [{uuid: 1, extId: "id", firstName: "fname", lastName: "lname", gender: "test", dateOfBirth: "dob"}];
        $httpBackend.expectGET('http://example.com/individuals/external/id')
            .respond( entity);
        controller.searchExtId = 'id';
        controller.entityType = "individual";
        controller.lookupEntity();

        $httpBackend.flush();
        expect(controller.currentEntity).toEqual(entity);
        expect(controller.queryResult).toEqual({
            entityType: "individual",
            data: entity,
            displayCollection: entity});
    });

    it('does not search by fields if currentSearch is null', function() {
        controller.queryResult.data = "foo";
        controller.currentSearch = null;
        controller.searchByFields();
        expect(controller.queryResult).toEqual({data: "foo", displayCollection: [], entityType: "individual"});
    });

    it('looks up entity by fields', function() {
        $httpBackend.expectGET('http://example.com/individuals/search?key=value').respond({content: [{
            uuid: 1,
            extId: "extId",
            firstName: "first",
            lastName: "lastName",
            dateOfBirth: "then",
            gender: "gender"
        }]});
        controller.currentSearch = {key: "value", otherKey: null};
        controller.searchByFields();
        $httpBackend.flush();

        expect(controller.queryResult).toEqual({
            entityType: "individual",
            data: {content: [{ uuid: 1, extId: 'extId', firstName: 'first', lastName: 'lastName', dateOfBirth: 'then', gender: 'gender' }]},
            displayCollection: [{content: [{ uuid: 1, extId: 'extId', firstName: 'first', lastName: 'lastName', dateOfBirth: 'then', gender: 'gender' }]}]
        });
    });

    it('chooses individual modal based on current event type', function() {
        var modalCalled = false;
        $ = function() {
            return {
                modal: function() {
                    modalCalled = true;
                }
            };
        };
        controller.currentEventType = "pregnancyOutcome";
        controller.currentPregnancyOutcome = { results : []}
        controller.chooseIndividual("row");
        expect(controller.currentPregnancyOutcome.father).toEqual("row");
        expect(modalCalled).toBe(true);
        expect(controller.individual).toBeUndefined();

        delete $;
    });

    it('chooses individual modal based on current event type', function() {
        var modalCalled = false;
        $ = function() {
            return {
                modal: function() {
                    modalCalled = true;
                }
            };
        };
        controller.currentEventType = "inMigration";
        controller.currentIndividual = "foo";
        controller.chooseIndividual("row");
        expect(controller.individual).toEqual("row");
        expect(modalCalled).toBe(true);
        expect(controller.currentPregnancyOutcome).toEqual({results :[]});

        delete $;
    });

    it('does nothing if current event type is unknown', function() {
        controller.currentEventType = "foo";
        controller.currentPregnancyOutcome = {};
        controller.chooseIndividual();
        expect(controller.currentPregnancyOutcome.father).toBeUndefined();
        expect(controller.individual).toBeUndefined();
    });

    it('sets error message', function() {
        controller.errorHandler('oops');
        expect(controller.errorMessage).toEqual('oops');
    });

});
