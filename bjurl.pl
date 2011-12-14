# This is a code fork of burl.pl by Hugo Haas.
# burl.pl by Hugo Haas was a code fork of Jean-Yves Lefort's url.pl, version 0.54.

use Irssi 20020121.2020 ();
use URI::Escape;
use HTML::Entities;
$VERSION = "1.0";
%IRSSI = (
	  authors     => 'Devin weaver',
	  contact     => 'suki\@tritarget.org',
	  name        => 'bjurl',
	  description => 'A better jQuery URL grabber for Irssi',
	  license     => 'BSD',
	  changed     => '2011/12/13',
	  modules     => 'URI::Escape HTML::Entities',
	  commands    => 'bjurl'
);

# description:
#
#	burl.pl grabs URLs in messages and allows you to open them on the fly,
#	or to write them in a HTML file and open that file.
#
# /set's:
#
#	url_grab_level
#
#		message levels to take in consideration
#		example: PUBLICS ACTIONS
#
#	url_redundant
#
#		whether to assign same URL a new number or not
#		example: ON
#
#	url_verbose_grab
#
#		whether to grab verbosely or not
#		example: OFF
#
#	url_hilight
#
#		whether to hilight the URLs in the text or not
#		example: OFF
#
#	url_index_color
#
#               NOT USED ANYMORE
#		hilight index color (mirc color string)
#
#	url_color
#
#               NOT USED ANYMORE
#		hilight URL color (mirc color string)
#
#	browse_command
#
#		a command used to open URLs
#		%u will be replaced by the URL
#		example: galeon %u &
#
#	url_html_location
#
#		where to write the URL list
#		example: ~/.irssi-urls.html
#
#	url_use_webapp
#
#	        create a dynamic JavaScript based web app or
#	        just a static html file
#	        example: OFF
#
# commands
#
#	/URL [-clear|<number>]
#
#		-clear will clear the URL list.
#
#		<number> will open the specified URL.
#
#		If no arguments are specified, a HTML file containing all
#		grabbed URLs will be written and opened.

use strict;
use POSIX qw(strftime);

#use constant MSGLEVEL_NO_URL => 0x0400000;

my @items;

# -verbatim- import expand
sub expand {
  my ($string, %format) = @_;
  my ($len, $attn, $repl) = (length $string, 0);
  
  $format{'%'} = '%';

  for (my $i = 0; $i < $len; $i++) {
    my $char = substr $string, $i, 1;
    if ($attn) {
      $attn = undef;
      if (exists($format{$char})) {
	$repl .= $format{$char};
      } else {
	$repl .= '%' . $char;
      }
    } elsif ($char eq '%') {
      $attn = 1;
    } else {
      $repl .= $char;
    }
  }
  
  return $repl;
}
# -verbatim- end

