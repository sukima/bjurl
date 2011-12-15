Given /^the static file was created$/ do
  write_file "test.html", "test_static_file"
end

When /^the user enters the command "([^"]*)"$/ do |arg1|
    arg = arg1.split(" ")[1]
    run_simple(unescape("perl -I../.. ../../tester.pl url #{arg}"))
end

Given /^the webapp was created$/ do
  write_file "test/index.html", "test_webapp_file"
  write_file "test/style.css", "test_webapp_file"
  write_file "test/script.js", "test_webapp_file"
  write_file "test/urls.json", "test_webapp_file"
end
