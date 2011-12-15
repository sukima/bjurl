Feature: clean html
    In order to clean up writen files
    As an irssi user
    I want to remove any files created

    Scenario: Clean static file
        Given irssi has the following settings
            | setting           | value     |
            | url_use_webapp    | OFF       |
            | url_html_location | test.html |
        And the static file was created
        When the user enters the command "/url -clean"
        Then the output should contain "removed"
        And a file named "test.html" should not exist

    Scenario: Clean webapp
        Given irssi has the following settings
            | setting           | value     |
            | url_use_webapp    | ON        |
            | url_html_location | test      |
        And the webapp was created
        When the user enters the command "/url -clean"
        Then the output should contain "removed"
        And a file named "test/index.html" should not exist
        And a file named "test/style.css" should not exist
        And a file named "test/script.js" should not exist
        And a file named "test/urls.json" should not exist
