Feature: rebuild html
    In order to keep files updated,
    As an irssi user
    I want to rebuild the HTML files

    Scenario: Rebuilding static file
        Given irssi has the following settings
            | setting           | value     |
            | url_use_webapp    | OFF       |
            | url_html_location | test.html |
        And the static file was created
        When the user enters the command "/url -refresh"
        Then a file named "test.html" should exist
        And the file "test.html" should not contain "test_static_file"

    Scenario: Rebuilding the webapp
        Given irssi has the following settings
            | setting           | value     |
            | url_use_webapp    | ON        |
            | url_html_location | test      |
        And the webapp was created
        When the user enters the command "/url -refresh"
        Then a directory named "test" should exist
        And a file named "test/index.html" should exist
        And a file named "test/style.css" should exist
        And a file named "test/script.js" should exist
        And a file named "test/urls.json" should exist
        And the file "test/index.html" should not contain "test_webapp_file"
        And the file "test/style.css" should not contain "test_webapp_file"
        And the file "test/script.js" should not contain "test_webapp_file"
        And the file "test/urls.json" should not contain "test_webapp_file"
