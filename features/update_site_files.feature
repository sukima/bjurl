Feature: Update site files
    In order to view logged urls,
    As an irssi user
    I want to save an HTML site to a location

    Scenario: Writing a static file
        Given irssi has the following settings
        | setting           | value     |
        | url_use_webapp    | 0         |
        | url_html_location | test.html |
    And someone has posted "this is a test http://foobar.com/"
    When the html files are updated
    Then a file named "test.html" should exist
    And the file "test.html" should contain "http://foobar.com/"
