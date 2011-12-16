#!/bin/bash

# $Id: $

OLDDIR=`pwd`
DIR=`dirname $0`
cd $DIR/..
DIR=`pwd` # Make path absolute
cucumber
perl -I. -Itest test/tester.pl update_site_files -- this is a test http://foobar.com/ -- url_use_webapp=ON url_html_location=tmp/aruba/test
cd $OLDDIR
echo
echo "To test JavaScript please open your browser to file://$DIR/test/test.html"
echo
