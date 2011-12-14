Before do
    @settings = "";
    @line = "";
end

Given /^irssi has the following settings$/ do |table|
  # table is a Cucumber::Ast::Table
  table.hashes.each do |item|
    @settings << "#{item[:setting]}=#{item[:value]} "
  end
end

Given /^someone has posted "([^"]*)"$/ do |arg1|
    @line = arg1
end

When /^the html files are updated$/ do
    # aruba's sandbox default is "tmp/aruba" therefore all files needed are found in "../.."
    run_simple(unescape("perl -I../.. ../../tester.pl update_site_files -- #{@line} -- #{@settings}"))
end
