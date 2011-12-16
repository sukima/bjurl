// Helper function buildData() {{{
var buildData= function(text) {
    var a;
    var d = [ ];
    if (typeof text == "array") {
        a = text;
    } else {
        a = [ text ];
    }
    for (var i=0; i < a.length; i++) {
        d.push({ time: "timestamp", nick: "nickname", message: a[i] });
    }
    return d;
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
            this.nodata = $("<div/>",{id:"nodata"}).appendTo("#qunit-fixture");
            this.url_list = $("<div/>",{id:"url-list"}).appendTo("#qunit-fixture");
            $.extend(Site, { data: [ ], size: 0, running: false, timmer: null, error_msg: "" });
            this.show_error = Site.show_error;
            this.show_error_called = false;
            var that = this;
            Site.show_error = function() { that.show_error_called = true; };
        },
        teardown: function() {
            Site.show_error = this.show_error;
            $.extend(Site, { data: [ ], size: 0, running: false, timmer: null, error_msg: "" });
        }
    });
    test("First time without data", function() {
        Site.data = [ ];
        Site.populate();
        ok(Site.running, "Application is in running state");
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(this.nodata.is(":visible"), "#nodata is not hidden");
        ok(this.show_error_called, "show_error was called");
        ok($(".url-item").length == 0, "#url-list not populated");
    });
    test("First time with data", function() {
        Site.data = buildData("test");
        Site.populate();
        ok(Site.running, "Application is in running state");
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(!this.nodata.is(":visible"), "#nodata is hidden");
        ok(this.show_error_called, "show_error was called");
        ok($(".url-item").length == 1, "#url-list populated");
    });
    test("Running state without new data", function() {
        Site.running = true;
        Site.populate();
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(this.nodata.is(":visible"), "#nodata is not hidden");
        ok(this.show_error_called, "show_error was called");
        ok($(".url-item").length == 0, "#url-list not populated");
    });
    test("Running state with new data", function() {
        Site.data.push(buildData("test"));
        Site.size = 0;
        Site.running = true;
        Site.populate();
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(!this.nodata.is(":visible"), "#nodata is hidden");
        ok(this.show_error_called, "show_error was called");
        ok($(".url-item").length == 1, "#url-list populated");
    });


// }}}1
});
/* vim:set fdm=marker: */
