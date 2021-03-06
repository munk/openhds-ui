'use strict';

angular.module('openhds')
    .service('IndividualService',
             ['EntityService', IndividualService]);

function IndividualService(EntityService) {
    var service = this;
    var urlBase = '/individuals';

    function Request(model) {
        return {
            collectedByUuid: model.fieldWorker.uuid,
            individual: {
                firstName: model.entity.firstName,
                lastName: model.entity.lastName,
                dateOfBirth: model.entity.dateOfBirth,
                extId: model.entity.extId,
                gender: model.entity.gender,
                collectionDateTime: model.collectionDate
            }
        };
    }

    function Response(entity) {
        return {
            uuid: entity.uuid,
            extId: entity.extId,
            firstName: entity.firstName,
            lastName: entity.lastName,
            dateOfBirth: entity.dateOfBirth,
            gender: entity.gender
        };
    }

    service.getByHierarchy = function(hierarchyUuid) {
        return EntityService.getByHierarchy(urlBase, Response, hierarchyUuid);
    };

    service.getByExtId = function(extId) {
        return EntityService.getByExtId(urlBase, Response, extId);
    };


    service.getByLocation = function(locationId) {
        return EntityService.getByLocation(urlBase, Response, locationId);
    };

    service.getBySocialGroup = function(socialGroupId) {
        return EntityService.getBySocialGroup(urlBase, Response, socialGroupId);
    };


    service.getByFieldWorker = function(id) {
        return EntityService.getByFieldWorker(urlBase, Response, id);
    };


    service.getBySearch = function(entityList) {
        return EntityService.getBySearch(urlBase, Response, entityList);

    };


    service.submit = function(fieldWorker, collectionDate, entity) {
        var model = {
            fieldWorker: fieldWorker,
            collectionDate: collectionDate,
            entity: entity
        };
        var result = EntityService.submit(urlBase, Request, model);
        return result;
    };

    service.delete = function(id, reason, success, failure) {
        EntityService.safeDelete(urlBase, id, reason)
            .then(function(response) {
                console.log(response.data);
            });
    };

    service.submitEdited = function(indiv) {
        var model = {
            uuid :  indiv.uuid,
            status: indiv.status,
            firstName : indiv.firstName,
            lastName : indiv.lastName,
            gender : indiv.gender
        };
        return EntityService.submitEdited(urlBase, model);
    };

    service.getExtId = function() {
        var data = {};
        return EntityService.getExtId(urlBase, 'Individual', data);
    };

    service.validateExtId = function(id) {
        var data = {};
        return EntityService.validateExtId(urlBase, 'Individual', id, data);
    };

    return service;
}
