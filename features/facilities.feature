@facilities
Feature: Facilities

#automated from api because the front end is listing the response from it
    @api @automated @facilities-sc1
    Scenario: All available facilities user successfully listed
        Given I have an valid access token
        When I try to get all user facilities
        Then the response status code is 200
        And the response contract is as expected