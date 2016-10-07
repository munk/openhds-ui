describe('FieldWorkerService Test', function() {

    var service, $httpBackend, $rootScope;

    beforeEach(module('openhds'));

    beforeEach(inject(function(_FieldWorkerService_, $injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $rootScope.restApiUrl = 'http://example.com';
        $rootScope.credentials = "user:password";
        service = _FieldWorkerService_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should post well formed data to rest api', function() {

        $httpBackend.expectGET(
            'http://example.com/fieldWorkers/bulk.json')
            .respond(200, [{uuid: '123',
                            fieldWorkerId: 'fwid',
                            firstName: 'firstName',
                            lastName: 'lastName'}]);

        service.getAllFieldWorkers(function(response) {
            expect(response).toEqual(
                [{
                    uuid: '123',
                    id: 'fwid',
                    firstName: 'firstName',
                    lastName: 'lastName'
                }]);
        });

        $httpBackend.flush();
    });
});