# Setup mocks for the Irssi specific code.

package Irssi;

$VERSION = "20020121.2020";

our %script_options = ( );

sub settings_add_str {
    print "settings_add_str called with @_\n";
    $script_options{ $_[1] } = $_[2]; # ignore first argument
}

sub settings_add_bool {
    print "settings_add_bool called with @_\n";
    $script_options{ $_[1] } = ($_[2]) ? "ON" : "OFF"; # ignore first argument
}

sub signal_add { print "signal_add called with @_\n"; }

sub command_bind { print "command_bind called with @_\n"; }

sub settings_get_str {
    print "settings_get_str called for $_[0]\n";
    return $script_options{ $_[0] };
}

sub settings_get_bool {
    print "settings_get_bool called for $_[0]\n";
    return ($script_options{ $_[0] } =~ /ON/i) ? 1 : 0;
}

sub level2bits {
    print "level2bits called\n";
    return 1;
}

sub signal_emit {
    print "signal_emit called:\n";
    print "  @_\n";
}

sub signal_stop { print "signal_stop called\n"; }

sub print { print "@_\n"; }

1;