sub split_and_insert {
    my ($target, $text, $stripped) = @_;

    if ($stripped =~ /[a-zA-Z0-9+-.]+:\/\/[^ \t\<\>\"]+/o) {
	my $num = -1;
	if (! Irssi::settings_get_bool('url_redundant')) {
	    my $n = 1;
	    foreach (@items) {
		if ($_->{url} eq $&) {
		    $num = $n;
		    last;
		}
		$n++;
	    }
	}

	if ($num == -1) {
	    push @items,
	    {
		time => time,
		target => $target,
		pre_url => "$`",
		url => "$&",
		post_url => "$'"
		};
	    $num = @items;
            &update_site_files;
	    Irssi::print('Added item #' . $num . ' to URL list')
		if Irssi::settings_get_bool('url_verbose_grab');
	}

	my $url_pos = index $text, $&;
	my $left = substr($text, $url_pos + length $&);
	$stripped = substr($stripped, index($stripped, $&) + length $&);

#	if (Irssi::settings_get_bool('url_hilight')) {
#	    $text =  substr($text, 0, $url_pos) .
#		Irssi::settings_get_str('url_index_color') . $num . ':'.
#		Irssi::settings_get_str('url_color') . $& . '';
#	}
	if (Irssi::settings_get_bool('url_hilight')) {
	    $text =  substr($text, 0, $url_pos) .
		'' . $num . ':<' . $& . '>';
	}
	return($text, $left, $stripped);
    } {
	return ($text, '', '');
    }
}

my $inprogress = 0;

sub print_text {
  my ($textdest, $t, $stripped) = @_;

#  return if ($textdest->{level} & MSGLEVEL_NO_URL);
  return if ($inprogress);

  if (Irssi::level2bits(Irssi::settings_get_str('url_grab_level'))
      & $textdest->{level}) {

      my $s = $stripped;
      my $text;

      my $l;
      $l = $t;
      while($l ne '') {
	  my $r;
	  ($r, $l, $s) = &split_and_insert($textdest->{target}, $l, $s);
	  $text .= $r;
      }

      if (($text ne $t) && Irssi::settings_get_bool('url_hilight')) {
#	  $textdest->{level} |= MSGLEVEL_NO_URL;
	  $inprogress = 1;
	  Irssi::signal_emit('print text', $textdest,
			     $text, $stripped);
	  $inprogress = 0;
	  Irssi::signal_stop();
      }
  }
}

sub update_site_files {
  my ($path) = glob Irssi::settings_get_str('url_html_location'); 
  $path =~ s+/$++; # Remove trailing slashes if any
  if (Irssi::settings_get_bool('url_use_webapp')) {
      # Assume $path is a directory
      my ($css) = "${path}/style.css";
      my ($js) = "${path}/script.js";
      my ($html) = "${path}/index.html";
      my ($json) = "${path}/urls.json";
      if (! -e $css) {
          if (my $error = write_css_file($css)) {
              Irssi::print("Unable to write $css: $error", MSGLEVEL_CLIENTERROR);
              return 0;
          }
      }
      if (! -e $js) {
          if (my $error = write_js_file($js)) {
              Irssi::print("Unable to write $js: $error", MSGLEVEL_CLIENTERROR);
              return 0;
          }
      }
      if (! -e $html) {
          if (my $error = write_html_file($html)) {
              Irssi::print("Unable to write $html: $error", MSGLEVEL_CLIENTERROR);
              return 0;
          }
      }
      # Always write new json file
      if (my $error = write_json_file($json)) {
          Irssi::print("Unable to write $json: $error", MSGLEVEL_CLIENTERROR);
          return 0;
      }
      $path = $html;
  } else {
      $path = "${path}/index.html" if (-d $path);
      if (my $error = write_static_file($path)) {
          Irssi::print("Unable to write $path: $error", MSGLEVEL_CLIENTERROR);
          return 0;
      }
  }
  return $path;
}

sub write_static_file {
  my $file = shift;

  open(FILE, ">$file") or return $!;

  print FILE <<'EOF' or return $!;
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>IRC URL list</title>
  </head>
  <body>
    <center>
      <table border="1" cellpadding="5">
	<caption>IRC URL list</caption>
	<tr><th>Time</th><th>Target</th><th>Message</th></tr>
EOF

  foreach (@items) {
    my $timestamp = strftime('%Y-%m-%d %H:%M%Z', localtime $_->{time});
    print FILE
	"	<tr><td>$timestamp</td><td>$_->{target}</td><td>$_->{pre_url}<a href='"
	. HTML::Entities::encode(uri_escape($_->{url}, "^-A-Za-z0-9./:")) . "'>"
	. HTML::Entities::encode($_->{url}) . "</a>$_->{post_url}</td></tr>\n"
	or return $!;
  }
  
  print FILE <<'EOF' or return $!;
      </table>
    </center>
    <hr>
    <center><small>Generated by burl.pl</small></center>
  </body>
</html>
EOF

  close(FILE) or return $!;

  return undef;
}

sub url {
  my ($args, $server, $item) = @_;
  my $command = Irssi::settings_get_str('browse_command');

  if ($args ne '') {
    if (lc $args eq '-clear') {
      @items = ();
      Irssi::print('URL list cleared');
    } elsif ($args =~ /^[0-9]+$/) {
      if ($args > 0 && $items[$args - 1]) {
	system(expand($command, 'u', $items[$args - 1]->{url}));
      } else {
	Irssi::print("URL #$args not found");
      }
    } else {
      Irssi::print('Usage: /URL [-clear|<number>]', MSGLEVEL_CLIENTERROR);
    }
  } else {
    if (@items) {
      my $file;
      if ($file = &update_site_files) {
	system(expand($command, 'u', $file)) if ($command && $command ne "");
      }
    } else {
      Irssi::print('URL list is empty');
    }
  }
}

Irssi::settings_add_str('misc', 'url_grab_level',
			'PUBLIC TOPICS ACTIONS MSGS DCCMSGS');
Irssi::settings_add_bool('lookandfeel', 'url_verbose_grab', undef);
Irssi::settings_add_bool('lookandfeel', 'url_hilight', 1);
#Irssi::settings_add_str('lookandfeel', 'url_index_color', '08');
#Irssi::settings_add_str('lookandfeel', 'url_color', '12');
Irssi::settings_add_bool('misc', 'url_redundant', 0);
Irssi::settings_add_str('misc', 'browse_command',
			'galeon-wrapper %u >/dev/null &');
Irssi::settings_add_str('misc', 'url_html_location', '~/.irc_url_list.html');
Irssi::settings_add_bool('misc', 'url_use_webapp', 0);

Irssi::signal_add('print text', \&print_text);

Irssi::command_bind('url', \&url);
