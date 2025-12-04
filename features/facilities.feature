@facilities
Feature: Facilities

#automated from api because the front end is listing the response from it
    @api @automated 
    Scenario: All available facilities user successfully listed
        Given I have an valid access token
        When I try to get all user facilities
        Then the response status code is 200
        And the response contract is as expected
        #As a integration test: I would check it with database if I had access
        # And All available user facilites mare returned