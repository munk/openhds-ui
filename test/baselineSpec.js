describe('BaselineController', function() {

    var controller,
        $rootScope,
        $location,
        $httpBackend;

    beforeEach(module('LoginModule'));
    beforeEach(module('BaselineModule'));
    beforeEach(module('openhds'));
    beforeEach(module('smart-table'));

    beforeEach(inject(function(_$controller_, _$httpBackend_,
                               _$rootScope_, _$location_){
        var mockLocationService = {
            submit: function(vm, locationSuccess) {}
        };

        var mockSocialGroupService = {
            getAllSocialGroups: function() {
                return {
                    then: function(callback) {
                        callback('allSocialGroups');
                    }
                };
            }
        };
        var mockFieldWorkerService = {
            getAllFieldWorkers: function(callback) {
                callback('allFieldWorkers');
            }
        };

        var mockLocationHierarchyService = {
            getLevels: function() {
                return {
                    then: function(callback) {
                        callback({data: 'allLevels'});
                    }
                };
            },
            locationHierarchies: function(callback) {
                callback('allHierarchies');
            }
        };

        spyOn(mockLocationService, 'submit');

        var args = {
            LocationService: mockLocationService,
            SocialGroupService: mockSocialGroupService,
            FieldWorkerService: mockFieldWorkerService,
            LocationHierarchyService: mockLocationHierarchyService
        };

        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $location = _$location_;
        controller = _$controller_('BaselineController', args);
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('Remove Selected Social Group updates selectedSocialGroup', function() {
        controller.selectedSocialGroups = ["a", "b", "c"];
        controller.removeSelectedEntity('selectedSocialGroups', "b");
        expect(controller.selectedSocialGroups).toEqual(["a", "c"]);
    });

    it('Should leave selectedSocialGroups alone if group not found', function() {
        controller.selectedSocialGroups = ["a", "b", "c"];
        controller.removeSelectedEntity('selectedSocialGroups', "d");
        expect(controller.selectedSocialGroups).toEqual(["a", "b", "c"]);
    });

    it('Should set selected fieldworker', function() {
        controller.allFieldWorkers = [{uuid: 1}, {uuid: 2}];
        controller.currentFieldWorkerUuid = 2;
        controller.saveFieldWorker();
        expect(controller.currentFieldWorker).toEqual({uuid: 2});
    });

    it('initTab should register a click function', function() {
        var event = {
            preventDefault: function() {}
        };

        var tabCalled = false;

        spyOn(event, 'preventDefault');

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

        initTab('foo');
        delete $;

        expect(event.preventDefault).toHaveBeenCalled();
        expect(tabCalled).toEqual('show');
    });

    it('Save location hierarchy saves location hierarchy', function() {
        controller.selectedHierarchy = [0, 1, 2, 3];
        controller.locationHierarchies = {
            0: [],
            1: [{uuid: 2}],
            2: [{uuid: 3}],
            3: []
        };
        controller.saveLocationHierarchy();
        expect(controller.currentHierarchy).toEqual({uuid: 3});
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
        $rootScope.restApiUrl = 'http://example.com';
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

        controller.init();

        $httpBackend.flush();

        expect(controller.allFieldWorkers).toEqual('allFieldWorkers');
        expect(controller.locationHierarchies).toEqual('allHierarchies');
        expect(controller.allHierarchyLevels).toEqual('allLevels');
        expect(controller.allSocialGroups).toEqual('allSocialGroups');

        delete $;
    });
});