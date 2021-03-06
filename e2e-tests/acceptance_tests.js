'use strict';

var request = require('request');
var postValidations = [];

function generateQuickGuid() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

function selectDropdownbyNum (element, optionNum) {
    var options = element.all(by.tagName('option'));
    options.get(optionNum).click();
};

function validateCreatedByExtId(extId, type, done) {
    var url = 'http://bhd.rcg.usm.maine.edu:8080/' + type + '/external/' + extId + '.json';
    request.get(url,
                {
                    auth: {
                        user: "user",
                        pass: "password"
                    }
                },
                function(err, resp, body) {
                    expect(resp.statusCode).toEqual(200);

                    var content = JSON.parse(body).content;

                    if(content) {
                        var entities = content.filter(function(e) {
                            return e.extId === extId;
                        });

                        expect(entities.length).toEqual(1);
                    }
                    done();
                });
}

function LoginPage() {
    return {
        login: function(username, password) {
            var username_input = "username_input",
                password_input = "password_input",
                submit_button = "createButton";

            element(by.id(username_input)).sendKeys(username);
            element(by.id(password_input)).sendKeys(password);
            element(by.id(submit_button)).click();
        }
    };
}

function BaselineInitPage() {
    function openFieldWorkerModal() {
        var fieldWorkerSelectModal_button = "fieldworker-select";
        element(by.id(fieldWorkerSelectModal_button)).click();
        browser.sleep(1000);
    }

    function openHierarchySelectModal() {
        var hierarchySelect_button = "hierarchy-select";
        element(by.id(hierarchySelect_button)).click();
        browser.sleep(1000);
    }

    function openLocationTab() {
        var tab_xpath = '//*[@id="tree-root"]/ol/li/div/ol/li[1]/div/div/div/div[1]/a/span';
        element(by.xpath(tab_xpath)).click();

        tab_xpath = '//*[@id="tree-root"]/ol/li/div/ol/li[1]/div/ol/li[1]/div/div/div/div[1]/a/span';
        element(by.xpath(tab_xpath)).click();
    }

    return {
        setCollectionDate: function(collectionDate) {
            var date_input = "collectionDate_input";

            element(by.id(date_input)).sendKeys(collectionDate);
        },
        setFieldWorker: function(fieldworkerId) {
            var fieldWorkerSelect_button = fieldworkerId;
            openFieldWorkerModal();
            element(by.id(fieldWorkerSelect_button)).click();
            browser.sleep(1000); // Give dom time to hide elements. A timeout won't work yet https://github.com/angular/protractor/issues/2313
        },
        setRegion: function(region) {
            openHierarchySelectModal();
            openLocationTab();
            var region_xpath = '//*[@id="tree-root"]/ol/li/div/ol/li[1]/div/ol/li[1]/div/ol/li[1]/div/div/div/div[2]/a'; // region 0-1-1
            element(by.xpath(region_xpath)).click();
            browser.sleep(1000);

        },
        startLocation: function() {
            element(by.id("next")).click();
        }
    };
}

function BaselineLocationPage() {
    browser.sleep(1000);
    var extId_input = 'locationExtId_input';
    return {
        openNewLocationModal: function() {
            element(by.id('displayNewLocationModal')).click();
            browser.sleep(1000);
        },
        getExternalId: function() {
            return element(by.id(extId_input)).getAttribute('value');
        },
        setExternalId: function(id) {
            var input = element(by.id(extId_input));
            input.clear();
            input.sendKeys(id);
        },
        setLocationName: function(name) {
            var locationName_input = 'locationName_input';
            element(by.id(locationName_input)).sendKeys(name);
        },
        setLocationType: function(typeNum) {
            var select = element(by.id('locationType_select'));
            selectDropdownbyNum(select, typeNum);
        },
        toggleEmptyLocation: function() {
            $('#emptyLocation').click();
        },
        closeLocationModalOK: function() {
            $('#createLocation').click();
            browser.sleep(1000);
        },
        completeEmptyBaseline: function() {
            $('#completeBaselineEmptyLocation').click();
            browser.sleep(1000);
        },
        startSocialGroups: function() {
            $('#startSocialGroups').click();
            browser.sleep(1000);
        }

    };
}

