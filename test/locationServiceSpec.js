describe('LocationService Test', function() {

    var service, $httpBackend, $rootScope;

    beforeEach(module('smart-table'));
    beforeEach(module('LoginModule'));
    beforeEach(module('BaselineModule'));
    beforeEach(module('openhds'));
    beforeEach(module('LoginModule'));
    beforeEach(module('BaselineModule'));
    beforeEach(module('smart-table'));

    beforeEach(inject(function(_LocationService_, $injector){
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $rootScope.restApiUrl = 'http://example.com';
        $rootScope.credentials = "user:password";
        service = _LocationService_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should post well formed data to rest api', function() {

        $httpBackend.expectPOST(
            'http://example.com/locations',
            {
                collectedByUuid: '123',
                locationHierarchyUuid: '456',
                location: {
                    name: 'testName',
                    extId: 'testId',
                    type: 'UNIT TEST',
                    collectionDateTime: 'nowish'
                }
            },
            function(headers) {
                return headers.authorization === 'Basic user:password';
            }
        ).respond(200, 'response data...');

        var model = {
            currentFieldWorker: {
                uuid: '123'
            },
            currentHierarchy: {
                uuid: '456'
            },
            collectionDateTime: 'nowish',
            location: {
                name: 'testName',
                extId: 'testId',
                type: 'UNIT TEST'
            }
        };

        service.submit(model.currentFieldWorker,
                       model.collectionDateTime,
                       model.currentHierarchy,
                       model.location)
            .then(function(response) {
                expect(response.data).toEqual('response data...');
            });

        $httpBackend.flush();
    });
/*
    it('should get all locations at a hierarchy', function() {
        $httpBackend.expectGET('http://example.com/locations.json?locationHierarchyUuid=123')
            .respond({content: [{
                description: 'description',
                extId: 'extId',
                type: 'type',
                uuid: 'uuid',
                name: 'name'
            }]});
        service.getByHierarchy('123').then(function(response) {
            var locations = response;
            expect(locations).toEqual([
                {
                    description: 'description',
                    extId: 'extId',
                    type: 'type',
                    uuid: 'uuid',
                    name: 'name'
                }]);
        });

        $httpBackend.flush();
    });
*/
});
