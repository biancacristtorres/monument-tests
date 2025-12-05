@users
Feature: Users

    # Why automated ? frontend relies directly on this API to display all the roles
    @api @automated @users-sc1
    Scenario: All available user roles successfully listed
        Given I have an valid access token
        When I try to get all available user roles
        Then the response status code is 200
        And the response contract is as expected

    # Why automated ? frontend relies directly on this API to display user listings
    # We should keep only the basics scenarios, expanding automation beyond these core cases would add complexity with limited additional value.

    @api @automated @users-sc2
    Scenario Outline: List user accounts with filters
        Given I have a valid access token
        When I try to get all user accounts by filtering
            | status   | roles   | facilities   | limit   | page   | order_field   | order_type   |
            | <status> | <roles> | <facilities> | <limit> | <page> | <order_field> | <order_type> |
        Then the response status code is 200
        And the response contract is as expected
        And all returned accounts match the applied filters

        Examples:
            # users-sc2-ex1 -> Default user listing scenario (ACTIVE + PENDING_VERIFICATION)
            | status                       | roles | facilities | limit | page | order_field        | order_type |
            | ACTIVE, PENDING_VERIFICATION |       |            | 50    | 1    | firstName,lastName | asc,asc    |

            # users-sc2-ex2 -> Filter users by roleId only
            | status | roles   | facilities | limit | page | order_field | order_type |
            |        | roleId1 |            | 50    | 1    |             |            |

            # users-sc2-ex3 -> Filter users by facilityId only
            | status | roles | facilities  | limit | page | order_field | order_type |
            |        |       | facilityId1 | 50    | 1    |             |            |

            # users-sc2-ex4 -> Filter users by roleId and facilityId
            | status | roles   | facilities  | limit | page | order_field | order_type |
            |        | roleId1 | facilityId1 | 50    | 1    |             |            |

            # users-sc2-ex5 -> Filter users by roleId, facilityId and status
            | status | roles   | facilities  | limit | page | order_field | order_type |
            | ACTIVE | roleId1 | facilityId1 | 50    | 1    |             |            |

    @api @automated @users-sc3
    Scenario Outline: List user accounts with filters and ordering
        Given I have a valid access token
        When I try to get all user accounts by filtering
            | status   | roles   | facilities   | limit   | page   | order_field   | order_type   |
            | <status> | <roles> | <facilities> | <limit> | <page> | <order_field> | <order_type> |
        Then the response status code is 200
        And the response contract is as expected
        And all returned accounts match the applied filters

        Examples:
            # users-sc3-ex1 -> Filter users by roleId and order by email desc
            | status | roles   | facilities | limit | page | order_field | order_type |
            | ACTIVE | roleId1 |            | 50    | 1    | email       | desc       |

            # users-sc3-ex2 -> Filter users by facilityId and order by rootRoleName asc
            | status | roles   | facilities  | limit | page | order_field  | order_type |
            |        | roleId1 | facilityId1 | 50    | 1    | rootRoleName | asc        |

            # users-sc3-ex3 -> Filter users by status PENDING_VERIFICATION and order by lastName desc
            | status               | roles | facilities  | limit | page | order_field | order_type |
            | PENDING_VERIFICATION |       | facilityId1 | 50    | 1    | lastName    | desc       |


    # API automation reason: creation rules (status, facilities, validation) are enforced by the backend;
    # the UI only forwards the payload, so API tests are faster and more reliable here.
    @users @api @automated @users-sc4
    Scenario: Create a new user with access to all facilities
        Given I have a valid admin access token
        And a valid root role id exists
        And I choose not to send any facilityOrgIds
        When I send a request to create a new user account
            | firstName          | lastName          | jobTitle              | hasAllFacilityAccess | email              |
            | <random_firstName> | <random_lastName> | <random_jobTitle>     | true                 | <unique_email>     |
        Then the response status code is 201
        And the user account is created with status "PENDING_VERIFICATION"
        And the user account fields match the request payload
        And the user has access to all facilities

    # API automation reason: this negative case is driven purely by backend validation.
    # If hasAllFacilityAccess is false and no facilityOrgIds are provided, the API should reject the request.
    @users @api @automated @users-sc5
    Scenario: Creating a user without facilityOrgIds and hasAllFacilityAccess=false is rejected
        Given I have a valid admin access token
        And a valid root role id exists
        And I set hasAllFacilityAccess to "false"
        And I do not provide any facilityOrgIds
        When I send a request to create a new user account
            | firstName          | lastName          | jobTitle              | hasAllFacilityAccess | email              |
            | <random_firstName> | <random_lastName> | <random_jobTitle>     | false                | <unique_email>     |
        Then the response status code is 406
        And the response body contains the error message "At least one facility permission is required."

    # API automation reason: this is the main happy path for limited access users;
    # the frontend user selection is just a UI wrapper around this API behaviour.
    @users @api @automated @users-sc6
    Scenario: Create a new user with specific facilityOrgIds and hasAllFacilityAccess=false
        Given I have a valid admin access token
        And a valid root role id exists
        And at least one valid facility id is available
        When I send a request to create a new user account
            | firstName          | lastName          | jobTitle              | hasAllFacilityAccess | email              | facilityOrgIds      |
            | <random_firstName> | <random_lastName> | <random_jobTitle>     | false                | <unique_email>     | <valid_facility_id> |
        Then the response status code is 201
        And the user account is created with status "PENDING_VERIFICATION"
        And the user account fields match the request payload
        And the user has access only to the provided facilities

    # UI automation reason: The error mensage displayed for the user is handled by the front end
    @users @api @automated @users-sc7
    Scenario: Erro mensage is displayed when we try to create user with existent email
        Given I am successfully logged in monument
        And I navigate to "Settings"
        And I navigate to "Users & Permissions"
        When I choose to Add Users
        And I enter all the required informarion
        And I enter the already existent email
        Then I should see the error mensage "dddd"
        