function BaselineSocialGroupPage() {
    browser.sleep(1000);
    var extId_input = 'socialGroupExtId_input';
    return {
        openNewSocialGroupModal: function() {
            $('#createSocialGroup').click();
            browser.sleep(1000);
        },
        setExternalId: function(id) {
            var input = element(by.id(extId_input));
            input.clear();
            input.sendKeys(id);
        },
        setGroupName: function(name) {
            var locationName_input = 'groupName_input';
            element(by.id(locationName_input)).sendKeys(name);
        },
        setGroupType: function(typeNum) {
            var select = element(by.id('groupType_select'));
            selectDropdownbyNum(select, typeNum);
        },
        closeModalOk: function() {
            $('#submitSocialGroup').click();
            browser.sleep(1000);
        },
        startIndividuals: function() {
            $('#startIndividuals').click();
            browser.sleep(1000);
        }
    };
}

function BaselineIndividualPage() {
    browser.sleep(1000);
    var extId_input = 'extId_input';
    return {
        openNewIndividualModal: function() {
            $('#openCreateIndividualsModal').click();
            browser.sleep(1000);
        },
        setFirstName: function(name) {
            $('#firstName_input').sendKeys(name);
        },
        setLastName: function(name) {
            $('#lastName_input').sendKeys(name);
        },
        setExternalId: function(id) {
            var input = element(by.id(extId_input));
            input.clear();
            input.sendKeys(id);
        },
        setGender: function(typeNum) {
            var select = element(by.id('gender_select'));
            selectDropdownbyNum(select, typeNum);
        },
        setDateOfBirth: function(dob) {
            $('#dateOfBirth_input').sendKeys(dob);
        },
        assignMembership: function() {
            $('#assignMembership').click();
            browser.sleep(1000);
        },
        setMembershipStartType: function(typeNum) {
            var select = element(by.id('membershipStartType_select'));
            selectDropdownbyNum(select, typeNum);
        },
        createMembership: function() {
            $('#createMembership').click();
            browser.sleep(1000);
        },
        startRelationships: function() {
            $('#startRelationships').click();
            browser.sleep(1000);
        }
    };
}

function BaselineCreateRelationshipPage() {
    return {
        openNewRelationshipModal: function() {
            $('#createRelationship').click();
            browser.sleep(1000);
        }
    };
}

function UpdateInitPage() {
    function openFieldWorkerModal() {
        var fieldWorkerSelectModal_button = "fieldworker-select";
        element(by.id(fieldWorkerSelectModal_button)).click();
        browser.sleep(1000);
    }

    function openHierarchySelectModal() {
        var hierarchySelect_button = "hierarchy-select";
        element(by.id(hierarchySelect_button)).click();
        browser.sleep(1000);
    }
    function openLocationTab() {
        var tab_xpath = '//*[@id="tree-root"]/ol/li/div/ol/li[1]/div/div/div/div[1]/a/span';
        element(by.xpath(tab_xpath)).click();

        tab_xpath = '//*[@id="tree-root"]/ol/li/div/ol/li[1]/div/ol/li[1]/div/div/div/div[1]/a/span';
        element(by.xpath(tab_xpath)).click();
    }
    return {
        setVisitDate: function(visitDate) {
            $('#visitDate_input').sendKeys(visitDate);
        },
        setFieldWorker: function(fieldworkerId) {
            var fieldWorkerSelect_button = fieldworkerId;
            openFieldWorkerModal();
            element(by.id(fieldWorkerSelect_button)).click();
            browser.sleep(1000); // Give dom time to hide elements. A timeout won't work yet https://github.com/angular/protractor/issues/2313
        },
        setRegion: function(region) {
            openHierarchySelectModal();
            openLocationTab();
            var region_xpath = '//*[@id="tree-root"]/ol/li/div/ol/li[1]/div/ol/li[1]/div/ol/li[1]/div/div/div/div[2]/a'; // region 0-1-1
            element(by.xpath(region_xpath)).click();
            browser.sleep(1000);

        },
        selectLocation: function(location) {
            var filterPath = '//*[@id="locationSelectModal"]/div/div/div[2]/table/thead/tr[2]/th[2]/input';
            $('#location-select').click();
            browser.sleep(1000);
            element(by.xpath(filterPath)).sendKeys(location);
            element(by.id(location)).click();
        },
        beginVisit: function() {
            $('#begin_visit_button').click();
            browser.sleep(1000);
        }
    };
}

