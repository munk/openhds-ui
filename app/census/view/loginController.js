angular.module('openHDS.view').controller('LoginController', ['FieldWorkerService', 'BackendService', LoginController]);

function LoginController(FieldWorkerService, BackendService) {
    var vm = this;
    vm.login = login;

    function login() {
        //todo: make sure form validates required fields
        BackendService.hostname = vm.server;
        FieldWorkerService.authorize(vm.username, vm.password)
    }
}