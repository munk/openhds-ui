'use strict';

var LoginPage = require('./loginPage.js').LoginPage;
var FieldWorkerHomePage =
        require('./fieldWorkerHomePage.js').FieldWorkerHomePage;
var CreateSocialGroupPage =
        require('./createSocialGroupPage.js').CreateSocialGroupPage;
var CreateLocationPage =
        require('./createLocationPage.js').CreateLocationPage;
var CreateIndividualsPage =
        require('./createIndividualPage.js').CreateIndividualsPage;
var CreateRelationshipPage =
        require('./createRelationshipPage.js').CreateRelationshipPage;
var CreateVisitPage =
        require('./createVisitPage.js').CreateVisitPage;
var IndividualUpdatePage =
        require('./individualUpdatePage.js').IndividualUpdatePage;
var PregnancyOutcomePage =
        require('./pregnancyOutcomePage.js').PregnancyOutcomePage;
var PregnancyResultPage =
        require('./pregnancyResultPage.js').PregnancyResultPage;
var PregnancyObservationPage =
        require('./pregnancyObservationPage.js').Page;
var DeathPage =
        require('./deathPage.js').Page;
var OutMigrationPage =
        require('./outMigrationPage.js').Page;

var fw = require('./framework.js');
var getElement = fw.getElement;
var selectOption = fw.selectOption;

describe('OpenHDS workflows ', function() {

    beforeEach(function() {
        browser.get('/app/index.html');
    });

    it('Allows a fieldworker to create a baseline census', function() {
        var loginPage = new LoginPage();
        loginPage.doLogin("fieldworker", "password");
        expect(browser.getLocationAbsUrl()).toEqual('/fieldworkerHome');

        var homePage = new FieldWorkerHomePage();
        homePage.newCensus();
        expect(browser.getLocationAbsUrl()).toEqual('/location/new');

        var locationPage = new CreateLocationPage();
        var loc = {
            name: "Test Location",
            extId: "Test Location",
            type: "rural",
            path: ["hierarchy-root",
                   "hierarchy-0",
                   "hierarchy-0-1",
                   "hierarchy-0-1-1"]
        };
        locationPage.doCreateLocation(loc);
        expect(browser.getLocationAbsUrl()).toEqual('/socialGroup/new');

        var socialGroupPage = new CreateSocialGroupPage();
        var group = {
            name: "Test Group",
            extId: "Test Group",
            type: "cohort"
        };
        socialGroupPage.doCreateGroup(group);

        expect(browser.getLocationAbsUrl()).toEqual('/individual/new');

        var individualPage = new CreateIndividualsPage();
        var headOfHousehold = {
            firstName: "Head of Household",
            extId: "Head of Household",
            gender: "female",
            membershipStartType: "head",
            membershipStartDate: "1980-01-01",
            residencyStartType: "birthMigration",
            residencyStartDate: "1980-01-01",
            toggleMore: true
        };
        individualPage.doCreateIndividual(headOfHousehold);

        expect(browser.getLocationAbsUrl()).toEqual('/individual/new');

        var spouse = {
            firstName: "Spouse of Household",
            extId: "Spouse of Household",
            gender: "male",
            membershipStartType: "spouseOfHead",
            membershipStartDate: "2000-01-01",
            residencyStartType: "internalMigration",
            residencyStartDate: "2000-01-01",
            toggleMore: true
        };
        individualPage.doCreateIndividual(spouse);

        expect(browser.getLocationAbsUrl()).toEqual('/relationship/new');

        var relationshipPage = new CreateRelationshipPage();
        var relationship = {
            individualB: "some_uuid",
            type: "spouse",
            startDate: "2000-01-01"
        };

        relationshipPage.doCreateRelationship(relationship);

        expect(browser.getLocationAbsUrl()).toEqual('/fieldworkerHome');
    });

    it('allows a fieldworker to update a location', function() {
        var loginPage = new LoginPage();
        loginPage.doLogin("fieldworker", "password");
        expect(browser.getLocationAbsUrl()).toEqual('/fieldworkerHome');

        var homePage = new FieldWorkerHomePage();
        homePage.updateVisit();
        expect(browser.getLocationAbsUrl()).toEqual('/visit/new');

        //TODO: hiera filtering
        var visitPage = new CreateVisitPage();
        var visit = {
            extId: "visit location-1",
            location: "location-1",
            visitDate: "2016-01-01",
            toggleHasInMigrations: false
        };
        visitPage.doCreateVisit(visit);
        expect(browser.getLocationAbsUrl()).toEqual('/visit');

        var individualUpdatePage = new IndividualUpdatePage();
        var updates = {
            toggleOutMigration: true,
            toggleDeath: true,
            togglePregnancyOutcome: true,
            togglePregnancyObservation: true

        };
        individualUpdatePage.doCreateVisit(updates);

        expect(browser.getLocationAbsUrl()).toEqual('/visit/pregnancyOutcome');

        var pregnancyOutcomePage = new PregnancyOutcomePage();
        var outcome = {
            mother: "mom",
            father: "dad",
            date: "2016-01-01"
        };
        pregnancyOutcomePage.doCreate(outcome);
        expect(browser.getLocationAbsUrl()).toEqual('/visit/pregnancyResult');

        var pregnancyResultPage = new PregnancyResultPage();
        var result = {
            resultType: "liveBirth",
            childFirstName: "firstName",
            childExtId: "firstName",
            childGender: "male"
        };
        pregnancyResultPage.doCreate(result);

        expect(browser.getLocationAbsUrl()).toEqual('/visit/pregnancyObservation');

        var pregnancyObservationPage = new PregnancyObservationPage();
        var observation = {
            pregnancyDate: '2016-02-01',
            deliveryDate: '2016-10-01'
        };

        pregnancyObservationPage.doCreate(observation);

        expect(browser.getLocationAbsUrl()).toEqual('/visit/death');

        var deathPage = new DeathPage();
        var death = {
            place: "place",
            cause: "cause",
            date: "2016-03-01"
        };

        deathPage.doCreate(death);

        expect(browser.getLocationAbsUrl()).toEqual('/visit/outMigration');

        var outMigrationPage = new OutMigrationPage();
        var outMigration = {
            reason: "moved",
            destination: "place",
            migrationType: "externalMigration",
            migrationDate: "2016-02-01"
        };
        outMigrationPage.doCreate(outMigration);
    });
});
