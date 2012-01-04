Before do
  @settings = "";
  @line = "";
end

def run_bjurl_method(method, args="")
  # aruba's sandbox default is "tmp/aruba" therefore all files needed are found in "../.."
  run_simple(unescape("perl -I../.. -I../../test ../../test/tester.pl #{method} #{args} -- #{@line} -- #{@settings}"))
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
  run_bjurl_method "update_site_files"
end

When /^someone posts "([^"]*)"$/ do |arg1|
  @line = arg1
  run_bjurl_method "print_text"
end
