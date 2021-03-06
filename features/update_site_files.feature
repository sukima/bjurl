Feature: Update site files
    In order to view logged urls in a browser,
    As an irssi user
    I want to save an HTML site to a location

    Scenario: Writing a static file
        Given irssi has the following settings
            | setting           | value     |
            | url_use_webapp    | OFF       |
            | url_html_location | test.html |
        And someone has posted "this is a test http://foobar.com/"
        When the html files are updated
        Then a file named "test.html" should exist
        And the file "test.html" should contain "http://foobar.com/"

    Scenario: Writing a webapp
        Given irssi has the following settings
            | setting           | value     |
            | url_use_webapp    | ON        |
            | url_html_location | test      |
        And someone has posted "this is a test http://foobar.com/"
        When the html files are updated
        Then a directory named "test" should exist
        And a file named "test/index.html" should exist
        And a file named "test/style.css" should exist
        And a file named "test/script.js" should exist
        And a file named "test/urls.json" should exist
        And the file "test/urls.json" should contain "http://foobar.com/"

    Scenario: Updating a static file
        Given irssi has the following settings
            | setting           | value     |
            | url_use_webapp    | OFF       |
            | url_html_location | test.html |
        And the static file was created
        When someone posts "this is a test http://foobar.example2.com/"
        Then the file "test.html" should contain "http://foobar.example2.com/"

    Scenario: Updating a webapp
        Given irssi has the following settings
            | setting           | value     |
            | url_use_webapp    | ON        |
            | url_html_location | test      |
        And the webapp was created
        When someone posts "this is a test http://foobar.example3.com/"
        Then the file "test/urls.json" should contain "http://foobar.example3.com/"

    Scenario: Max limits
        Given irssi has the following settings
            | setting      | value |
            | url_max_urls | 20    |
        And 20 urls are stored
        When someone posts "this is a test http://foobar.example3.com/"
        Then there should be 20 urls stored
