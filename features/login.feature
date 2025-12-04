@login
Feature: Authentication and login

    #UI automation reason: this is the basic scenario that should work in the UI
    @ui @smoke @automated @sc1
    Scenario: User with valid credentials can log in successfully
        Given the Monument application is available
        And a user with valid credentials exists
        When the user opens the login page
        And they enter their valid username and password
        And they submit the login form
        Then they are redirected away from the login page
        And they can see the main dashboard or home page

    #UI automation reason: This error mensage displayed in the toaster is made by the front end, the backend returns another message
    @ui @automated @sc2
    Scenario: Login fails with an invalid password
        Given the Monument application is available
        And a user with valid credentials exists
        When the user opens the login page
        And they enter a valid username and an invalid password
        And they submit the login form
        Then they remain on the login page
        And the error message is displayed "The email address / username or password you entered is incorrect."
        And they are not redirected to the dashboard

    #UI automation reason: This error mensage displayed in the toaster is made by the front end, the backend returns another message
    @ui @automated @sc3
    Scenario: Login fails with an invalid username
        Given the Monument application is available
        And a user with valid credentials exists
        When the user opens the login page
        And they enter a invalid username and an valid password
        And they submit the login form
        Then they remain on the login page
        And the error message is displayed "The email address / username or password you entered is incorrect."
        And they are not redirected to the dashboard

    #Skip reason: this is already tested in @sc1
    @api @skip
    Scenario: API authentication returns a valid token for correct credentials
        Given a user with valid credentials exists
        When the client calls the authentication endpoint with those credentials
        Then the response status code is 200
        And the response body contains an access token
        And the token can be used to call a protected endpoint successfully

    #Skip reason: this is already tested in @sc2
    @api @skip
    Scenario: API authentication returns 401 for invalid credentials
        Given a user with valid credentials exists
        When the client calls the authentication endpoint with an invalid password
        Then the response status code is 401
        And the response body does not contain an access token

    @api @automated @sc4
    Scenario: /auth/me with an invalid token is rejected
        Given an invalid access token
        When the client calls a protected endpoint using that token
        Then the response status code is 403
        And the response body indicates that authentication is required or forbidden

    #manual: very easy and simple to test manually
    @api @manual
    Scenario: API requests with an expired token is rejected
        Given an expired or invalid access token
        When the client calls a protected endpoint using that token
        Then the response status code is 401
        And the response body indicates that authentication is required or forbidden

    #manual: very easy and simple to test manually
    @ui @manual
    Scenario: User is redirected to login when accessing a protected page without being authenticated
        Given the user is not logged in
        When they try to open a protected page URL directly
        Then they are redirected to the login page
        And no sensitive information is displayed