angular.module('openHDS.view')
    .directive('textbox', textbox)
    .directive('passwordbox', passwordbox)
    .directive('datebox', datebox)
    .directive('constbox', constbox)
    .directive('checkbox', checkbox)
    .directive('submitbutton', submitbutton)
    .directive('selectbox', selectbox);

function textbox() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            id: '@',
            modelKey: "=ngModel"
        },
        template: '<div class="form-group">' +
                  '<label class="col-md-4 control-label" for="{{id}}">{{label}}</label>' +
                  '<div class="col-md-4">' +
                  '<input required type="text" id="{{id}}_input" name="{{id}}" ng-model="modelKey" class="form-control input-md"/>' +
                  '</div>' +
                  '</div>'
    };
}

function constbox() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            id: '@',
            modelKey: "=ngModel"
        },
        template: '<div class="form-group">' +
        '<label class="col-md-4 control-label" for="{{id}}">{{label}}</label>' +
        '<div class="col-md-4">' +
        '<input ng-readonly="true" type="text" id="{{id}}" name="{{id}}" ng-model="modelKey" class="form-control input-md"/>' +
        '</div>' +
        '</div>'
    };
}

function checkbox() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            id: '@',
            modelKey: "=ngModel"
        },
        template: '<div class="form-group">' +
        '<label class="col-md-4 control-label" for="{{id}}">{{label}}</label>' +
        '<div class="col-md-4">' +
        '<input type="checkbox" id="{{id}}_check" name="{{id}}" ng-model="modelKey" class="form-control input-md"/>' +
        '</div>' +
        '</div>'
    };
}

function passwordbox() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            id: '@',
            modelKey: "=ngModel"
        },
        template: '<div class="form-group">' +
        '<label class="col-md-4 control-label" for="{{id}}">{{label}}</label>' +
        '<div class="col-md-4">' +
        '<input required type="password" id="{{id}}_input" name="{{id}}" ng-model="modelKey" class="form-control input-md"/>' +
        '</div>' +
        '</div>'
    };
}

function datebox() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            label: '@',
            id: '@',
            modelKey: "=ngModel"
        },
        template: '<div class="form-group">' +
        '<label class="col-md-4 control-label" for="{{id}}">{{label}}</label>' +
        '<div class="col-md-4">' +
        '<input required type="date" id="{{id}}_input" name="{{id}}" ng-model="modelKey" class="form-control input-md"/>' +
        '</div>' +
        '</div>'
    };
}

function selectbox() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            label: '@',
            id: '@',
            modelKey: '=ngModel'
        },
        template: '<div class="form-group">' +
                  '<label class="col-md-4 control-label" for="{{id}}">{{label}}</label>' +
                  '<div class="col-md-4">' +
                  '<select required ng-transclude id="{{id}}_select" ng-model=modelKey ng-required="true" class="form-control">' +

                  '</select>' +
                  '</div>' +
                  '</div>'
    };
}

function submitbutton() {
    return {
            restrict: 'E',
            replace: true,
            scope: {
            },
            template: '<div class="form-group">' +
            '<label class="col-md-4 control-label" for="createButton"></label>' +
            '<div class="col-md-4">' +
            '<input type="submit" class="btn btn-success form-control" id="createButton" />' +
            '</div>' +
            '</div>'
    };
}
