Given /^the static file was created$/ do
  write_file "test.html", "test_static_file"
end

When /^the user enters the command "([^"]*)"$/ do |arg1|
  if arg1 == "/url refresh"
    run_simple(unescape("perl -I../.. ../../tester.pl refresh_site_files"))
  elsif arg1 == "/url clean"
    run_simple(unescape("perl -I../.. ../../tester.pl clean_site_files"))
  else
    pending
  end
end

Given /^the webapp was created$/ do
  write_file "test/index.html", "test_webapp_file"
  write_file "test/style.css", "test_webapp_file"
  write_file "test/script.js", "test_webapp_file"
  write_file "test/urls.json", "test_webapp_file"
end