function CreateVisitPage() {
    return {
        selectIndividual: function(individual) {
            $('#individual-select').click();
            browser.sleep(1000);
            var individual_xpath = '//*[@id="individualSelectModal"]/div/div/div[2]/table/thead/tr[2]/th[2]/input';
            element(by.xpath(individual_xpath)).sendKeys(individual);
            element(by.id(individual)).click();
            browser.sleep(1000);
        },
        openInMigrationModal: function() {
            $('#displayNewInMigrationModal').click();
            browser.sleep(1000);
        },
        setInMigrationOrigin: function(origin) {
            $('#origin_input').sendKeys(origin);
        },
        setInMigrationReason: function(reason) {
            $('#inmigrationreason_input').sendKeys(reason);
        },
        setInMigrationDate: function(migrationDate) {
            $('#inMigrationDate_input').sendKeys(migrationDate);
        },
        setMigrationType: function(typeNum) {
            var select = element(by.id('inMigrationType_select'));
            selectDropdownbyNum(select, typeNum);
        },
        openInMigrationIndividualModal: function() {
            browser.sleep(500);
            $('#individual-create-button').click();
            browser.sleep(1000);
        },
        completeVisit: function() {
            $('#complete-visit').click();
            browser.sleep(1000);
        },
        completeInMigration: function() {
            $('#createInMigration').click();
            browser.sleep(1000);
        }
    };
}


