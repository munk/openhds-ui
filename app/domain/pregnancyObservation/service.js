'use strict';

angular.module('openhds')
    .service('PregnancyObservationService',
             ['EntityService', PregnancyObservationService]);

function PregnancyObservationService(EntityService) {
    var service = this;
    var urlBase = "/pregnancyObservations";

    function Request(model) {
        return {
            collectedByUuid: model.fieldWorker.uuid,
            visitUuid: model.visit.uuid,
            motherUuid: model.mother.uuid,
            pregnancyObservation: {
                pregnancyDate: model.visit.visitDate,
                expectedDeliveryDate: model.event.deliveryDate,
                collectionDateTime: model.visit.visitDate
            }
        };
    }

    service.submit = function(fieldWorker, collectionDate, visit,
                              mother, event) {
        var model = {
            fieldWorker: fieldWorker,
            collectionDate: collectionDate,
            visit: visit,
            mother: mother,
            event: event
        };
        return EntityService.submit(urlBase, Request, model);
    };

    return service;
}
