# bjurl

This is an [irssi][1] script that grabs the URLs printed in any window and logs
it to a web site.

To see this in action see the [Demo](http://sukima.github.com/bjurl/).

[1]: http://irssi.org/

## Acknowledgements

This script is a direct fork of the [Better URL (burl)][2] script by **Hugo
Haas** and much of the same code is still there.

[2]: http://larve.net/people/hugo/2003/scratchpad/IrssiUrlGrabbing.html

## Installation

Simply [download][3] place the `bjurl.pl` file into your `.irssi/scripts`
directory. If you want to load the script every time irssi starts link to it
in your `.irssi/scripts/autoload`.

[3]: https://raw.github.com/sukima/bjurl/master/bjurl.pl

## Usage

The `/url` command allows you to interact with the plugin.

    /URL [-clear|-clean|-refresh|<number>]

    	-clear will clear the URL list.
    	-clean removes any writen files.
    	-refresh cleans and rewrites HTML files.

    	<number> will open the specified URL.

    	If no arguments are specified, force the files to update with
    	latest URLs and open the site.

#### Configuration
- `url_grab_level`: message levels to take in consideration. example: PUBLICS ACTIONS
- `url_redundant`: whether to assign same URL a new number or not. example: ON
- `url_verbose_grab`: whether to grab verbosely or not. example: OFF
- `url_hilight`: whether to hilight the URLs in the text or not example: OFF
- `browse_command`: a command used to open URLs. %u will be replaced by the URL. example: galeon %u &
- `url_html_location`: where to write the URL list. example: ~/.irssi-urls.html
- `url_use_webapp`: create a dynamic JavaScript based web app or just a static html file. example: OFF


## Testing

The `Gemfile` file uses [bundler][4] to install the [cucumber][5] gem. Once
installed you can run the `test/run_tests.sh` file. It will run through the
cucumber tests and then output a `file://` link to a test page that you can
copy and paste to your browser to test the JavaScript. (Internet connection
required for CDN access)

Javascript tests use [Qunit][6] and [SinonJS][7].

[4]: http://gembundler.com/
[5]: http://cukes.info/
[6]: http://docs.jquery.com/QUnit
[7]: http://sinonjs.org/

#### Why would I use cucumber with an irssi perl script?

I wanted to learn cucumber. I had no relevent Ruby projects to work on at the time.

## License
Copyright &copy; 2011 Devin Weaver. All Rights Reserved.  
Copyright &copy; 2003 Hugo Haas. All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. The name of the author may not be used to endorse or promote products
   derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY [LICENSOR] "AS IS" AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
OF SUCH DAMAGE.