describe('OpenHDS', function() {

    beforeEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
        postValidations = [];
        browser.get('/');
        browser.driver.manage().window().setSize(1440, 900);
    });

    afterEach(function(done) {
        if (postValidations.length === 0) {
            done();
        }

        for(var k = 0; k < postValidations.length; k++) {
            var validation = postValidations.pop();
            validation(done);
        }
    });

    it('creates baseline with empty location', function() {

        var loginPage = new LoginPage();
        loginPage.login('user', 'password');

        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/baseline');

        var baselineInitPage = new BaselineInitPage();
        baselineInitPage.setCollectionDate('01-01-2016');
        baselineInitPage.setFieldWorker("fieldworker");
        baselineInitPage.setRegion();
        baselineInitPage.startLocation();
        expect($('#locationTab').isDisplayed()).toBeTruthy();

        var baselineLocationPage = new BaselineLocationPage();
        baselineLocationPage.openNewLocationModal();
        expect(baselineLocationPage.getExternalId()).toMatch(/location-\d/);

        var locationId = 'empty-location-test-' + generateQuickGuid();
        baselineLocationPage.setExternalId(locationId);
        baselineLocationPage.setLocationName('an-empty-location');
        baselineLocationPage.setLocationType(1);
        baselineLocationPage.toggleEmptyLocation();
        baselineLocationPage.closeLocationModalOK();
        baselineLocationPage.completeEmptyBaseline();

        expect($('#collectionDate').isDisplayed()).toBeTruthy();

        postValidations.push(function(done) {
            validateCreatedByExtId(locationId, 'locations', done);
        });
    });

    it('creates baseline with socialGroup', function() {

        var loginPage = new LoginPage();
        loginPage.login('user', 'password');
        var baselineInitPage = new BaselineInitPage();
        baselineInitPage.setCollectionDate('01-01-2016');
        baselineInitPage.setFieldWorker("fieldworker");
        baselineInitPage.setRegion();
        baselineInitPage.startLocation();

        var locationId = 'new-location-test-' + generateQuickGuid();
        var baselineLocationPage = new BaselineLocationPage();
        baselineLocationPage.openNewLocationModal();
        baselineLocationPage.setExternalId(locationId);
        baselineLocationPage.setLocationName('a-populated-location');
        baselineLocationPage.setLocationType(1);
        baselineLocationPage.closeLocationModalOK();
        baselineLocationPage.startSocialGroups();
        expect($('#groupTab').isDisplayed()).toBeTruthy();

        var socialGroupId = 'a-socialgroup-test-' + generateQuickGuid();
        var baselineSocialGroupPage = new BaselineSocialGroupPage();
        baselineSocialGroupPage.openNewSocialGroupModal();
        baselineSocialGroupPage.setGroupName('a-test-socialgroup');
        baselineSocialGroupPage.setExternalId(socialGroupId);
        baselineSocialGroupPage.setGroupType(1);
        baselineSocialGroupPage.closeModalOk();
        baselineSocialGroupPage.startIndividuals();
        expect($('#individualsTab').isDisplayed()).toBeTruthy();

        postValidations.push(function(done) {
            validateCreatedByExtId(socialGroupId, 'socialGroups', done);
        });

    });

    it('creates baseline with residents', function() {

        var loginPage = new LoginPage();
        loginPage.login('user', 'password');
        var baselineInitPage = new BaselineInitPage();
        baselineInitPage.setCollectionDate('01-01-2016');
        baselineInitPage.setFieldWorker("fieldworker");
        baselineInitPage.setRegion();
        baselineInitPage.startLocation();

        var locationId = 'new-location-test-' + generateQuickGuid();
        var baselineLocationPage = new BaselineLocationPage();
        baselineLocationPage.openNewLocationModal();
        baselineLocationPage.setExternalId(locationId);
        baselineLocationPage.setLocationName('a-populated-location');
        baselineLocationPage.setLocationType(1);
        baselineLocationPage.closeLocationModalOK();
        baselineLocationPage.startSocialGroups();

        var socialGroupId = 'a-socialgroup-test-' + generateQuickGuid();
        var baselineSocialGroupPage = new BaselineSocialGroupPage();
        baselineSocialGroupPage.openNewSocialGroupModal();
        baselineSocialGroupPage.setGroupName('a-test-socialgroup');
        baselineSocialGroupPage.setExternalId(socialGroupId);
        baselineSocialGroupPage.setGroupType(1);
        baselineSocialGroupPage.closeModalOk();
        baselineSocialGroupPage.startIndividuals();

        var individualAId = 'an-individual-test-1' + generateQuickGuid();
        var individualBId = 'an-individual-test-2' + generateQuickGuid();
        var individualCId = 'an-individual-test-3' + generateQuickGuid();
        var individualDId = 'an-individual-test-4' + generateQuickGuid();
        var baselineIndividualPage = new BaselineIndividualPage();
        baselineIndividualPage.openNewIndividualModal();
        baselineIndividualPage.setFirstName('a-first-name-1');
        baselineIndividualPage.setLastName('a-last-name-1');
        baselineIndividualPage.setExternalId(individualAId);
        baselineIndividualPage.setGender(1);
        baselineIndividualPage.setDateOfBirth('01-01-2000');
        baselineIndividualPage.assignMembership();
        baselineIndividualPage.setMembershipStartType(1);
        baselineIndividualPage.createMembership();

        browser.sleep(2000);
        baselineIndividualPage.openNewIndividualModal();
        baselineIndividualPage.setFirstName('a-first-name-2');
        baselineIndividualPage.setLastName('a-last-name-2');
        baselineIndividualPage.setExternalId(individualBId);
        baselineIndividualPage.setGender(1);
        baselineIndividualPage.setDateOfBirth('01-01-2000');
        baselineIndividualPage.assignMembership();
        baselineIndividualPage.setMembershipStartType(2);
        baselineIndividualPage.createMembership();

        browser.sleep(2000);
        baselineIndividualPage.openNewIndividualModal();
        baselineIndividualPage.setFirstName('a-first-name-3');
        baselineIndividualPage.setLastName('a-last-name-3');
        baselineIndividualPage.setExternalId(individualCId);
        baselineIndividualPage.setGender(1);
        baselineIndividualPage.setDateOfBirth('01-01-2000');
        baselineIndividualPage.assignMembership();
        baselineIndividualPage.setMembershipStartType(3);
        baselineIndividualPage.createMembership();

        browser.sleep(2000);
        baselineIndividualPage.openNewIndividualModal();
        baselineIndividualPage.setFirstName('a-first-name-4');
        baselineIndividualPage.setLastName('a-last-name-4');
        baselineIndividualPage.setExternalId(individualDId);
        baselineIndividualPage.setGender(1);
        baselineIndividualPage.setDateOfBirth('01-01-2000');
        baselineIndividualPage.assignMembership();
        baselineIndividualPage.setMembershipStartType(3);
        baselineIndividualPage.createMembership();

        baselineIndividualPage.startRelationships();

        expect($('#relationshipsTab').isDisplayed()).toBeTruthy();

        $('#completeBaseline').click();
        browser.sleep(1000);

        expect($('#collectionDate').isDisplayed()).toBeTruthy();

        postValidations.push(function(done) {
            console.log('checking ' + individualAId);
            validateCreatedByExtId(individualAId, 'individuals', done);
        });

    });

    it('creates visit with updates', function() {
        var loginPage = new LoginPage();
        loginPage.login('user', 'password');
        var baselineInitPage = new BaselineInitPage();
        baselineInitPage.setCollectionDate('01-01-2016');
        baselineInitPage.setFieldWorker("fieldworker");
        baselineInitPage.setRegion();
        baselineInitPage.startLocation();

        var locationId = 'new-location-test-' + generateQuickGuid();
        var baselineLocationPage = new BaselineLocationPage();
        baselineLocationPage.openNewLocationModal();
        baselineLocationPage.setExternalId(locationId);
        baselineLocationPage.setLocationName('a-populated-location');
        baselineLocationPage.setLocationType(1);
        baselineLocationPage.closeLocationModalOK();
        baselineLocationPage.startSocialGroups();

        var socialGroupId = 'a-socialgroup-test-' + generateQuickGuid();
        var baselineSocialGroupPage = new BaselineSocialGroupPage();
        baselineSocialGroupPage.openNewSocialGroupModal();
        baselineSocialGroupPage.setGroupName('a-test-socialgroup');
        baselineSocialGroupPage.setExternalId(socialGroupId);
        baselineSocialGroupPage.setGroupType(1);
        baselineSocialGroupPage.closeModalOk();
        baselineSocialGroupPage.startIndividuals();

        var individualAId = 'an-individual-test-1' + generateQuickGuid();
        var individualBId = 'an-individual-test-2' + generateQuickGuid();
        var individualCId = 'an-individual-test-3' + generateQuickGuid();
        var individualDId = 'an-individual-test-4' + generateQuickGuid();
        var baselineIndividualPage = new BaselineIndividualPage();

        function createIndividual(first, last, extId, gender, dob, membership) {
            baselineIndividualPage.openNewIndividualModal();
            baselineIndividualPage.setFirstName(first);
            baselineIndividualPage.setLastName(last);
            baselineIndividualPage.setExternalId(extId);
            baselineIndividualPage.setGender(gender);
            baselineIndividualPage.setDateOfBirth(dob);
            baselineIndividualPage.assignMembership();
            baselineIndividualPage.setMembershipStartType(membership);
            baselineIndividualPage.createMembership();
        }

        createIndividual('a-first-name-1', 'a-last-name-1', individualAId, 1, "01-01-2000", 1);
        createIndividual('a-first-name-2', 'a-last-name-2', individualBId, 1, "01-01-2000", 2);
        createIndividual('a-first-name-3', 'a-last-name-3', individualCId, 1, "01-01-2000", 3);
        createIndividual('a-first-name-4', 'a-last-name-4', individualDId, 1, "01-01-2000", 3);

        baselineIndividualPage.startRelationships();
        $('#completeBaseline').click();
        browser.sleep(1000);
        $('#update_link').click();
        browser.sleep(1000);
        expect($('#visitDate').isDisplayed()).toBeTruthy();

        var updateInitPage = new UpdateInitPage();
        updateInitPage.setVisitDate('06-06-2016');
        updateInitPage.setFieldWorker('fieldworker');
        updateInitPage.setRegion();
        updateInitPage.selectLocation(locationId);
        updateInitPage.beginVisit();

        var createVisitPage = CreateVisitPage();
        createVisitPage.selectIndividual(individualAId);
        createVisitPage.openInMigrationModal();
        createVisitPage.setInMigrationOrigin('a silly place');
        createVisitPage.setInMigrationReason('searching for a grail');
        createVisitPage.setInMigrationDate('06-06-2016');
        createVisitPage.setMigrationType(2);
        createVisitPage.openInMigrationIndividualModal();

        var individualEId = 'an-individual-test-5' + generateQuickGuid();
        var updateIndividualPage = new BaselineIndividualPage();
        baselineIndividualPage.setFirstName('a-first-name-5');
        baselineIndividualPage.setLastName('a-last-name-5');
        baselineIndividualPage.setExternalId(individualDId);
        baselineIndividualPage.setGender(1);
        baselineIndividualPage.setDateOfBirth('01-01-2000');

        $('#assignMembershipButton').click();
        browser.sleep(1000);
        createVisitPage.completeInMigration();
    });
});
