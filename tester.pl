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

die "Incorrect number of arguments" if ($#ARGV+1 < 2);
use Irssi;
require "bjurl.pl";

# Since bjurl.pl is loaded prior to us assigning any values the default are
# there but our arguments override after definition.
my ($method) = shift;
foreach my $arg (@ARGV) {
    my ($k, $v) = split(/=/, $arg);
    $Irssi::script_options{ $k } = $v;
}

&$method();
