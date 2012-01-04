#!/bin/bash

# $Id: $

if test "$1" = "-d"; then
    OUTPUT=""
else
    OUTPUT=">&-"
fi

OLDDIR=`pwd`
DIR=`dirname $0`
cd $DIR/..
DIR=`pwd` # Make path absolute

# Run cucumber tests
cucumber

# Clean temp files
rm -f tmp/aruba/test/*

# Rebuild web files
eval perl -I. -Itest test/tester.pl update_site_files -- this is a test http://foobar.com/ -- url_use_webapp=ON url_html_location=tmp/aruba/test $OUTPUT

# return to previous directory
cd $OLDDIR

echo
echo "To test JavaScript please open your browser to file://$DIR/test/test.html"
echo
