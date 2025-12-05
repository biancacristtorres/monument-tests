@login
Feature: Authentication and login

    #UI automation reason: this is the basic scenario that should work in the UI
    @ui @smoke @automated @login-sc1
    Scenario: User with valid credentials can log in successfully
        Given the Monument application is available
        And a user with valid credentials exists
        When the user opens the login page
        And they enter their valid username and password
        And they submit the login form
        Then they are redirected away from the login page
        And they can see the main dashboard or home page

    #UI automation reason: This error mensage displayed in the toaster is made by the front end, the backend returns another message
    @ui @automated @login-sc2
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
    @ui @automated @login-sc3
    Scenario: Login fails with an invalid username
        Given the Monument application is available
        And a user with valid credentials exists
        When the user opens the login page
        And they enter a invalid username and an valid password
        And they submit the login form
        Then they remain on the login page
        And the error message is displayed "The email address / username or password you entered is incorrect."
        And they are not redirected to the dashboard

    @api @automated @login-sc4
    Scenario: /auth/me with an invalid token is rejected
        Given an invalid access token
        When the client calls a protected endpoint using that token
        Then the response status code is 403
        And the response body indicates that authentication is required or forbidden

    #manual: very easy and simple to test manually
    @api @manual @login-sc5
    Scenario: API requests with an expired token is rejected
        Given an expired or invalid access token
        When the client calls a protected endpoint using that token
        Then the response status code is 401
        And the response body indicates that authentication is required or forbidden

    #manual: very easy and simple to test manually
    @ui @manual @login-sc6
    Scenario: User is redirected to login when accessing a protected page without being authenticated
        Given the user is not logged in
        When they try to open a protected page URL directly
        Then they are redirected to the login page
        And no sensitive information is displayed