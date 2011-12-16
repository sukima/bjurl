// Helper function buildJSONObject() {{{
var buildJSONObject = function(text) {
    var a;
    var json = '[';
    if (typeof text == "array") {
        a = text;
    } else {
        a = [ text ];
    }
    for (var i=0; i < a.length; i++) {
        json = json + '{"time":"timestamp","nick":"nickname","message":"' + a[i] + '"}';
        if (i<a.length-1) { json = json + ','; }
    }
    json = json + ']';
    return json;
}; // }}}


$(document).ready(function(){
    if (Site) {
        // Check that the main script is loaded
        // If so we no longer need the warning
        $("#testwarning").remove();
    }


    // Module show_error {{{1
    module("show_error", {
        setup: function() {
            this.err = $("<div/>",{id:"error"}).appendTo("#qunit-fixture");
        }
    });
    test("hides #error when error_msg is empty", function() {
        Site.error_msg = "";
        Site.show_error();
        ok(!this.err.is(":visible"), "#error is not visible");
    });
    test("Displays #error when error_msg is not empty", function() {
        Site.error_msg = "error_msg_test_string";
        Site.show_error();
        ok(this.err.is(":visible"), "#error is visible");
        equal(this.err.text(), "error_msg_test_string", "#error equals 'error_msg_test_string'");
        equal(Site.error_msg, "", "Site.error_msg was reset");
    });


    // Module populate {{{1
    module("populate", {
        setup: function() {
            this.update_time = $("<div/>",{id:"update-time"}).appendTo("#qunit-fixture");
            this.url_list = $("<div/>",{id:"url-list"}).appendTo("#qunit-fixture");
        }
    });
    test("", function() {
        ok(false, "pending");
    });


// }}}1
});
/* vim:set fdm=marker: */
