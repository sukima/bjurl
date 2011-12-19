var bjurlTest = { permsCheckReturn: 0 };
// Helper function buildData() {{{
bjurlTest.buildData= function(textarray) {
    var d = [ ];
    if (!$.isArray(textarray)) { textarray = [ textarray ]; }
    for (var i=0; i < textarray.length; i++) {
        d.push({ time: "timestamp", nick: "nickname", message: textarray[i] });
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
            $.extend(Site, { data: [ ], size: 0, running: false, timer: null, error_msg: "" });
            this.show_error = Site.show_error;
            Site.show_error = function() { ok(true, "show_error was called"); };
        },
        teardown: function() {
            Site.show_error = this.show_error;
            $.extend(Site, { data: [ ], size: 0, running: false, timer: null, error_msg: "" });
        }
    });
    test("First time without data", 7, function() {
        Site.data = [ ];
        Site.populate();
        ok(Site.running, "Application is in running state");
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(this.nodata.is(":visible"), "#nodata is not hidden");
        ok($(".url-item").length == 0, "#url-list not populated");
    });
    test("First time with data", 7, function() {
        Site.data = bjurlTest.buildData("test");
        Site.populate();
        ok(Site.running, "Application is in running state");
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(!this.nodata.is(":visible"), "#nodata is hidden");
        ok($(".url-item").length == 1, "#url-list populated");
    });
    test("Running state without new data", 6, function() {
        Site.running = true;
        Site.populate();
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(this.nodata.is(":visible"), "#nodata is not hidden");
        ok($(".url-item").length == 0, "#url-list not populated");
    });
    test("Running state with new data", 6, function() {
        Site.data.push(bjurlTest.buildData("test"));
        Site.size = 0;
        Site.running = true;
        Site.populate();
        ok(Site.update !== undefined, "Updates the timestamp");
        ok(this.update_time.text() != "", "Time is displayed");
        equal(Site.size, Site.data.length, "Site.size updated");
        ok(!this.nodata.is(":visible"), "#nodata is hidden");
        ok($(".url-item").length == 1, "#url-list populated");
    });


    // Module timeout functions {{{1
    module("Timeout functions", {
        setup: function() {
            var that = this;
            this.fetch = Site.fetch;
            this.populate = Site.populate;
            Site.fetch = function() { ok(true, "Site.fetch called from timeout"); start(); };
            Site.populate = function() { ok(true, "Site.populate called from timeout"); };
            Site.refresh = 1;
        },
        teardown: function() {
            clearTimeout(Site.timer);
            Site.timer = null;
            Site.fetch = this.fetch;
            Site.populate = this.populate;
            Site.refresh = 30000;
        }
    });
    asyncTest("continueCycle", 3, function() {
        Site.continueCycle();
        ok(Site.timer !== undefined, "Site.timer is not undefined");
        ok(Site.timer !== null, "Site.timer is not null");
    });
    asyncTest("success", 3, function() {
        Site.success(bjurlTest.buildData(["test","test2"])); // Calls populate, continueCycle->fetch
        equal(Site.data.length, 2, "Site.data updated");
    });
    asyncTest("error", 3, function() {
        Site.error(null, null, "test error"); // Calls populate, continueCycle->fetch
        ok(Site.error_msg != "", "Site.error_msg populated");
    });


    // Module clear {{{1
    module("clear", {
        setup: function() {
            this.item = $("<div/>", {class:"url-item"}).appendTo("#qunit-fixture");
            this.nodata = $("<div/>", {id:"nodata"}).appendTo("#qunit-fixture");
            this.nodata.hide();
        }
    });
    test("Clears the list of data", 3, function() {
        var ret = Site.clear();
        ok(!ret, "Function returns false");
        ok($(".url-item").length == 0, "Item removed");
        ok(this.nodata.is(":visible"), "#nodata is visible");
    });


    // Module fetch
    module("fetch", {
        setup: function() {
            this.ajax = $.ajax;
            $.ajax = function() { ok(true, "$.ajax called"); };
            $.extend(Site, { data: [ ], size: 0, running:true, timer: "test_value", error_msg: "" });
        },
        teardown: function() {
            $.ajax = this.ajax;
            $.extend(Site, { data: [ ], size: 0, running: false, timer: null, error_msg: "" });
        }
    });
    test("Prepare and run AJAX fetch", 3, function() {
        var ret = Site.fetch();
        ok(Site.timer === null, "Resets Site.timer");
        ok(!ret, "Returns false");
    });


// }}}1
});
/* vim:set fdm=marker: */
