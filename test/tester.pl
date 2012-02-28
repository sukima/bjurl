#! /usr/bin/perl -w
#
# A wrapper script to interperate command line options into function calls.
# This is used to test each method in the bjurl.pl as part of the Cukumber
# testing.
#

# Constants that are not defined when run outside of irssi
use constant MSGLEVEL_NO_URL => 0;
use constant MSGLEVEL_CLIENTERROR => 0;
use constant MSGS => 0;

die "Incorrect number of arguments" if ($#ARGV+1 < 1);
require "irssi.pl";
require "bjurl.pl";

# Since bjurl.pl is loaded prior to us assigning any values the default are
# there but our arguments override after definition.
my ($method) = shift;
my (@arg_list) = ( );
my ($text) = "";
my ($stop_steps) = 0; # 0 => method args, 1 => text to parse, 2 => setting=options
foreach my $arg (@ARGV) {
    if ($arg eq "--") {
        $stop_steps++;
    } elsif ($stop_steps == 0) {
        push @arg_list, $arg;
    } elsif ($stop_steps == 1) {
        $text = "$text $arg";
    } else {
        my ($k, $v) = split(/=/, $arg);
        $Irssi::script_options{ $k } = $v;
    }
}

# print STDERR "method = $method\n";
# print STDERR "arg_list = @arg_list\n";
# print STDERR "text = $text\n";
# print STDERR "settings = ". %Irssi::script_options ."\n";

if ($method eq "print_text") {
    # Ignore arg_list from above make our own.
    &print_text({"level"=>1,"target"=>"nick"}, $text, $text);
} elsif ($method eq "test_mem_storage") {
    for($i = 0; $i < $arg_list[0]; $i++) {
        &push_items({
            time => time,
            target => "foobar",
            pre_url => "Test url post: ",
            url => "http://test.com/",
            post_url => " #$i"
        });
    }
    &split_and_insert("nick", "text $text", $text);
    print "Total number of urls stored: ";
    print scalar(&get_items);
    print "\n";
} else {
    &split_and_insert("nick", "text $text", $text);
    &$method(@arg_list);
}
