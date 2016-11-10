'use strict';

angular.module('openhds')
    .service('MembershipService', ['$rootScope','$http','$q','EntityService', MembershipService]);


function MembershipService( $rootScope, $http, $q, EntityService) {
    var service = this;
    var urlBase = '/memberships';

    service.getHeaders = function() {
        return {
            headers: {
                authorization: "Basic " + $rootScope.credentials
            }
        };
    };

    function Request(model) {
        return {
            collectedByUuid: model.fieldWorker.uuid,
            individualUuid: model.entity.individual.uuid,
            socialGroupUuid: model.entity.socialGroup.uuid,
            membership: {
                startType: model.entity.startType,
                startDate: model.entity.startDate,
                collectionDateTime: model.collectionDate
            }
        };
    }

    service.getByIndividual = function(memberships) {

        var url = $rootScope.restApiUrl + '/memberships/bulk.json';

        var responsePromise = $http.get(url, service.getHeaders());


        return $q(function(resolve, reject) {
            responsePromise.then(
                function(response) {
                    var entities = response.data;
                    resolve(entities);
                },
                function(response){
                    console.log(response);
                    window.alert("Status: " + response.status +
                        "\n" + response.statusText);
                    reject(response);
                }
            );
        });
    };




    service.submit = function(fieldWorker, collectionDate, entity) {
        var model = {
            fieldWorker: fieldWorker,
            collectionDate: collectionDate,
            entity: entity
        };
        return EntityService.submit(urlBase, Request, model);
    };

    return service;
}
