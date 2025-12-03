Feature: Authentication and login
    As an authorized user
    I want to authenticate the credentials
    in order to access Monument safely

    @ui @smoke
    Scenario: User with valid credentials can log in successfully
        Given the Monument application is available
        And a user with valid credentials exists
        When the user opens the login page
        And they enter their valid username and password
        And they submit the login form
        Then they are redirected away from the login page
        And they can see the main dashboard or home page

    @ui
    Scenario: Login fails with an invalid password
        Given the Monument application is available
        And a user with valid credentials exists
        When the user opens the login page
        And they enter a valid username and an invalid password
        And they submit the login form
        Then they remain on the login page
        And the error message is displayed "The email address / username or password you entered is incorrect."
        And they are not redirected to the dashboard

    @api @smoke
    Scenario: API authentication returns a valid token for correct credentials
        Given a user with valid credentials exists
        When the client calls the authentication endpoint with those credentials
        Then the response status code is 200
        And the response body contains an access token
        And the token can be used to call a protected endpoint successfully

    @api
    Scenario: API authentication returns 401 for invalid credentials
        Given a user with valid credentials exists
        When the client calls the authentication endpoint with an invalid password
        Then the response status code is 401
        And the response body does not contain an access token

    @api
    Scenario: API requests with an expired or invalid token are rejected
        Given an expired or invalid access token
        When the client calls a protected endpoint using that token
        Then the response status code is 401 or 403
        And the response body indicates that authentication is required or forbidden

    @ui @manual
    Scenario: User is redirected to login when accessing a protected page without being authenticated
        Given the user is not logged in
        When they try to open a protected page URL directly
        Then they are redirected to the login page
        And no sensitive information is displayed

    @ui @manual
    Scenario: Login error messages are clear and helpful
        Given a user enters invalid credentials on the login page
        When the login attempt fails
        Then the error message clearly indicates that the credentials are invalid
        And does not expose sensitive technical details