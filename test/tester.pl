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
use Irssi;
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
&split_and_insert("nick", "text $text", $text);
&$method(@arg_list);
