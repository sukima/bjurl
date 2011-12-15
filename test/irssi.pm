# Setup mocks for the Irssi specific code.

package Irssi;

$VERSION = "20020121.2020";

our %script_options = ( );

sub settings_add_str {
    $script_options{ $_[1] } = $_[2]; # ignore first argument
}

sub settings_add_bool {
    $script_options{ $_[1] } = ($_[2]) ? "ON" : "OFF"; # ignore first argument
}

sub signal_add { 1; } # do nothing, stub

sub command_bind { 1; } # do nothing, stub

sub settings_get_str {
    return $script_options{ $_[0] };
}

sub settings_get_bool {
    return ($script_options{ $_[0] } =~ /ON/i) ? 1 : 0;
}

sub level2bits {
    return 0;
}

sub signal_emit { 1; } # do nothing, stub

sub signal_stop { 1; } # do nothing, stub

sub print {
    print "@_\n";
}

1;
