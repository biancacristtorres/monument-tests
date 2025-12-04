@users
Feature: Users


    #automated from api because the front end is listing the response from it
    @api @automated
    Scenario: All available user roles successfully listed
        Given I have an valid access token
        When I try to get all available user roles
        Then the response status code is 200
        And the response contract is as expected
    #As a integration test: I would check it with database if I had access
    # And All available user roles are returned


    #automated from api because the front end is listing the response fto display the default result search in the screen
    @api @automated
    Scenario: List result default search
        Given I have an valid access token
        When I try to get all user accounts by filtering
            | status                       | limit | page | order_field         | order_type |
            | ACTIVE, PENDING_VERIFICATION | 50    | 1    | firstName, lastName | desc, asc  |
        Then the response status code is 200
        And the response contract is as expected
#As a integration test: I would check it with database if I had access
# And All available user roles are returned
